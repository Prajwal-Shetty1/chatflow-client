import React from 'react'
import assets from '../assets/assets';
//import { messagesDummyData } from "../assets/assets";
import { useRef } from "react";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';
import CallModal from '../components/CallModal';
import VideoCall from '../components/VideoCall';

//const ChatContainer = ({ selectedUser, setSelectedUser }) => {
const ChatContainer = () => {

    const { authUser, onlineUsers } = useContext(AuthContext);
    const { messages,
        selectedUser,
        setSelectedUser,
        getMessages,
        sendMessage } = useContext(ChatContext);
    //Call State
    const [incomingCall, setIncomingCall] = useState(null); //{from,signal,callType}
    const [activeCall, setActiveCall] = useState(null);//{outgoing or incoming}

    const currentUserId = authUser?.id;
    const fileInputRef = useRef();
    const { socket } = useContext(AuthContext);

    //console.log("authUser:", authUser)
    const [input, setInput] = useState('');
    //const [messages, setMessages] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);

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
            ) {
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

    //Incoming Call Listener--------------
    useEffect(() => {
        if (!socket) return;
        socket.on("incoming-call", (data) => {
            setIncomingCall(data);   // { from: { id, fullName, profilePic }, signal, callType }

        });
        return () => socket.off("incoming-call");
    }, [socket])

    // ── Call handlers ─────────────────────────────────────
    const startCall = (callType) => {
        if (!selectedUser) return;
        setActiveCall({
            outgoing: {
                to: selectedUser.id,
                fullName: selectedUser.fullName,
                profilePic: selectedUser.profilePic,
                callType,
            }
        });
    };
    const acceptCall = () => {
        setActiveCall({ incoming: incomingCall });
        setIncomingCall(null);
    };

    const rejectcall = () => {
        socket.emit("call-rejected", { to: incomingCall.from.id });
        setIncomingCall(null);
    };

    const endcall = () => {
        setActiveCall(null);
    }

    // ── Image handler ───────────
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(file);
        //console.log(imageUrl); 
    };

    const handleSendMessage = async () => {
        if (!input.trim() && !selectedImage) return;
        await sendMessage(input, selectedImage);
        setInput("");
        setSelectedImage(null);
    };

    /*Empty state */
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

    /*Filter messages */
    const filteredMessages = messages;

    return (
        <div className="chat-container">

            {/* HEADER */}
            <div className="chat-header">
                <div className="chat-user">
                    <img src={selectedUser.profilePic} alt="" />
                    <p>
                        {selectedUser.fullName}
                        {onlineUsers.includes(selectedUser.id) && (
                            <span className="online-dot"></span>
                        )}
                    </p>
                </div>

                <div className="chat-actions">
                    <img src={assets.call} alt="" style={{ cursor: "pointer" }} onClick={() => startCall("audio")} />
                    <img src={assets.video} alt="" style={{ cursor: "pointer" }} onClick={() => startCall("video")} />
                    <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" />
                </div>
            </div>

            {/* MESSAGES */}
            <div className="chat-messages">
                {filteredMessages.map((msg) => (

                    <div key={msg.id} className={`message-row ${msg.senderId === currentUserId ? "right" : "left"}`}>
                        <img className="msg-avatar"
                            src={msg.senderId === currentUserId ? authUser.profilePic : selectedUser.profilePic}
                            onError={(e) => e.target.src = assets.avatar_icon}
                            alt="avatar"
                        />

                        <div>
                            <div className="message-bubble">
                                {msg.text && <p>{msg.text}</p>}
                                {msg.image && (
                                    msg.image.includes("/video/") ? (
                                        <video controls width="220">
                                            <source src={msg.image} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img src={msg.image} alt="" />
                                    )
                                )}
                            </div>
                            <span className="msg-time">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {selectedImage && (
                <div className="image-preview">
                    {selectedImage.type.startsWith("video") ? (
                        <video width="220" controls>
                            <source src={URL.createObjectURL(selectedImage)} />
                        </video>
                    ) : (
                        <img src={URL.createObjectURL(selectedImage)} alt="preview" />
                    )}
                    <button onClick={() => setSelectedImage(null)}>✕</button>
                </div>
            )}

            <div className="chat-input">
                <div className="input-wrapper">
                    <input type="file" accept="image/*,video/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImage} />
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
            {/*_____INCOMING CALL POPUP________*/}
            <CallModal
                incomingCall={incomingCall}
                onAccept={acceptCall}
                onReject={rejectcall}
            />
            {/* ── ACTIVE CALL SCREEN ───*/}
            {activeCall && (
                <VideoCall
                    socket={socket}
                    currentUser={authUser}
                    outgoingCall={activeCall.outgoing || null}
                    callInfo={activeCall.incoming || null}
                    onEndCall={endcall}
                />
            )}
        </div >
    );
};

export default ChatContainer;




