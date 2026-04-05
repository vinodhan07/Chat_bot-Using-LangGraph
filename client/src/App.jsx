import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Search, Loader2, ArrowUp, Paperclip, Mic, Scale, Globe, MoreHorizontal, Upload, Send, Cpu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import SourceCard from './components/SourceCard';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
  const [view, setView] = useState('landing');
  const [query, setQuery] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      firstName: 'Think',
      lastName: 'Chain',
      email: 'hello@thinkchain.ai',
      theme: 'light'
    };
  });
  
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleGetStarted = () => setView('login');
  const handleLogin = () => setView('chat');
  const handleBackToLanding = () => setView('landing');
  const handleNewChat = () => {
    setChatStarted(false);
    setMessages([]);
    setQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const currentQuery = query.trim();
    setQuery('');
    setChatStarted(true);
    
    const newMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: `user-${newMsgId}`,
      role: 'user',
      content: currentQuery
    }]);

    const aiMsgId = `ai-${newMsgId}`;
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      sources: [],
      query: currentQuery 
    }]);
    
    setIsTyping(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/chat_stream/${encodeURIComponent(currentQuery)}`);
      
      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        
        const lines = chunkValue.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const dataStr = line.substring(6);
                if (!dataStr.trim()) continue;
                
                try {
                    const data = JSON.parse(dataStr);
                    
                    if (data.type === 'content') {
                        setMessages(prev => prev.map(msg => 
                            msg.id === aiMsgId 
                            ? { ...msg, content: msg.content + data.content }
                            : msg
                        ));
                    } else if (data.type === 'search_results' && data.results) {
                        setMessages(prev => prev.map(msg => 
                            msg.id === aiMsgId 
                            ? { ...msg, sources: data.results }
                            : msg
                        ));
                    } else if (data.type === 'end') {
                        setIsTyping(false);
                    }
                } catch (e) {
                    console.error("Error parsing chunk", e, dataStr);
                }
            }
        }
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setIsTyping(false);
      setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
          ? { ...msg, content: msg.content + "\n\n**Error:** Failed to fetch response. Please ensure the backend server is running." }
          : msg
      ));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (view === 'landing') return <LandingPage onGetStarted={handleGetStarted} />;
  if (view === 'login') return <LoginPage onLogin={handleLogin} onBack={handleBackToLanding} />;

  return (
    <div className={`app-viewer ${isSidebarHovered ? 'sidebar-open' : ''}`}>
      <div 
        className="sidebar-trigger" 
        onMouseEnter={() => setIsSidebarHovered(true)}
      />
      <div 
        className="sidebar-wrapper"
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <Sidebar 
          user={userProfile} 
          onProfileClick={() => setIsProfileOpen(true)} 
          onNewChat={handleNewChat}
        />
      </div>
      
      <main className="main-content">
        <div className="chat-header">
           <div className="header-brand">
             <span className="brand-name">ThinkChain AI</span>
             <span className="brand-version">v2.0</span>
           </div>
           <div className="header-actions">
             <button className="icon-btn" title="Upload"><Upload size={20} /></button>
             <button className="icon-btn" title="Settings" onClick={() => setIsSettingsOpen(true)}><MoreHorizontal size={20} /></button>
           </div>
        </div>

        {!chatStarted ? (
          <div className="welcome-screen fade-in">
            <h1>Hello, {userProfile.firstName}</h1>
            <div className="welcome-subtitle">Let's make your research easier.</div>
            
            <div className="input-container-wrapper">
              <form onSubmit={handleSubmit} className="chat-input-form">
                <div className="input-box premium-input">
                  <div className="input-icons-left">
                     <button type="button" className="icon-btn-plain" title="Attach file"><Paperclip size={18}/></button>
                  </div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything"
                    disabled={isTyping}
                  />
                  <div className="input-icons-right">
                     <button type="button" className="icon-btn-plain" title="Voice search"><Mic size={18}/></button>
                     <button type="submit" className="send-btn-solid" disabled={!query.trim() || isTyping}>
                        <Send size={18} />
                     </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="category-cards">
               <div className="cat-card" onClick={() => setQuery("What are the most recent rulings on international data privacy?")}>
                  <div className="cat-icon"><Scale size={20} /></div>
                  <div className="cat-info">
                    <h4>Legal Insights</h4>
                    <p>Recent privacy rulings</p>
                  </div>
               </div>
               <div className="cat-card" onClick={() => setQuery("Explain the structure of the International Court of Justice.")}>
                  <div className="cat-icon"><Globe size={20} /></div>
                  <div className="cat-info">
                    <h4>Global Justice</h4>
                    <p>International courts</p>
                  </div>
               </div>
               <div className="cat-card" onClick={() => setQuery("How does AI regulation vary between the EU and US?")}>
                  <div className="cat-icon"><Cpu size={20} /></div>
                  <div className="cat-info">
                    <h4>Law & Technology</h4>
                    <p>AI global regulation</p>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="chat-container">
            {messages.map((message) => (
               <div key={message.id} className="message-row fade-in">
                 {message.role === 'user' ? (
                   <div className="user-message-container">
                     <div className="user-message">
                       {message.content}
                     </div>
                   </div>
                 ) : (
                   <div className="ai-response">
                     <div className="timeline-container">
                       
                       {/* Step 1: Searching */}
                       <div className="timeline-step">
                         <div className="timeline-dot"></div>
                         <div className="timeline-content">
                           <div className="timeline-title active">Searching the web</div>
                           <div className="pill-query">
                             <Search size={14} /> {message.query}
                           </div>
                         </div>
                       </div>

                       {/* Step 2: Reading Sources */}
                       {message.sources && message.sources.length > 0 && (
                         <div className="timeline-step">
                           <div className="timeline-dot"></div>
                           <div className="timeline-content">
                             <div className="timeline-title active">Reading</div>
                             <div className="sources-grid">
                               {message.sources.map((source, idx) => (
                                 <SourceCard 
                                   key={idx} 
                                   index={idx}
                                   url={source.url} 
                                   title={source.title} 
                                 />
                               ))}
                             </div>
                           </div>
                         </div>
                       )}
                       
                       {/* Step 3: Writing content */}
                       {message.content ? (
                          <div className="timeline-step last">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                              <div className="timeline-title active">Writing answer</div>
                              <div className="answer-box">
                                <div 
                                  className="markdown-body" 
                                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(message.content)) }} 
                                />
                              </div>
                            </div>
                          </div>
                       ) : (
                          isTyping && message.id === messages[messages.length - 1].id && (
                             <div className="timeline-step last">
                               <div className="timeline-dot" style={{ backgroundColor: '#d4d4d8' }}></div>
                               <div className="timeline-content">
                                 <div className="typing-indicator">
                                    <Loader2 size={16} /> Generating...
                                 </div>
                               </div>
                             </div>
                          )
                       )}

                     </div>
                   </div>
                 )}
               </div>
            ))}
            <div ref={bottomRef} style={{ height: '100px' }} />
            
            <div className="floating-input">
              <form onSubmit={handleSubmit} className="chat-input-form fade-in">
                <div className="input-box premium-input">
                   <div className="input-icons-left">
                     <button type="button" className="icon-btn-plain" title="Attach file"><Paperclip size={18}/></button>
                  </div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything"
                    disabled={isTyping}
                  />
                  <div className="input-icons-right">
                     <button type="button" className="icon-btn-plain" title="Voice search"><Mic size={18}/></button>
                     <button type="submit" className="send-btn-solid" disabled={!query.trim() || isTyping}>
                        <Send size={18} />
                     </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={userProfile}
        onSave={setUserProfile}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

export default App;
