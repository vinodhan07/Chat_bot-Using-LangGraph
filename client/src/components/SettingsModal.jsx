import React, { useState } from 'react';
import { X, Shield, FileText, Info } from 'lucide-react';
import './Modal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('privacy');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content settings-modal fade-in">
        <div className="modal-header">
          <div className="modal-title">
            <Shield size={20} />
            <span>Settings & Policies</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="settings-container">
          <div className="settings-sidebar">
            <button className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
              <Shield size={16} /> Privacy Policy
            </button>
            <button className={`settings-tab ${activeTab === 'terms' ? 'active' : ''}`} onClick={() => setActiveTab('terms')}>
              <FileText size={16} /> Terms of Service
            </button>
            <button className={`settings-tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
              <Info size={16} /> About
            </button>
          </div>

          <div className="settings-main">
            {activeTab === 'privacy' && (
              <div className="settings-content scrollable">
                <h3 className="settings-heading">Privacy Policy</h3>
                <p><strong>Effective Date: April 2026</strong></p>
                <p>Welcome to **Vindh AI**. Your privacy is paramount to us. This policy describes how we handle your data.</p>
                
                <h4 className="settings-subheading">1. Data Collection</h4>
                <p>We collect search queries to provide accurate research results. We do not sell your personal data to third parties.</p>

                <h4 className="settings-subheading">2. Usage</h4>
                <p>Your research history is stored locally and encrypted. We use this data only to improve your experience.</p>

                <h4 className="settings-subheading">3. Security</h4>
                <p>We implement industry-standard security measures to protect your information and ensure safe browsing.</p>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="settings-content scrollable">
                <h3 className="settings-heading">Terms Of Service</h3>
                <p>By using **Vindh AI**, you agree to the following terms:</p>
                
                <h4 className="settings-subheading">1. Acceptable Use</h4>
                <p>You agree to use the service for legitimate research and educational purposes only.</p>

                <h4 className="settings-subheading">2. Limitations</h4>
                <p>Vindh AI provides information based on search results. We do not guarantee the absolute accuracy of external sources.</p>

                <h4 className="settings-subheading">3. Intellectual Property</h4>
                <p>The Vindh AI branding and search algorithms are the property of the developers.</p>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="settings-content scrollable">
                <h3 className="settings-heading">About Vindh AI</h3>
                <p><strong>Version: 2.0 (Premium)</strong></p>
                <p>Vindh AI is a cutting-edge research assistant designed to synthesize complex information into clear, actionable answers.</p>
                <p>© 2026 Vinodhan AI Research Lab. All rights reserved.</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
