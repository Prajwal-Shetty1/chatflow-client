import { useContext, useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();


export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    //Function to get all users for sidebar
    //Fetch users list from backend and show in sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to get messages for selected users
    //Fetch chat messages between you and the user you clicked
    const getMessages = async (id) => {
        try {
            const { data } = await axios.get(`/api/messages/${id}`);

            if (data.success) {
                setMessages(data.messages); // store messages
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    //Function to send a messages to the selected users
    const sendMessage = async (text, image = null) => {
        try {
            if (!selectedUser) return;
            const formData = new FormData();
            formData.append("text", text);

            if (image) {
                formData.append("image", image);
            }

            const { data } = await axios.post(
                `/api/messages/send/${selectedUser._id}`,
                formData
            );

            if (data.success) {
                setMessages((prev) => [...prev, data.message]);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };


    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        setUnseenMessages,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage

    }


    return (


        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}