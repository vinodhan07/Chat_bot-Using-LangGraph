import React from 'react';
import { MessageSquarePlus, Search, Users, Zap } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onProfileClick }) => {
  const initials = user?.firstName?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <img src="/logo.png" alt="Vindh AI Logo" className="brand-icon" />
          <span>Vindh</span>AI
        </div>
      </div>

      <button className="new-chat-btn" onClick={() => window.location.reload()}>
        <div className="new-chat-content">
          <MessageSquarePlus size={18} />
          <span>New chat</span>
        </div>
        <span className="shortcut">⌘N</span>
      </button>

      <div className="nav-links">
        <button className="nav-item active">
          <Search size={18} />
          <span>Search chat</span>
        </button>
      </div>


      <div className="sidebar-spacer"></div>

      <div className="sidebar-footer">
        <button className="profile-btn" onClick={onProfileClick}>
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <div className="profile-name">{user.firstName} {user.lastName}</div>
            <div className="profile-status">Personal</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
