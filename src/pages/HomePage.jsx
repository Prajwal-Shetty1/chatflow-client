import React from 'react'
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';


const HomePage = () => {
  return (
   <>
   <div className="home">
    <SideBar />
    <ChatContainer />
    <RightSidebar />
   </div>
   </>
  )
}

export default HomePage;
