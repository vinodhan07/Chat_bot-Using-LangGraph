import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import './LoginPage.css';

const LoginPage = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('demo@thinkchain.ai');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-page">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18} /> Back
      </button>
      
      <div className="login-card fade-in">
        <div className="login-header">
          <img src="/logo.png" alt="ThinkChain Logo" className="login-logo" />
          <h2>Welcome Back</h2>
          <p>Login to your ThinkChain account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            Sign In <LogIn size={18} />
          </button>
        </form>

        <div className="login-footer">
          Don't have an account? <span className="text-accent">Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
