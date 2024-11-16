// Desc: User component to display user profile and update user profile
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';

// Contexts
import { useUser } from '../context/user';
import { useAuth } from '../context/auth';

// Hooks
import useAPI from '../hooks/api';

// Utils
import { isValidFullName } from '../utils/validation';
import { getAvatar } from "../utils/avatar";
import { DateFormatter } from "../utils/formatters"

// Material-UI Components
import {
    Box,
    Typography,
    Avatar,
    TextField,
    InputAdornment,
    CircularProgress
} from '@mui/material';

// Material-UI Icons
import PersonIcon from '@mui/icons-material/Person';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';

function User(props) {

    const { handleClose } = props;

    const { POST } = useAPI();
    const { userInfo, getUser } = useUser();
    const { LogOut } = useAuth();

    const [fullName, setFullName] = useState(userInfo.fullName);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [justVerify, setJustVerify] = useState(false);

    const [isProfileImageUpdate, setIsProfileImageUpdate] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        setJustVerify(true);

        if (fullName.trim() === "") return;

        setIsUpdatingProfile(true);
        try {
            const results = await POST("/user", { name: fullName });
            toast(results?.data?.message || "Profile updated successfully",
                {
                    icon: <CheckCircleRoundedIcon />,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            getUser();
        } catch (error) {
            console.error("Error updating user data: ", error);
            toast(error.response?.data?.message || "Error updating user data",
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
            setIsUpdatingProfile(false);
        }
    };

    const handleFullNameChange = (e) => {
        if (!isValidFullName(e.target.value) || e.target.value.length >= 255) return;
        setFullName(e.target.value); // Update state only if it matches the pattern
        setJustVerify(true);
    }

    return (
        <>
            <Box sx={{ minWidth: "400px", minHeight: "300px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                <Box sx={{ m: 1 }}>
                    <Typography fontWeight="bold" sx={{ color: "#666666" }}>{userInfo.email || "email: N/A"}</Typography>
                </Box>
                <Box sx={{ position: "absolute", right: 0, top: 0, m: 1 }}>
                    <CloseRoundedIcon
                        onClick={handleClose}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: "bold",
                            color: 'black',
                            borderRadius: '5px',
                            '&:hover': { bgcolor: '#CCCCCC' },
                        }}
                    />
                </Box>
                <Box sx={{ m: 1 }}>
                    <Avatar
                        sx={{ bgcolor: "#333333", width: 150, height: 150, fontSize: 75, border: "2px solid black" }}
                        alt={userInfo.userName}
                        src={getAvatar(userInfo.profileImage)}
                    />
                </Box>
                <Box sx={{ m: 1, my: 2 }}  >
                    <Typography fontWeight="bold" variant='h5' sx={{ color: "#333333" }}>Hii, {userInfo.userName || "username: N/A"}!</Typography>
                </Box>
                <form onSubmit={handleUpdateProfile} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    <Box sx={{ m: 1, my: 2 }}>
                        <TextField
                            value={fullName}
                            onChange={handleFullNameChange}
                            id="Name"
                            label="Name"
                            placeholder="John Doe"
                            variant="outlined"
                            fullWidth
                            size="small"
                            error={
                                justVerify && (fullName === "")
                            }
                            helperText={
                                justVerify &&
                                (fullName.trim() === ""
                                    ? "This field cannot be empty."
                                    : "")
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: "black" }} />
                                    </InputAdornment>
                                ),
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
                    <Box sx={{ m: 1, my: 2 }}>
                        <button type="submit" style={{ fontWeight: "bold" }}>
                            {isUpdatingProfile ? (
                                <>
                                    Updating... &nbsp;&nbsp;
                                    <CircularProgress size={20} thickness={6}
                                        sx={{
                                            color: "black",
                                            '& circle': { strokeLinecap: 'round' },
                                        }}
                                    />
                                </>
                            ) : ("Update")}
                        </button>
                    </Box>
                </form>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography fontWeight="bold" variant='caption' sx={{ color: "#666666" }}>Created On: {DateFormatter(userInfo.createdAt) || "createdAt: N/A"}</Typography>
                    <Typography fontWeight="bold" variant='caption' sx={{ color: "#666666" }}>Updated On: {DateFormatter(userInfo.updatedOn) || "updatedOn: N/A"}</Typography>
                </Box>
                <Box sx={{ mt: 2, p: 2, borderTop: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <button onClick={() => LogOut()} style={{ fontWeight: "bold" }}>
                        LogOut <ExitToAppRoundedIcon sx={{ color: "black", ml: 2 }} />
                    </button>
                </Box>
            </Box>
        </>
    )
}

export default User