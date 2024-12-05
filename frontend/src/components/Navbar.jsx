import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Material Componets
import { Box, Avatar, Tooltip, Typography } from "@mui/material";

//Components
import User from "../components/User";

//context api
import { useUser } from "../context/user";

//utils
import { getAvatar } from "../utils/avatar";

//images
import logo from "../images/logo.jpg";

const Navbar = () => {
  const { userInfo } = useUser();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const handleCloseProfile = () => setIsProfileOpen(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        handleCloseProfile();  // Close the modal if clicking outside of it
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleCloseProfile]);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseProfile(); // Call the function on pressing Escape
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleCloseProfile]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 1, sm: 2 },
          py: 1,
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ width: 50 }}
          />
          <Typography
            fontWeight="bold"
            fontSize={{ xs: "x-large", sm: "x-large" }}
            sx={{ mx: { xs: 0, sm: 1 } }}
          >
            CoEdit
          </Typography>
        </Box>

        {/* Right Section */}
        {userInfo.userName ?
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              onClick={() => navigate("/project")}
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                mx: { xs: 1, sm: 2 },
                my: { xs: 1, sm: 0 },
                bgcolor: "#F2F2F2",
                borderRadius: "6px",
                py: 1,
                px: { xs: 2, sm: 3 },
                "&:hover": {
                  bgcolor: "#E6E6E6",
                },
              }}
            >
              Projects
            </Box>

            <Box>
              <Tooltip
                title="profile"
                enterDelay={200}
                leaveDelay={0}
                componentsProps={{
                  tooltip: {
                    sx: {
                      border: "1px solid black",
                      bgcolor: "white",
                      color: "black",
                      transition: "none",
                      fontWeight: "bold",
                    },
                  },
                  arrow: {
                    sx: {
                      color: "black",
                    },
                  },
                }}
              >
                <Avatar
                  onClick={toggleProfile}
                  sx={{
                    cursor: "pointer",
                    width: 46,
                    height: 46,
                    border: "1px solid black",
                  }}
                  alt={userInfo.userName}
                  src={getAvatar(userInfo.profileImage)}
                  imgProps={{
                    crossOrigin: "anonymous",
                    referrerPolicy: "no-referrer",
                    decoding: "async",
                  }}
                />
              </Tooltip>
              {isProfileOpen ? (
                <Box
                  ref={profileRef}
                  sx={{
                    zIndex: 9999,
                    position: "fixed",
                    right: 10,
                    top: 64,
                    bgcolor: "#FAFAFA",
                    border: "1px solid black",
                    borderRadius: "10px",
                  }}
                >
                  <User handleClose={handleCloseProfile} />
                </Box>
              ) : null}
            </Box>
          </Box> :
          <Box >
            <Box
              onClick={() => navigate("/auth")}
              sx={{
                backgroundColor: "#333333", color: "white",
                fontWeight: "bold", px: 2, py: 1, borderRadius: "6px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "black" }
              }}
            >
              Login / SignUp
            </Box>
          </Box>
        }
      </Box>

    </>
  );
};

export default Navbar;
