<p align="center">
  <img src="client/public/logo.png" width="120" alt="Vindh AI Logo">
</p>

# 🌟 Vindh AI v2.0

Vindh AI is a premium, full-stack AI Research Assistant that synthesizes complex queries into deep, evidence-based answers. Built with **LangGraph** and powered by **Google Gemini**, it performs real-time web searches using **Tavily** to provide highly accurate and cited information.

---

## 🛠 Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend
-   **Framework**: FastAPI (Python)
-   **AI Orchestration**: LangGraph, LangChain
-   **LLM**: Google Gemini (`gemini-flash-lite-latest`)
-   **Search Engine**: Tavily API

### Frontend
-   **Library**: React 19 (Vite)
-   **Icons**: Lucide React
-   **Markdown Support**: Marked, DOMPurify
-   **Styling**: Pure CSS (Modern UI)

---

## 🏗 Architecture

```mermaid
graph TD
    User([User]) -->|Query| React[React Frontend]
    React -->|SSE Stream| FastAPI[FastAPI Backend]
    FastAPI -->|State| LangGraph[LangGraph Engine]
    
    subgraph AI Orchestration
        LangGraph -->|Analyze| Gemini[Google Gemini LLM]
        LangGraph -->|Search| Tavily[Tavily Search API]
        Tavily -->|Search Results| LangGraph
        Gemini -->|Synthesis| LangGraph
    end
    
    LangGraph -->|Streamed Content| FastAPI
    FastAPI -->|Markdown Response| React
    React -->|Interactive Answer| User
```

---

## 🚀 Features

-   **Deep Research**: Multi-step LangGraph orchestration for searching, reading, and synthesizing information.
-   **Real-time Streaming**: Instant feedback with Server-Sent Events (SSE).
-   **Progress Timeline**: Visualized AI research phases (Searching, Reading, Writing).
-   **Interactive UI**: Sleek, glassmorphism-inspired design with a dynamic slide-out sidebar.
-   **Personalized Profile**: Customizable user settings with initial-driven avatars.
-   **Mobile Responsive**: Optimized for every screen size.

---

## 📂 Project Structure

```text
├── client/          # React Frontend (Vite)
├── server/          # FastAPI Backend (Python)
│   ├── app.py       # Main LangGraph server logic
│   └── .env         # API Credentials
├── .gitignore       # Root tracking protection
└── README.md        # Project documentation
```

---

## ⚙️ Getting Started

### 1. Prerequisites
-   Python 3.10+
-   Node.js 18+
-   Tavily API Key (Get it at [tavily.com](https://tavily.com/))
-   Google Gemini API Key (Get it at [aistudio.google.com](https://aistudio.google.com/))

### 2. Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv .venv
    # Windows
    .\.venv\Scripts\activate
    # macOS/Linux
    source .venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `server` folder and add:
    ```env
    TAVILY_API_KEY=your_tavily_key
    GOOGLE_API_KEY=your_gemini_key
    ```
5.  Start the FastAPI server:
    ```bash
    uvicorn app:app --reload
    ```

### 3. Frontend Setup
1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 License
This project is created for educational and research purposes.

---

Created with ❤️ by **Vinodhan AI Research Lab**.
