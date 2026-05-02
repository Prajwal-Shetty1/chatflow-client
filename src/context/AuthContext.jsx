import { createContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
// backend url
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  //Check if user is authenticated and if so,set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/users/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }else{
        setAuthUser(null);
      }

    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }

//Connect Socket Function to handle socket connection and online users updates
const connectSocket =(userData) => {
  if(!userData || socket?.connected) return;
  const newSocket = io(backendUrl, {
    query : {
       userId: userData.id || userData._id || userData.user_id || userData.userId,
    }
  });
  console.log("Sending to socket:", userData);
   newSocket.on("connect", () => {
    setSocket(newSocket);
    console.log("Connected:", newSocket.id);
  });

  newSocket.on("getOnlineUsers", (userIds) => {
    setOnlineUsers(userIds);
  });

  newSocket.on("disconnect", () => {
    console.log("Disconnected");
  });
};

//Login function to handle user authentication and socket connection
//state can login or register
const login =async (state,credentials) => {
  try {
    const {data} = await axios.post(`/api/users/${state}`,credentials);
    if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        localStorage.setItem("token",data.token);
        toast.success(data.message);
        return true;
      }else{
        toast.error(data.message);
         return false;
      }

  } catch (error) {
    toast.error(error.message);
  }
}

//Logout function to handle user logout and socket disconnection
const logout = async () => {
  localStorage.removeItem("token");
  setToken(null);
  setAuthUser(null);
  setOnlineUsers([]);
  delete axios.defaults.headers.common["token"]; 
  socket?.disconnect();
  toast.success("Logged out Successfully");
};

//Update profile function to handle user profile updates
const updateProfile = async (formData) => {
  try {
    const { data } = await axios.put(
      "/api/users/update-profile",
      formData,
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (data.success) {
      setAuthUser(data.user);
      toast.success("Profile Updated Successfully");
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};

  useEffect(() => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    checkAuth(); // ✅ only call if token exists
  } else {
    setLoading(false); // ✅ stop loading
  }
}, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};