import React from 'react'
import assets from '../assets/assets';
//import { messagesDummyData } from "../assets/assets";
import { useRef } from "react";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';

//const ChatContainer = ({ selectedUser, setSelectedUser }) => {
const ChatContainer = () => {

    const { authUser, onlineUsers } = useContext(AuthContext);
    const { messages,
        selectedUser,
        setSelectedUser,
        getMessages,
        sendMessage } = useContext(ChatContext);


    const currentUserId = authUser?.id;
    const fileInputRef = useRef();
    const { socket } = useContext(AuthContext);
    const [input, setInput] = useState('');
    //const [messages, setMessages] = useState([]);

    //Load messages 
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser.id);
        }
    }, [selectedUser]);

     //Socket listener
    useEffect(() => {
        if (!socket) return;

        const handleIncomingMessage = (newMessage) => {
            if (
                selectedUser &&
                (newMessage.senderId === selectedUser.id ||
                    newMessage.receiverId === selectedUser.id)
            ){
                //setMessages((prev) => [...prev, newMessage]);
            }
            };
                /*👉 Subscribe
                = start listening for new messages
                = you get messages instantly
                    
                👉 Unsubscribe
                = stop listening
                = prevents same message showing again and again  */
                // 👉 Subscribe (start listening)
                socket.on("newMessage", handleIncomingMessage);
            // 👉 Unsubscribe (cleanup)
            return () => {
                socket.off("newMessage", handleIncomingMessage);
            };

        }, [socket, selectedUser]);


const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    //console.log(imageUrl); 
};

const handleSendMessage = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
};

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
const filteredMessages = messages;

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

                <div  key={msg.id} className={`message-row ${msg.senderId === currentUserId ? "right" : "left"}`}>
                    <img className="msg-avatar" src={msg.senderId === currentUserId ? assets.avatar_icon : selectedUser.profilePic} />

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

        <div className="chat-input">
            <div className="input-wrapper">
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImage} />
                <img src={assets.gallery_icon} alt="" className="gallery-icon" onClick={() => fileInputRef.current.click()} />
                <input type="text"
                    onChange={(e) => setInput(e.target.value)} value={input}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    placeholder="Type a message..." />
            </div>

            <img
                onClick={handleSendMessage} src={assets.send_button} alt="" />
        </div>
    </div >
);
};

export default ChatContainer;




