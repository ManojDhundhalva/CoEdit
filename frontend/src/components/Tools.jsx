import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Tooltip,
  Zoom,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import Contributor from "./Contributor";
import useAPI from "../hooks/api";
import { useRef } from "react";
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import Cookies from "js-cookie"
import User from "./User";
import { useUser } from "../context/user";
import { getAvatar } from "../utils/avatar";


const CustomDialog = ({ open, handleClose, projectId }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();  // Close the modal if clicking outside of it
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleClose(); // Call the function on pressing Escape
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  if (!open) return null;

  return (
    <Box ref={modalRef}>
      <Contributor
        projectId={projectId}
        handleClose={handleClose}
      />
    </Box >
  );
};


const Tools = ({ liveUsers }) => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const { projectId } = useParams();
  const { GET } = useAPI();
  const { userInfo } = useUser();

  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getProjectName = async () => {
      try {
        const { data } = await GET("/project/get-project-name", { projectId });
        console.log("TOOLS", data);
        setProjectName((prev) => data.project_name);
        setIsAdmin((prev) => data.is_admin);
      } catch (err) {
        console.log("err ->", err);
      }
    };

    getProjectName();
  }, []);

  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileVisible((prev) => !prev);
  }
  const handleCloseProfile = () => setIsProfileVisible(false);

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        handleCloseProfile();  // Close the modal if clicking outside of it
      }
    }

    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("click", handleClickOutside);
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
      <CustomDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        projectId={projectId}
      />
      <Box sx={{ display: "flex", p: 0, m: 0, borderBottom: "1px solid black" }}>
        {/* Left Section: Icon and Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <IconButton onClick={() => navigate("/project")}>
              <DescriptionRoundedIcon fontSize="large" sx={{ color: "black" }} />
            </IconButton>
            <Typography fontWeight="bold" fontSize="x-large">
              {projectName}
            </Typography>
          </Box>
        </Box>

        {/* Right Section: Icons and Avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {liveUsers && liveUsers?.length > 0 &&
            liveUsers.map((liveUser, index) => (
              <Tooltip
                key={index}
                TransitionComponent={Zoom}
                title={
                  Cookies.get("username") === liveUser.username
                    ? "You"
                    : liveUser.username
                }
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
                <Avatar
                  onClick={toggleProfile}
                  sx={{ width: 42, height: 42, border: "1px solid black", }}
                  alt={liveUser.username}
                  src={getAvatar(liveUser.image)}
                  imgProps={{
                    crossOrigin: "anonymous",
                    referrerPolicy: "no-referrer",
                    decoding: "async",
                  }}
                />
              </Tooltip>
            ))}
          <Box sx={{ m: 0, ml: 1, p: 0 }}>
            <Typography fontWeight="bold" fontSize="x-large">|</Typography>
          </Box>
          {isAdmin ?
            <Box sx={{ ml: 1 }}>
              <Tooltip
                title="Add Contributors"
                leaveDelay={0}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "common.black",
                      color: "white",
                      transition: "none",
                    },
                  },
                }}
              >
                <button onClick={handleClickOpenDialog}>
                  <GroupAddRoundedIcon />
                </button>
              </Tooltip>
            </Box>
            : null}
          <Box sx={{ mx: 1 }}>
            <Tooltip title="profile"
              enterDelay={200}
              leaveDelay={0}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "common.black",
                    "& .MuiTooltip-arrow": {
                      color: "common.black",
                    },
                  },
                },
              }}>
              <Avatar
                onClick={toggleProfile}
                sx={{ cursor: "pointer", width: 42, height: 42, border: "1px solid black", }}
                alt={userInfo.userName}
                src={getAvatar(userInfo.profileImage)}
                imgProps={{
                  crossOrigin: "anonymous",
                  referrerPolicy: "no-referrer",
                  decoding: "async",
                }}
              />
            </Tooltip>
            {isProfileVisible ? <Box ref={profileRef} sx={{ zIndex: 9999999, position: "absolute", right: 10, top: 54, bgcolor: "#FAFAFA", border: "1px solid black", borderRadius: "10px" }}>
              <User handleClose={handleCloseProfile} />
            </Box> : null}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Tools;