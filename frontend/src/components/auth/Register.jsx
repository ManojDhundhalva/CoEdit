// module-imports
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

//imported
import useAPI from "../../hooks/api";
import { isValidEmail, isValidUserName, isSpace } from "../../utils/validation";

//Material UI Components
import {
    Box,
    Grid,
    Avatar,
    Button,
    TextField,
    Tooltip,
    Zoom,
    Typography,
    IconButton,
    InputAdornment,
    CircularProgress,
} from "@mui/material";

//Material UI Icons
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

//google-OAuth
import GoogleLogin from "./GoogleLogin.jsx";

//avatars
import { avatars } from "../../utils/avatar.js";

export default function RegisterPage({ hasAccount, setHasAccount }) {

    const { GET, POST } = useAPI();
    const navigate = useNavigate();
    const userNameControllerRef = useRef();
    const emailControllerRef = useRef();

    //google-OAuth
    const newUserNameControllerRef = useRef();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [newUserNameJustVerify, setNewUserNameJustVerify] = useState(false);
    const [isValidNewUserNameLoading, setIsValidNewUserNameLoading] = useState(false);
    const [newUserNameError, setNewUserNameError] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewAccountIsCreating, setIsNewAccountIsCreating] = useState(false);

    const [userJustVerify, setUserJustVerify] = useState(false);
    const [emailJustVerify, setEmailJustVerify] = useState(false);
    const [passwordJustVerify, setPasswordJustVerify] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [userName, setUserName] = useState("");
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");

    const [userNameError, setUserNameError] = useState(false);
    const [isValidUserNameLoading, setIsValidUserNameLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [isValidEmailLoading, setIsValidEmailLoading] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (e) => e.preventDefault();

    const isFormValid = () => {
        return (
            !userNameError &&
            !emailError &&
            isValidUserName(userName) &&
            isValidEmail(emailId) &&
            userName !== "" &&
            emailId !== "" &&
            userName.length < 255 &&
            emailId.length < 255 &&
            password !== "" &&
            password.length >= 8 &&
            password.length < 255
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUserJustVerify((prev) => true);
        setEmailJustVerify((prev) => true);
        setPasswordJustVerify((prev) => true);


        if (!isFormValid()) return;

        setLoading((prev) => true);

        const registerCredentials = {
            username: userName,
            emailid: emailId,
            password,
            profile_image: Math.floor(Math.random() * avatars.length),
        };

        try {
            await POST("/auth/register", registerCredentials);
            toast("Account Created successfully!",
                {
                    icon: <InfoRoundedIcon />,
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
            setLoading((prev) => false);
        }
    };

    const handleChangeUserName = async (e) => {

        if (!isValidUserName("0" + e.target.value)) return;
        if (e.target.value.length >= 255) return;

        setUserJustVerify((prev) => false);
        setUserName((prev) => e.target.value);

        setIsValidUserNameLoading((prev) => true);

        if (userNameControllerRef.current) {
            userNameControllerRef.current.abort();
        }

        userNameControllerRef.current = new AbortController();
        const signal = userNameControllerRef.current.signal;

        try {
            const response = await GET("/auth/verify-username", { username: e.target.value }, signal);
            setUserNameError(response.data.exists);
        } catch (error) {
        } finally {
            setIsValidUserNameLoading((prev) => false);
        }
    }

    const handleEmailChange = async (e) => {

        if ((e.target.value !== "") && !isSpace(e.target.value)) return;
        if (e.target.value.length >= 255) return;

        setEmailJustVerify((prev) => false);
        setEmailId((prev) => e.target.value);

        if (!isValidEmail(e.target.value)) return;

        setIsValidEmailLoading((prev) => true);

        if (emailControllerRef.current) {
            emailControllerRef.current.abort();
        }

        emailControllerRef.current = new AbortController();
        const signal = emailControllerRef.current.signal;

        try {
            const response = await GET("/auth/verify-email", { emailid: e.target.value }, signal);
            setEmailError(response.data.exists);
        } catch (error) {
        } finally {
            setIsValidEmailLoading((prev) => false);
        }
    };

    const handleChangeNewUserName = async (e) => {

        if (!isValidUserName("0" + e.target.value)) return;
        if (e.target.value.length >= 255) return;

        setNewUserNameJustVerify((prev) => false);
        setNewUserName((prev) => e.target.value);

        setIsValidNewUserNameLoading((prev) => true);

        if (newUserNameControllerRef.current) {
            newUserNameControllerRef.current.abort();
        }

        newUserNameControllerRef.current = new AbortController();
        const signal = newUserNameControllerRef.current.signal;

        try {
            const response = await GET("/auth/verify-username", { username: e.target.value }, signal);
            setNewUserNameError(response.data.exists);
        } catch (error) {
        } finally {
            setIsValidNewUserNameLoading((prev) => false);
        }
    }

    const handleSubmitNewUser = async (e) => {
        e.preventDefault();

        setNewUserNameJustVerify((prev) => true);

        if (newUserNameError || !isValidUserName(newUserName) || newUserName === "") return;

        setIsNewAccountIsCreating((prev) => true);

        const registerCredentials = {
            username: newUserName,
            emailid: email,
            name,
            image,
        };

        try {
            await POST("/auth/google-login", registerCredentials);
            toast("Account Created successfully!",
                {
                    icon: <InfoRoundedIcon />,
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
            setIsNewAccountIsCreating((prev) => false);
        }
    };

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
                display: hasAccount ? "none" : "flex",
                height: "100vh",
                paddingX: { xs: 2, sm: 4 },
                paddingY: { xs: 4, sm: 6 },
            }}
        >
            {!isNewUser ? (
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={6}
                    lg={4}
                    sx={{
                        display: isNewUser ? "flex" : "none",
                        padding: { xs: 2, sm: 4 },
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "1px solid black",
                    }}
                >
                    <Avatar sx={{ backgroundColor: "#333333", mb: 2 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                        Sign Up
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    value={userName}
                                    onChange={handleChangeUserName}
                                    id="username"
                                    label="Username"
                                    placeholder="Username"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size="small"
                                    autoComplete="on"
                                    error={
                                        userJustVerify && (userName === "" || !isValidUserName(userName))
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: "#333333" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {isValidUserNameLoading ?
                                                    <CircularProgress
                                                        size={20}
                                                        thickness={6}
                                                        sx={{
                                                            color: "black",
                                                            '& circle': { strokeLinecap: 'round' },
                                                        }}
                                                    />
                                                    : (userNameError || (userName !== "" && !isValidUserName(userName)) || (userJustVerify && userName === "")) ?
                                                        <Tooltip
                                                            TransitionComponent={Zoom}
                                                            title={(userName === "") ? "Username is required" : "Username already exists"}
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
                                                            <WarningAmberRoundedIcon sx={{ color: "#333333", cursor: "pointer" }} />
                                                        </Tooltip>
                                                        : (userName !== "") ?
                                                            <CheckRoundedIcon sx={{ color: "#333333" }} /> : null}
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
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={emailId}
                                    onChange={handleEmailChange}
                                    id="email-id"
                                    label="Email ID"
                                    placeholder="Email ID"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size="small"
                                    autoComplete="on"
                                    error={emailJustVerify && (emailId === "" || !isValidEmail(emailId))}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailRoundedIcon sx={{ color: "#333333" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {isValidEmailLoading ?
                                                    <CircularProgress
                                                        size={20}
                                                        thickness={6}
                                                        sx={{
                                                            color: "black",
                                                            '& circle': { strokeLinecap: 'round' },
                                                        }}
                                                    />
                                                    : (emailError || (emailId !== "" && !isValidEmail(emailId)) || (emailJustVerify && emailId === "")) ?
                                                        <Tooltip
                                                            TransitionComponent={Zoom}
                                                            title={(emailId === "" ? "Email ID is required" : !isValidEmail(emailId)) ? "Invalid Email ID" : "Email ID already exists"}
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
                                                            <WarningAmberRoundedIcon sx={{ color: "#333333" }} />
                                                        </Tooltip>
                                                        : (emailId !== "") ?
                                                            <CheckRoundedIcon sx={{ color: "#333333" }} /> : null}
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
                            </Grid>
                            <Grid item xs={12}>
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
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        fontWeight: "bold",
                                        borderRadius: "12px",
                                        backgroundColor: "#333333",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "#404040",
                                        },
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            Signing Up&nbsp;&nbsp;
                                            <CircularProgress
                                                size={20}
                                                thickness={6}
                                                sx={{
                                                    color: "white",
                                                    '& circle': { strokeLinecap: 'round' },
                                                }}
                                            />
                                        </>
                                    ) : ("Sign Up")}
                                </Button>
                            </Grid>

                            <Grid container justifyContent="center" sx={{ pl: 2, pt: 2 }}>
                                <Typography fontWeight="bold">
                                    OR
                                </Typography>
                            </Grid>

                            <Grid item xs={12} container justifyContent="center">
                                <GoogleLogin setEmail={setEmail} setName={setName} setImage={setImage} setIsNewUser={setIsNewUser} />
                            </Grid>

                            <Grid container justifyContent="space-between" sx={{ px: 2 }}>
                                <Box
                                    variant="text"
                                    onClick={() => setHasAccount(true)}
                                    sx={{
                                        my: 2,
                                        fontSize: "small",
                                        fontWeight: "bold",
                                        color: "#666666",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        "&:hover": {
                                            color: "black",
                                        },
                                    }}
                                >
                                    Already have an account? Sign In
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            ) : (
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={6}
                    lg={4}
                    sx={{
                        padding: { xs: 2, sm: 4 },
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "1px solid black",
                    }}
                >

                    <form onSubmit={handleSubmitNewUser} style={{ width: "100%" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ position: "relative", display: "flex", width: "100%", height: "100%", flexDirection: "column", alignItems: "center" }}>
                                    <Typography variant="h5" fontWeight="bold" sx={{ my: 2 }}>Hi, {name}</Typography>
                                    <IconButton onClick={() => { setIsNewUser((prev) => false); setImage(""); setEmail(""); setName(""); }}
                                        sx={{ bgcolor: "#F2F2F2", color: "#333333", position: "absolute", top: 0, left: 0, borderRadius: "50%" }}
                                    >
                                        <KeyboardBackspaceRoundedIcon sx={{ color: "#333333" }} />
                                    </IconButton>
                                    <img src={image}
                                        alt="profile-image"
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                        }}
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                        decoding="async"
                                    />
                                    <Typography fontWeight="bold" sx={{ my: 2 }}>{email}</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%", p: "12px", my: 2, borderRadius: 3, border: "1px solid #333333" }}>
                                        <InfoRoundedIcon /> <Typography fontWeight="bold" sx={{ mx: 2 }}>Choose a username to get started</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={newUserName}
                                    onChange={handleChangeNewUserName}
                                    id="username"
                                    label="Username"
                                    placeholder="Username"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size="small"
                                    autoComplete="on"
                                    error={
                                        newUserNameJustVerify && (newUserName === "" || !isValidUserName(newUserName))
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: "#333333" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {isValidNewUserNameLoading ?
                                                    <CircularProgress
                                                        size={20}
                                                        thickness={6}
                                                        sx={{
                                                            color: "black",
                                                            '& circle': { strokeLinecap: 'round' },
                                                        }}
                                                    />
                                                    : (newUserNameError || (newUserName !== "" && !isValidUserName(newUserName)) || (newUserNameJustVerify && newUserName === "")) ?
                                                        <Tooltip
                                                            TransitionComponent={Zoom}
                                                            title={(newUserName === "") ? "Username is required" : "Username already exists"}
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
                                                            <WarningAmberRoundedIcon sx={{ color: "#333333", cursor: "pointer" }} />
                                                        </Tooltip>
                                                        : (newUserName !== "") ?
                                                            <CheckRoundedIcon sx={{ color: "#333333" }} /> : null}
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
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        fontWeight: "bold",
                                        borderRadius: "12px",
                                        backgroundColor: "#333333",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "#404040",
                                        },
                                    }}
                                >
                                    {isNewAccountIsCreating ? (
                                        <>
                                            Creating an Account&nbsp;&nbsp;
                                            <CircularProgress
                                                size={20}
                                                thickness={6}
                                                sx={{
                                                    color: "white",
                                                    '& circle': { strokeLinecap: 'round' },
                                                }}
                                            />
                                        </>
                                    ) : ("Create Account")}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            )}
        </Grid>
    );
}
