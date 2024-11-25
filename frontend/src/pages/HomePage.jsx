import React from "react";
import home from "../images/home.png";
import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../images/logo.jpg";
import AboutUs from "./AboutUs";

function HomePage() {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 30, // Adjust margin for responsiveness
          flexDirection: { xs: "column", sm: "row" }, // Stack items on smaller screens
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "100%",
            maxWidth: 150, // Limit image size for smaller screens
            objectFit: "contain", // Ensure proper scaling
          }}
        />
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: { xs: 40, sm: 60, md: 100 }, // Adjust font size for responsiveness
            textAlign: { xs: "center", sm: "left" }, // Center text on smaller screens
            mt: { xs: 2, sm: 0 }, // Add margin on top for stacked layout
          }}
        >
          CoEdit
        </Typography>
      </Box>
      <AboutUs />
      <Footer />
    </>
  );
}

export default HomePage;
