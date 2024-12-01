import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

//Componets
import OtpInput from './OtpInput';

//utils
import { formatTimeMinutes } from "../../utils/formatters";

//Material Components
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';

//Material Icons
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

function VerifyCode(props) {

    const { code, setCode, setIsForgotPassword, setForgetPasswordStep, sendEmailToUser } = props;
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 seconds
    const [showResend, setShowResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const [otp, setOtp] = useState("");


    // Countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer); // Cleanup timer on component unmount
        } else {
            setCode(""); // Reset code if time runs out
            setShowResend(true);
        }
    }, [timeLeft]);

    const handleCheckOtp = () => {
        if (otp === code) setForgetPasswordStep((prev) => true);
        else {
            toast("Invalid OTP. Please try again.",
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
    }

    const handleResend = async () => {
        setTimeLeft(120); // Reset timer if resend is clicked
        setShowResend(false);

        setIsResending(true);
        try {
            await sendEmailToUser();
            toast("Email sent to the registered email address",
                {
                    icon: <CheckCircleRoundedIcon />,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        } catch (error) {
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
        } finally {
            setIsResending(false);
        }
    }


    return (
        <>
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                <IconButton onClick={() => setIsForgotPassword(false)}
                    sx={{ bgcolor: "#F2F2F2", color: "#333333", position: "absolute", top: 0, left: 0, borderRadius: "50%" }}
                >
                    <KeyboardBackspaceRoundedIcon sx={{ color: "#333333" }} />
                </IconButton>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", my: 4 }}>
                    <Typography fontWeight="bold" variant='h5'>OTP Sent Successfully</Typography>
                    <Typography fontWeight="bold" variant='caption' sx={{ color: "grey" }}>The OTP has been sent to your registered email address.</Typography>
                    <Box sx={{ my: 5 }}>
                        <OtpInput length={4} onOtpSubmit={setOtp} />
                    </Box>
                    <Box>
                        {showResend ? (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {isResending ? (
                                    <>
                                        <Typography fontWeight="bold" variant="caption" sx={{ color: 'grey', mx: 1 }}>
                                            Resending mail...
                                        </Typography>
                                        <CircularProgress
                                            size={14}
                                            thickness={7}
                                            sx={{
                                                color: "black",
                                                '& circle': { strokeLinecap: 'round' },
                                            }}
                                        />
                                    </>
                                ) :
                                    <>
                                        <Typography fontWeight="bold" variant="caption" sx={{ color: 'grey' }}>
                                            Didn't receive the code?
                                        </Typography>
                                        <Typography
                                            fontWeight="bold"
                                            variant="caption"
                                            sx={{ mx: '4px', color: 'black', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                            onClick={handleResend}
                                        >
                                            Resend
                                        </Typography>
                                    </>
                                }
                            </Box>
                        ) : (
                            <Typography fontWeight="bold" variant="caption" sx={{ color: 'grey' }}>
                                OTP expires in {formatTimeMinutes(timeLeft)}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                    <button style={{ backgroundColor: "#333333", color: "white", fontWeight: "bold" }}
                        onClick={handleCheckOtp}
                    >
                        Submit
                    </button>
                </Box>
            </Box>
        </>

    )
}

export default VerifyCode   