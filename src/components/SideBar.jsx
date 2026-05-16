import React, { useState } from 'react'
import assets from '../assets/assets';
import { useNavigate } from "react-router-dom";
//import { userDummyData } from "../assets/assets";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { useEffect } from 'react';
//const SideBar = ({ selectedUser, setSelectedUser }) => {
const SideBar = () => {
    const { getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);
    const { logout, onlineUsers } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [input, setInput] = useState("");
    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase()
        .includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers])

    return (
        <div className='sidebar'>

            <div className='top'>
                <img src={assets.logo} alt="logo" />
                <img src={assets.menu_icon} alt="menu" onClick={() => setShowMenu(!showMenu)} />
            </div>

            {/* DROPDOWN MENU */}
            {showMenu && (
                <div className='menu'>
                    <p onClick={() => navigate('/profile')}>Edit Profile</p>
                    <hr />
                    <p
                        onClick={() => logout()}
                    >Logout</p>
                </div>
            )}
            <div className='serach'>
                <img src={assets.search_icon} alt="" />
                <input type="text"
                    onChange={(e) => setInput(e.target.value)} placeholder='SearchUser...' />
            </div>
            <div className="user-list">
                {filteredUsers.map((user) => (

                    <div key={user.id} className={`user-item ${selectedUser?._id === user.id ? "active" : ""}`}
                        onClick={() => setSelectedUser(user)}>

                        <img src={user.profilePic} alt="" />

                        <div className="user-info">
                            <p>{user.fullName}</p>
                            {onlineUsers.includes(String(user._id || user.id)) ? (
                                <span className="online">Online</span>
                            ) : (
                                <span className="offline">Offline</span>
                            )}

                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar;