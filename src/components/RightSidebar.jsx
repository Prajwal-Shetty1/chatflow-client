import React, { useContext } from 'react';
import assets from '../assets/assets';
import { imagesDummyData } from "../assets/assets";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
const RightSidebar = () => {

  const {logout} = useContext(AuthContext);

  const {selectedUser} = useContext(ChatContext);


  if (!selectedUser) return null;
  
  return  (
    <div className='right-sidebar'>

      {/* PROFILE */}
      <div className="profile-section">
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className="profile-img" />
        <p className="profile-name">{selectedUser.fullName}</p>
        <p className="profile-bio">{selectedUser.bio}</p>
      </div>

      <hr className="divider" />

      {/* MEDIA */}
      <div className="media-section">
        <p className="media-title">Media</p>

        <div className="media-grid">
          {imagesDummyData.map((url, index) => (
            <img key={index} src={url} alt="" onClick={() => window.open(url)} />
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <div className="logout-section">
        <button className="logout-btn" onClick={()=> logout()}
        >Logout</button>
      </div>

    </div>
  );
};

export default RightSidebar;