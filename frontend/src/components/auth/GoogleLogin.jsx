import React from 'react';
import { toast } from "react-hot-toast"
import { Box, Typography } from "@mui/material";
import useAPI from '../../hooks/api';
import { useNavigate } from 'react-router-dom';

//OAuth
import { useGoogleLogin } from "@react-oauth/google"

//images
import googleImg from "../../images/google.png";
import { setDataToLocalStorage } from '../../utils/auth';

function GoogleLogin(props) {

    const { setEmail, setName, setImage, setIsNewUser } = props;

    const { GET } = useAPI();
    const navigate = useNavigate();

    // const responseGoogle = (authResult) => {
    //     if (authResult["code"]) {
    //         const { code } = authResult;
    //         GET("/auth/google-credentials", { code })
    //             .then(({ data }) => {
    //                 const { accountExists } = data;

    //                 if (accountExists) {
    //                     toast.success(data.message);
    //                     await setDataToLocalStorage(data);
    //                     navigate("/");
    //                 } else {
    //                     const { email, name, image } = data;
    //                     setEmail(email);
    //                     setName(name);
    //                     setImage(image);
    //                     setIsNewUser((prev) => true);
    //                 }
    //             })
    //             .catch((error) => {
    //                 toast.error(error.message);
    //             });
    //     } else {
    //         toast.error("google auth error");
    //     }
    // };

    const responseGoogle = async (authResult) => {
        if (authResult["code"]) {
            try {
                const { code } = authResult;

                // Await the GET request
                const { data } = await GET("/auth/google-credentials", { code });
                const { accountExists } = data;

                if (accountExists) {
                    toast.success(data.message);

                    // Await setting data to localStorage
                    await setDataToLocalStorage(data);

                    // Navigate to the home page
                    navigate("/");
                } else {
                    const { email, name, image } = data;

                    // Update state for new users
                    setEmail(email);
                    setName(name);
                    setImage(image);
                    setIsNewUser(true); // `prev` is unnecessary for setting to true
                }
            } catch (error) {
                // Handle errors from GET request
                toast.error(error.message);
            }
        } else {
            // Handle error when authResult does not contain a code
            toast.error("Google auth error");
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