import React from 'react'
import assets from '../assets/assets';

const ChatContainer = ({ selectedUser, setSelectedUser }) => {

    if (!selectedUser) {
        return (
            <div className="empty-chat">
                <img src={assets.logo_icon} alt="" />
                <h2>Welcome to ChatFlow 👋</h2>
                <p>Chat anytime, anywhere</p>
                <span>Select a user to start conversation</span>
            </div>
        );
    }

    /* 👇 WHEN USER IS SELECTED */
    return (
        <div className="chat-container">

            {/* HEADER */}
            <div className="chat-header">
                <div className="chat-user">
                    <img src={selectedUser.profilePic} alt="" />
                    <p>{selectedUser.fullName}</p>
                </div>

                <div className="chat-actions">
                    <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" />
                    <img src={assets.help_icon} alt="" />
                </div>
            </div>
        </div>
    );
};
export default ChatContainer;