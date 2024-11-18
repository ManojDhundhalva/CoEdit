// module-imports
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

//imported
import useAPI from "../../hooks/api";

// Material-UI components
import {
    Box,
    Grid,
    Avatar,
    Button,
    Tooltip,
    Zoom,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    CircularProgress,
} from "@mui/material";

// Material-UI icons
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { isValidUserName } from "../../utils/validation";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

//google-OAuth
import GoogleLogin from "./GoogleLogin.jsx";

//files
import ResetPassword from "./ResetPassword.jsx";
import VerifyCode from "./VerifyCode.jsx";

export default function Login({ hasAccount, setHasAccount }) {

    const { GET, POST } = useAPI();
    const navigate = useNavigate();

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

    //forgot passowrd
    const [userNameOrEmailJustVerify, setUserNameOrEmailJustVerify] = useState(false);
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgetPasswordStep, setForgetPasswordStep] = useState(false);
    const [isSendingMail, setIsSendingMail] = useState(false);
    const [code, setCode] = useState("");
    const [forgotUsername, setForgotUsername] = useState("");
    const [forgotImage, setForgotImage] = useState("");

    // State
    const [loading, setLoading] = useState(false);
    const [justVerify, setJustVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    // Toggle password visibility
    const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

    // Prevent default behavior for password visibility toggle
    const handlePasswordMouseDown = (event) => event.preventDefault();

    // Validate form inputs
    const isFormValid = () => {
        return (
            userName.trim() !== "" &&
            userName.length < 255 &&
            password.length >= 8 &&
            password.length < 255
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setJustVerify(true);

        if (!isFormValid()) return;

        setLoading(true);

        const credentials = { username: userName, password };

        try {
            await POST("/auth/login", credentials);
            toast("Login successful!",
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
        } catch (err) {

            toast(err.response?.data?.message || "Something went wrong!",
                {
                    icon: err.response?.data?.message === "You're Google Authenticated" ? <InfoRoundedIcon /> : <CancelRoundedIcon />,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        } finally {
            setLoading(false);
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
            console.log(error);
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
                    icon: <CheckCircleRoundedIcon />,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            navigate("/");
        } catch (err) {
            toast(err.response?.data?.message || "Something went wrong!",
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

    const sendEmailToUser = async () => {
        setIsSendingMail((prev) => true);
        try {
            const results = await POST("/auth/send-mail", { userNameOrEmail: userName });
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
            console.log("results.data", results.data);
            setCode(results.data.code);
            setForgotUsername(results.data.username);
            setForgotImage(results.data.image);
            setIsForgotPassword((prev) => true);
        } catch (error) {
            console.log(error);
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
            setIsSendingMail((prev) => false);
        }
    }

    const handleForgotPassword = async () => {

        setUserNameOrEmailJustVerify((prev) => true);

        if (userName === "") return;

        setIsForgotPasswordLoading((prev) => true);
        try {
            const results = await GET("/auth/is-authenticated", { userNameOrEmail: userName });
            if (results.data.isAccountExists) {
                await sendEmailToUser();
            } else {
                toast("Account does not exist.\n Please sign up.",
                    {
                        icon: <InfoRoundedIcon />,
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
        } catch (error) {
            console.log(error);
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
            setIsForgotPasswordLoading((prev) => false);
        }
    }

    useEffect(() => {
        console.log("image", image);
    }, [image]);

    useEffect(() => {
        if (image && email && name) {
            setIsNewUser(true);
        }
    }, [image, email, name]);

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
                display: hasAccount ? "flex" : "none",
                height: "100vh",
                paddingX: { xs: 2, sm: 4 },
                paddingY: { xs: 4, sm: 6 },
            }}
        >
            {!isForgotPassword ? (
                !isNewUser ? (
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
                        <Avatar sx={{ backgroundColor: "#333333", mb: 2 }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold" mb={2}>
                            Sign in
                        </Typography>
                        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        value={userName}
                                        onChange={(e) => {
                                            if (e.target.value.length >= 255) return;
                                            setUserNameOrEmailJustVerify(true);
                                            setUserName(e.target.value);
                                        }}
                                        id="username"
                                        label="Username / Email ID"
                                        placeholder="Username OR Email-ID"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        size="small"
                                        error={
                                            (justVerify || userNameOrEmailJustVerify) && (userName === "" || userName.length >= 255)
                                        }
                                        helperText={
                                            (justVerify || userNameOrEmailJustVerify) &&
                                            (userName === ""
                                                ? "This field cannot be empty."
                                                : "")
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon sx={{ color: "#333333" }} />
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
                                            if (e.target.value.length >= 255) return;
                                            setPassword(e.target.value);
                                        }}
                                        id="password"
                                        label="Password"
                                        placeholder="Password"
                                        variant="outlined"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        required
                                        size="small"
                                        error={
                                            justVerify &&
                                            (password === "" || password.length < 8)
                                        }
                                        helperText={
                                            justVerify &&
                                            (password === ""
                                                ? "This field cannot be empty."
                                                : password.length < 8
                                                    ? "Password must contain at least 8 characters."
                                                    : "")
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
                                                        onClick={handleTogglePasswordVisibility}
                                                        onMouseDown={handlePasswordMouseDown}
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <Visibility sx={{ color: "#333333" }} />
                                                        ) : (
                                                            <VisibilityOff sx={{ color: "#333333" }} />
                                                        )}
                                                    </IconButton>
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
                                            borderRadius: 3,
                                            backgroundColor: "#333333",
                                            color: "white",
                                            "&:hover": {
                                                backgroundColor: "#404040",
                                            },
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                Signing In&nbsp;&nbsp;
                                                <CircularProgress
                                                    size={20}
                                                    thickness={7}
                                                    sx={{
                                                        color: "white",
                                                        '& circle': { strokeLinecap: 'round' },
                                                    }}
                                                />
                                            </>
                                        ) : ("Sign In")}
                                    </Button>
                                </Grid>

                                <Grid container justifyContent="space-between" sx={{ px: 2 }}>
                                    <Box
                                        onClick={handleForgotPassword}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            my: 2,
                                            fontSize: "small",
                                            fontWeight: "bold",
                                            color: isSendingMail ? "black" : "#666666",
                                            textDecoration: isSendingMail ? "none" : "underline",
                                            cursor: isSendingMail ? "auto" : "pointer",
                                            "&:hover": {
                                                color: "black",
                                            },
                                        }}
                                    >
                                        {isSendingMail ? ("Sending mail to the your registered email") : ("Forgot Password?")}
                                        {isForgotPasswordLoading ? (
                                            <CircularProgress
                                                size={14}
                                                thickness={7}
                                                sx={{
                                                    mx: 1,
                                                    color: "black",
                                                    '& circle': { strokeLinecap: 'round' },
                                                }}
                                            />
                                        ) : null}
                                    </Box>
                                </Grid>

                                <Grid container justifyContent="center" sx={{ pl: 2 }}>
                                    <Typography fontWeight="bold">
                                        OR
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} container justifyContent="center">
                                    <GoogleLogin setEmail={setEmail} setName={setName} setImage={setImage} />
                                </Grid>

                                <Grid container justifyContent="space-between" sx={{ px: 2 }}>
                                    <Box
                                        onClick={() => setHasAccount(false)}
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
                                        Don't have an account? Sign Up
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid >

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
                                        <IconButton onClick={() => { setIsNewUser(false); setImage(""); setEmail(""); setName(""); }}
                                            sx={{ bgcolor: "#F2F2F2", color: "#333333", position: "absolute", top: 0, left: 0, borderRadius: "50%" }}
                                        >
                                            <KeyboardBackspaceRoundedIcon sx={{ color: "#333333" }} />
                                        </IconButton>
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
                )
            ) : (
                <>
                    {!forgetPasswordStep ? (
                        <>
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
                                <VerifyCode
                                    code={code}
                                    setCode={setCode}
                                    sendEmailToUser={sendEmailToUser}
                                    setIsForgotPassword={setIsForgotPassword}
                                    setForgetPasswordStep={setForgetPasswordStep}
                                />
                            </Grid>
                        </>
                    ) : (
                        <>
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
                                <ResetPassword
                                    username={forgotUsername}
                                    image={forgotImage}
                                    setForgetPasswordStep={setForgetPasswordStep}
                                />
                            </Grid>
                        </>
                    )}
                </>
            )
            }

        </Grid >
    );
}
