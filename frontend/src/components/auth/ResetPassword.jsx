import React, { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Grid } from '@mui/material'
import { avatars } from "../../utils/avatar";
import useAPI from '../../hooks/api'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { getAvatar } from '../../utils/avatar'
import { setDataToLocalStorage } from '../../utils/auth'

function ResetPassword(props) {

    const { setForgetPasswordStep, username, image } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { POST } = useAPI();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordJustVerify, setPasswordJustVerify] = useState(false);

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleResetPassword = async () => {

        setPasswordJustVerify((prev) => true);
        if (password === "" || password.length < 8) return;

        setIsLoading(true);
        try {
            const results = await POST("/auth/forget-password", { username, password });
            await setDataToLocalStorage(results.data);
            toast(results.data?.message || "Password updated successfully",
                {
                    icon: <CheckCircleRoundedIcon />,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            navigate("/");
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
            setIsLoading(false);
        }
    }

    return (
        <>
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                <IconButton onClick={() => setForgetPasswordStep(false)}
                    sx={{ bgcolor: "#F2F2F2", color: "#333333", position: "absolute", top: 0, left: 0, borderRadius: "50%" }}
                >
                    <KeyboardBackspaceRoundedIcon sx={{ color: "#333333" }} />
                </IconButton>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", my: 4 }}>
                    <Typography fontWeight="bold" variant='h5'>Reset Password</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img
                        src={image}
                        alt="profile-image"
                        style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "1px solid #333333",
                        }}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        decoding="async"
                    />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", my: 2 }}>
                    <Typography fontWeight="bold">Hi, {username}</Typography>
                </Box>
                <Box sx={{ display: "flex", px: 2, my: 4 }}>
                    <TextField
                        value={password}
                        onChange={(e) => {
                            if (e.target.value.length >= Number(255)) return;
                            setPasswordJustVerify((prev) => false);
                            setPassword((prev) => e.target.value);
                        }}
                        id="password"
                        label="Password"
                        placeholder="password"
                        variant="outlined"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        required
                        size="small"
                        error={
                            passwordJustVerify && (password === "" || password.length < 8)
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyRoundedIcon sx={{ color: "#333333" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <Visibility sx={{ color: "#333333" }} />
                                        ) : (
                                            <VisibilityOff sx={{ color: "#333333" }} />
                                        )}
                                    </IconButton>
                                    {((passwordJustVerify && password === "") || (password !== "" && password.length < 8)) ? (
                                        <Tooltip
                                            TransitionComponent={Zoom}
                                            title={password === ""
                                                ? "Password is required"
                                                : password.length < 8
                                                    ? "The password must contain at least 8 characters."
                                                    : ""}
                                            placement="bottom"
                                            arrow
                                            componentsProps={{
                                                tooltip: {
                                                    sx: {
                                                        bgcolor: "common.black",
                                                        "& .MuiTooltip-arrow": {
                                                            color: "common.black",
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <WarningAmberRoundedIcon sx={{ color: "#333333", cursor: "pointer", ml: 2 }} />
                                        </Tooltip>
                                    ) : (password !== "" || password.length >= 8) ?
                                        <CheckRoundedIcon sx={{ color: "#333333", ml: 2 }} /> : null}
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            required: false, // disables the default pop-up message
                        }}
                        sx={{
                            color: "black",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                fontWeight: "bold",
                                "&.Mui-focused fieldset": {
                                    borderColor: "black", // Keep the border color when focused
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "black", // Change the label color
                                "&.Mui-focused": {
                                    color: "black", // Change the label color
                                },
                            },
                        }}
                    />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                    <button style={{ backgroundColor: "#333333", color: "white", fontWeight: "bold" }}
                        onClick={handleResetPassword}
                    >

                        {isLoading ?
                            <> Updating Password
                                <CircularProgress
                                    size={20}
                                    thickness={7}
                                    sx={{
                                        ml: 2,
                                        color: "white",
                                        '& circle': { strokeLinecap: 'round' },
                                    }}
                                />
                            </> : ("Update Password")
                        }
                    </button>
                </Box>
            </Box>
        </>
    )
}

export default ResetPassword        