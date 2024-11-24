import React from "react";
import home from "../images/home.png";
import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../images/logo.jpg";

function HomePage() {
  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 30 }}>
        <img src={logo} alt="logo" style={{ width: 200 }} />
        <Typography fontWeight="bold" sx={{ fontSize: 100 }}>
          CoEdit
        </Typography>
      </Box>
      <Footer />
    </>
  );
}

export default HomePage;
