import React from "react";
// Page Components
import AboutUs from "./AboutUs";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThreeScene from "../components/home/ThreeScene";
import HorizontalScroll from "../components/home/HorizontalScroll";

// Material UI Components
import { Box, Typography } from "@mui/material";

function HomePage() {
  return (
    <>
      <Navbar />
      <Box sx={{ overflow: "hidden", display: "flex", justifyContent: "flex-end" }}>
        <ThreeScene />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography fontWeight="bold" fontSize={100} sx={{ color: "#012A4A" }}>
          Features/Services
        </Typography>
      </Box>
      <Box sx={{ overflow: "hidden", my: 4 }}>
        <HorizontalScroll />
      </Box>
      <AboutUs />
      <Footer />
    </>
  );
}

export default HomePage;
