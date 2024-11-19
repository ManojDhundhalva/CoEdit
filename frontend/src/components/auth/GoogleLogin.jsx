import React from 'react';
import { toast } from "react-hot-toast"
import { Box, Typography } from "@mui/material";
import useAPI from '../../hooks/api';
import { useNavigate } from 'react-router-dom';

//OAuth
import { useGoogleLogin } from "@react-oauth/google"

//images
import googleImg from "../../images/google.png";

function GoogleLogin(props) {

    const { setEmail, setName, setImage, setIsNewUser } = props;

    const { GET } = useAPI();
    const navigate = useNavigate();

    const responseGoogle = (authResult) => {
        if (authResult["code"]) {
            const { code } = authResult;
            GET("/auth/google-credentials", { code })
                .then(({ data }) => {
                    const { accountExists } = data;

                    if (accountExists) {
                        toast.success(data.message);
                        navigate("/");
                    } else {
                        const { email, name, image } = data;
                        setEmail(email);
                        setName(name);
                        setImage(image);
                        setIsNewUser((prev) => true);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        } else {
            toast.error("google auth error");
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code"
    });

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        googleLogin();
    }

    return (
        <>
            <button onClick={handleGoogleLogin} style={{ padding: 6, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                    <img src={googleImg} alt="Google Icon" style={{ marginRight: 10, width: 30, backgroundColor: "transparent" }} />
                </Box>
                <Typography fontWeight="bold">
                    Continue with Google
                </Typography>
            </button>
        </>
    )
}

export default GoogleLogin