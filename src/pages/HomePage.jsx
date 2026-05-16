import React,{ useContext } from 'react'
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../context/ChatContext'; 

const HomePage = () => {
  //const [selectedUser, setSelectedUser] = useState(null);
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className={`home ${selectedUser ? "active" : ""}`}>
      <SideBar />
      
      <ChatContainer />
      {selectedUser && (
        //<RightSidebar selectedUser={selectedUser} />
        <RightSidebar />
      )}
    </div>
  );
};

export default HomePage;
