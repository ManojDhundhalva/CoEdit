// Imports
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

// Hooks
import useAPI from "../hooks/api";

//Material-UI Icons
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const userContext = createContext();

export const UserProvider = ({ children }) => {

    const { GET } = useAPI();

    const [userInfo, setUserInfo] = useState({
        fullName: "",
        userName: "",
        email: "",
        createdAt: "",
        updatedOn: "",
        profileImage: "",
        image: "",
    });

    const getUser = async () => {
        try {
            const { data } = await GET("/user");

            setUserInfo({
                fullName: data.name,
                userName: data.username,
                email: data.emailid,
                createdAt: data.created_at,
                updatedOn: data.updated_on,
                profileImage: data.profile_image,
                image: data.image,
            });
        } catch (error) {
            toast(error.response?.data?.message || "Error fetching user data",
                {
                    icon: <CancelRoundedIcon />,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
    };

    return (
        <userContext.Provider value={{ userInfo, getUser }}>
            {children}
        </userContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(userContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
