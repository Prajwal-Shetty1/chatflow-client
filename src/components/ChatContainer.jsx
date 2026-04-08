import React from 'react'
import assets from '../assets/assets';

const ChatContainer = (selectedUser,setSelectedUser) => {
    return (
        <>
            <div className='chat-container'>
                <div>
                    <img src={assets.profile_martin} alt="" />
                    <p>Alison Martin</p>
                </div>
                <div>
                    <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" />
                    <img src={assets.help_icon} alt="" />
                </div>
            </div>

        </>
    )
}

export default ChatContainer;
