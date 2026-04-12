import React, { useState } from 'react'
import assets from '../assets/assets';
import { useNavigate } from "react-router-dom";
import { userDummyData } from "../assets/assets";
const SideBar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

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
                    <p>Logout</p>
                </div>
            )}
            <div className='serach'>
                <img src={assets.search_icon} alt="" />
                <input type="text" placeholder='SearchUser...' />
            </div>
            <div className="user-list">
                {userDummyData.map((user) => (
                    <div key={user._id} className="user-item">

                        <img src={user.profilePic} alt="" />

                        <div className="user-info">
                            <p>{user.fullName}</p>
                            <span className="offline">Offline</span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar;