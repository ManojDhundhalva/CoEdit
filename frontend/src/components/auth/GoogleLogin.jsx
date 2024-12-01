import React, { useState } from 'react';
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom';

//hooks
import useAPI from '../../hooks/api';

//Material Components
import { Box, Typography, CircularProgress } from "@mui/material";

//Material Icons
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

//OAuth
import { useGoogleLogin } from "@react-oauth/google"

//images
import googleImg from "../../images/google.png";

//utils
import { setDataToLocalStorage } from '../../utils/auth';

function GoogleLogin(props) {

    const { setEmail, setName, setImage, setIsNewUser } = props;

    const { GET } = useAPI();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const responseGoogle = async (authResult) => {

        setIsLoading((prev) => true);
        if (authResult["code"]) {
            try {
                const { code } = authResult;

                // Await the GET request
                const { data } = await GET("/auth/google-credentials", { code });
                const { accountExists } = data;

                if (accountExists) {

                    // Await setting data to localStorage
                    await setDataToLocalStorage(data);

                    toast(data?.message || "Login successful!",
                        {
                            icon: <CheckCircleRoundedIcon />,
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                        }
                    );
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
                toast(error.response?.data?.message || "Something went wrong!",
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
        } else {
            // Handle error when authResult does not contain a code
            toast("Google auth error",
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
        setIsLoading((prev) => false);
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
                    <img src={googleImg} alt="Google Icon" style={{ width: 30, backgroundColor: "transparent" }} />
                </Box>
                <Typography fontWeight="bold" sx={{ mx: 1 }}>
                    Continue with Google
                </Typography>
                {isLoading ? <CircularProgress
                    size={20}
                    thickness={6}
                    sx={{
                        ml: 1,
                        color: "black",
                        '& circle': { strokeLinecap: 'round' },
                    }}
                /> : null}
            </button>
        </>
    )
}

export default GoogleLogin