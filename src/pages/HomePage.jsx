import React, { useContext } from 'react'
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../context/ChatContext';
import CallModal from '../components/CallModal';

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext);

  return (
    <div className={`home ${selectedUser ? "active" : ""}`}>

      <SideBar />

      <ChatContainer />

      {selectedUser && (

        <>

          <RightSidebar />

          {/* Example to check UI layer
          <CallModal
            incomingCall={{
              from: {
                fullName: "Prajwal Shetty",
                profilePic: ""
              },
              callType: "video"
            }}
            onAccept={() => console.log("accepted")}
            onReject={() => console.log("rejected")}
          /> */} 

        </>

      )}
    </div>
  );
};

export default HomePage;