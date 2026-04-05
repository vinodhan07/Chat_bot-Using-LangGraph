from typing import TypedDict, Annotated, Optional
from langgraph.graph import add_messages, StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessageChunk, ToolMessage
from dotenv import load_dotenv
from langchain_tavily import TavilySearch
from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json
from uuid import uuid4
from langgraph.checkpoint.memory import MemorySaver

load_dotenv()

memory = MemorySaver()

class State(TypedDict):
    messages: Annotated[list, add_messages]

search_tool = TavilySearch(
    max_results=4,
)

tools = [search_tool]

llm = ChatGoogleGenerativeAI(model="gemini-flash-lite-latest")

SYSTEM_PROMPT = """You are a highly advanced AI research assistant. Your goal is to provide deep, analytical, and well-researched answers to users' questions.

When a user asks a question:
1.  **Analyze the intent**: Determine exactly what needs to be researched.
2.  **Use Search Tools**: Always use the search tool to find the latest and most relevant data if the question requires factual information.
3.  **Synthesis & Analysis**: Don't just list search results. Analyze the data found across multiple sources. Identify key themes, strategic moves, or detailed facts as requested.
4.  **Citations & Evidence**: Provide a cohesive answer that summarizes the findings clearly, citing sources where appropriate.
5.  **Multi-Step Reasoning**: If the initial search results are insufficient, feel free to perform follow-up searches to get more detail.

Be professional, concise, and highly accurate."""


llm_with_tools = llm.bind_tools(tools=tools)

async def model(state: State):
    result = await llm_with_tools.ainvoke(state["messages"])
    return {
        "messages": [result], 
    }

async def tools_router(state: State):
    last_message = state["messages"][-1]

    if(hasattr(last_message, "tool_calls") and len(last_message.tool_calls) > 0):
        return "tool_node"
    else: 
        return END
    
async def tool_node(state):
    """Custom tool node that handles tool calls from the LLM."""
    tool_calls = state["messages"][-1].tool_calls
    
    tool_messages = []
    
    for tool_call in tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        tool_id = tool_call["id"]
        
        if tool_name == "tavily_search":
            search_results = await search_tool.ainvoke(tool_args)
            
            tool_message = ToolMessage(
                content=str(search_results),
                tool_call_id=tool_id,
                name=tool_name
            )
            
            tool_messages.append(tool_message)
    
    return {"messages": tool_messages}

graph_builder = StateGraph(State)

graph_builder.add_node("model", model)
graph_builder.add_node("tool_node", tool_node)
graph_builder.set_entry_point("model")

graph_builder.add_conditional_edges(
    "model", 
    tools_router,
    {"tool_node": "tool_node", END: END}
)
graph_builder.add_edge("tool_node", "model")

graph = graph_builder.compile(checkpointer=memory)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
    expose_headers=["Content-Type"], 
)

def serialise_ai_message_chunk(chunk): 
    if isinstance(chunk, AIMessageChunk):
        content = chunk.content
        if isinstance(content, list):
            text_parts = []
            for item in content:
                if isinstance(item, str):
                    text_parts.append(item)
                elif isinstance(item, dict) and "text" in item:
                    text_parts.append(item["text"])
            return "".join(text_parts)
        return str(content)
    else:
        raise TypeError(
            f"Object of type {type(chunk).__name__} is not correctly formatted for serialisation"
        )

async def generate_chat_responses(message: str, checkpoint_id: Optional[str] = None):
    is_new_conversation = checkpoint_id is None
    
    if is_new_conversation:
        new_checkpoint_id = str(uuid4())

        config = {
            "configurable": {
                "thread_id": new_checkpoint_id
            }
        }
        
        from langchain_core.messages import SystemMessage

        initial_messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=message)
        ]

        events = graph.astream_events(
            {"messages": initial_messages},
            version="v2",
            config=config
        )
        
        yield f"data: {{\"type\": \"checkpoint\", \"checkpoint_id\":\"{new_checkpoint_id}\"}}\n\n"
    else:
        config = {
            "configurable": {
                "thread_id": checkpoint_id
            }
        }
        # Continue existing conversation
        events = graph.astream_events(
            {"messages": [HumanMessage(content=message)]},
            version="v2",
            config=config
        )

    async for event in events:
        event_type = event["event"]
        
        if event_type == "on_chat_model_stream":
            chunk_content = serialise_ai_message_chunk(event["data"]["chunk"])
            content_json = json.dumps(chunk_content)
            
            yield f"data: {{\"type\": \"content\", \"content\": {content_json}}}\n\n"
            
        elif event_type == "on_chat_model_end":
            tool_calls = event["data"]["output"].tool_calls if hasattr(event["data"]["output"], "tool_calls") else []
            search_calls = [call for call in tool_calls if call["name"] == "tavily_search"]
            
            if search_calls:
                search_query = search_calls[0]["args"].get("query", "")
                safe_query = search_query.replace('"', '\\"').replace("'", "\\'").replace("\n", "\\n")
                yield f"data: {{\"type\": \"search_start\", \"query\": \"{safe_query}\"}}\n\n"
                
        elif event_type == "on_tool_end" and event["name"] == "tavily_search":
            output = event["data"]["output"]
            
            # Extract list depending on object shape (handles older and newer tavily packages)
            results_list = []
            if isinstance(output, list):
                results_list = output
            elif isinstance(output, dict) and "results" in output:
                results_list = output["results"]
                
            if results_list:
                urls = []
                results = []
                for item in results_list:
                    if isinstance(item, dict) and "url" in item:
                        urls.append(item["url"])
                        results.append({
                            "url": item.get("url", ""),
                            "title": item.get("title", "Source"),
                            "content": item.get("content", "")[:200]  # truncate content to avoid massive payloads
                        })
                
                # Convert to JSON securely
                urls_json = json.dumps(urls)
                results_json = json.dumps(results)
                
                # Yield both flat URLs and full source objects
                yield f"data: {{\"type\": \"search_results\", \"urls\": {urls_json}, \"results\": {results_json}}}\n\n"
    
    # Send an end event
    yield f"data: {{\"type\": \"end\"}}\n\n"

@app.get("/chat_stream/{message}")
async def chat_stream(message: str, checkpoint_id: Optional[str] = Query(None)):
    return StreamingResponse(
        generate_chat_responses(message, checkpoint_id), 
        media_type="text/event-stream"
    )

# SSE - server-sent events 