import React, { useState } from 'react'
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className={`home ${selectedUser ? "active" : ""}`}>
      <SideBar selectedUser={selectedUser}  setSelectedUser={setSelectedUser} />
      
      <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      {selectedUser && (
        <RightSidebar selectedUser={selectedUser} />
      )}
    </div>
  );
};

export default HomePage;
