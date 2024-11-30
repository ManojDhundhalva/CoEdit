import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

import React from "react";

function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.message}>Page Not Found <span style={styles.warningIcon}>⚠️</span></h2>
      <p style={styles.description}>We couldn't find the page you are looking for.</p>
      <button style={styles.button} onClick={() => window.location.href = '/'}>
        Back To Home
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
    fontFamily: "'Quicksand', sans-serif" // Updated font family
  },
  errorCode: {
    fontSize: "6rem",
    fontWeight: "bold",
    color: "#333"
  },
  message: {
    fontSize: "2rem",
    color: "#555",
    margin: "10px 0"
  },
  warningIcon: {
    marginLeft: "8px"
  },
  description: {
    fontSize: "1.5rem",
    color: "#777",
    marginBottom: "20px"
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#404040",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px"
  }
};


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
