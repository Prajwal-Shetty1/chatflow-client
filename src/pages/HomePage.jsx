import React, { useState } from 'react'
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';


const HomePage = () => {
  const [selectedUser,setSelectedUser] = useState(false);
  return (
   <>
   <div className="home">
    <SideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
    <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
    <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
   </div>
   </>
  )
}

export default HomePage;
