import React from 'react'
import assets from '../assets/assets';
import { messagesDummyData } from "../assets/assets";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
    const currentUserId = "680f5116f10f3cd28382ed02";

    /* 🔹 Empty state */
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

    /* 🔹 Filter messages */
    const filteredMessages = messagesDummyData.filter(
        (msg) =>
            (msg.senderId === currentUserId && msg.receiverId === selectedUser._id) ||
            (msg.senderId === selectedUser._id && msg.receiverId === currentUserId)
    );

    return (
        <div className="chat-container">

            {/* HEADER */}
            <div className="chat-header">
                <div className="chat-user">
                    <img src={selectedUser.profilePic} alt="" />
                    <p>
                        {selectedUser.fullName}
                        <span className="online-dot"></span>
                    </p>
                </div>

                <div className="chat-actions">
                    <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" />
                    <img src={assets.help_icon} alt="" />
                </div>
            </div>

            {/* MESSAGES */}
            <div className="chat-messages">
                {filteredMessages.map((msg) => (

                    <div className={`message-row ${msg.senderId === currentUserId ? "right" : "left"}`}>
                        {msg.senderId !== currentUserId && (
                            <img className="msg-avatar" src={selectedUser.profilePic} alt="" />
                        )}

                        <div>
                            <div className="message-bubble">
                                {msg.text && <p>{msg.text}</p>}
                                {msg.image && <img src={msg.image} alt="" />}
                            </div>
                            <span className="msg-time">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>

                ))}
            </div>

            {/* INPUT */}
            <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <img src={assets.send_button} alt="" />
            </div>

        </div >
    );
};

export default ChatContainer;




