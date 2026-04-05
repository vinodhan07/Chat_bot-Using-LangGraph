import React, { useState } from 'react';
import { X, User, Mail, Shield, Palette } from 'lucide-react';
import './Modal.css';

const ProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({ ...user });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content profile-modal fade-in">
        <div className="modal-header">
          <div className="modal-title">
            <User size={20} />
            <span>Profile Settings</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-section">
            <label>Name</label>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="First Name" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <label>Appearance</label>
            <div className="appearance-toggle">
              <div className={`theme-btn ${formData.theme === 'light' ? 'active' : ''}`} onClick={() => setFormData({...formData, theme: 'light'})}>
                <Palette size={16} />
                <span>Light</span>
              </div>
              <div className={`theme-btn ${formData.theme === 'dark' ? 'active' : ''}`} onClick={() => setFormData({...formData, theme: 'dark'})}>
                <Shield size={16} />
                <span>Dark (Coming soon)</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
