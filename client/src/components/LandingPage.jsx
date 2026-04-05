import React from 'react';
import { ArrowRight, Zap, Shield, Search } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <div className="landing-content fade-in">
        <div className="landing-logo-container">
          <img src="/logo.png" alt="ThinkChain AI Logo" className="landing-logo" />
        </div>
        
        <h1 className="landing-title">
          ThinkChain <span className="text-accent">AI</span>
        </h1>
        <p className="landing-subtitle">
          The research-first AI assistant that thinks before it speaks. 
          Deep analysis, real-time web exploration, and verified insights.
        </p>

        <div className="landing-features">
          <div className="feature-item">
            <div className="feature-icon"><Zap size={20} /></div>
            <span>Deep Reasoning</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Search size={20} /></div>
            <span>Live Web Search</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Shield size={20} /></div>
            <span>Verified Sources</span>
          </div>
        </div>

        <button className="get-started-btn" onClick={onGetStarted}>
          Get Started <ArrowRight size={20} />
        </button>
      </div>
      
      <div className="landing-footer">
        © 2026 ThinkChain AI Research Lab. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;
