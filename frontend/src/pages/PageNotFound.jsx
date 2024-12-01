import React from "react";
import { useNavigate } from "react-router-dom";

// Material UI Components
import { Box, Typography } from "@mui/material";

// Material UI Icons
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                bgcolor: "#f7f7f7",
                textAlign: "center",
                p: 2,
            }}
        >
            <Typography variant="h1" fontWeight="bold" sx={{ color: "#3f3f3f" }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, color: "#6f6f6f" }}>
                Oops! The page you're looking for doesn't exist.
            </Typography>
            <button
                onClick={() => navigate("/")}
                style={{ mt: 2 }}
            >
                <KeyboardBackspaceRoundedIcon />
                <Typography fontWeight="bold" sx={{ mx: 2 }}>
                    Go Back Home
                </Typography>
            </button>
        </Box>
    );
};

export default PageNotFound;
