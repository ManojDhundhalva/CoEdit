// Imports
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Hooks
import useAPI from "../hooks/api";

const userContext = createContext();

export const UserProvider = ({ children }) => {

    const { GET } = useAPI();
    const navigate = useNavigate();

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
            navigate("/");
        }
    };

    const clearUserInfo = () => {
        setUserInfo({
            fullName: "",
            userName: "",
            email: "",
            createdAt: "",
            updatedOn: "",
            profileImage: "",
            image: "",
        })
    }

    return (
        <userContext.Provider value={{ userInfo, getUser, clearUserInfo }}>
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
