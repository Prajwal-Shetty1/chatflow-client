import React, { useContext } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const RightSidebar = () => {

  const { logout } = useContext(AuthContext);
  const { selectedUser } = useContext(ChatContext);

  if (!selectedUser) return null;

  return (
    <div className='right-sidebar'>

      {/* PROFILE */}
      <div className="profile-section">
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className="profile-img" />
        <p className="profile-name">{selectedUser.fullName}</p>
        <p className="profile-bio">{selectedUser.bio}</p>
      </div>

      <hr className="divider" />

      <div className="sidebar-content">
        <div className="about-section">

          <div className="feature-card">
            <img src={assets.messages} alt="" />
            <div className="feature-text">
              <h4>Messaging</h4>
              <p>Instant chats</p>
              <span>12.4k users online</span>
            </div>
          </div>

          <div className="feature-card">
            <img src={assets.videoandaudio} alt="" />
            <div className="feature-text">
              <h4>Video Calls</h4>
              <p>HD audio & video</p>
              <span>Crystal clear quality</span>
            </div>
          </div>

          <div className="feature-card">
            <img src={assets.partners} alt="" />
            <div className="feature-text">
              <h4>Community</h4>
              <p>Stay connected</p>
              <span>50k+ members worldwide</span>
            </div>
          </div>

        </div>
      </div>

      {/* LOGOUT — outside sidebar-content */}
      <div className="logout-section">
        <button className="logout-btn" onClick={() => logout()}>Logout</button>
      </div>

    </div>
  );
};

export default RightSidebar;