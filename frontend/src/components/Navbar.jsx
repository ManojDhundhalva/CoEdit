import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Box, Avatar, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import User from "../components/User";
import { useUser } from "../context/user";
import { getAvatar } from "../utils/avatar";

const Navbar = () => {
  const { userInfo } = useUser();

  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [showNavbar, setShowNavbar] = useState(true);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    setShowNavbar(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

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

  const navbarStyle = {
    position: "fixed",
    width: "100%",
    top: showNavbar ? "0" : "-80px",
    zIndex: 100,
    transition: "top 0.3s",
    backdropFilter: "blur(10px)",
  };

  const buttonStyles = {
    fontWeight: "bold",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
    "&:hover": {
      borderBottom: "2px solid #134611",
      borderTopRightRadius: "5px",
      borderTopLeftRadius: "5px",
    },
  };

  const linkStyles = {
    fontFamily: "Quicksand",
    color: "#134611",
  };

  return (
    <nav className="navbar navbar-expand-lg p-1" style={navbarStyle}>
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "xx-large",
            fontFamily: "Quicksand",
          }}
        >
          <i className="fa-regular fa-newspaper"></i>
          Editor
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <Button disableRipple variant="text" sx={buttonStyles}>
              <Link className="nav-link active" to="/" style={linkStyles}>
                Home
              </Link>
            </Button>
            <Button disableRipple variant="text" sx={buttonStyles}>
              <Link
                className="nav-link active"
                to="/project"
                style={linkStyles}
              >
                project
              </Link>
            </Button>
            <Button disableRipple variant="text" sx={buttonStyles}>
              <Link
                className="nav-link active"
                to="/aboutus"
                style={linkStyles}
              >
                About Us
              </Link>
            </Button>
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
                sx={{ cursor: "pointer", width: 46, height: 46, border: "1px solid black", }}
                alt={userInfo.userName}
                src={getAvatar(userInfo.profileImage)}
                imgProps={{
                  crossOrigin: "anonymous",
                  referrerPolicy: "no-referrer",
                  decoding: "async",
                }}
              />
            </Tooltip>
            {isProfileOpen ?
              <Box ref={profileRef} sx={{ zIndex: 9999999, position: "fixed", right: 10, top: 80, bgcolor: "#FAFAFA", border: "1px solid black", borderRadius: "10px" }}>
                <User handleClose={handleCloseProfile} />
              </Box> : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
