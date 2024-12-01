import React from "react";

// Material UI Components
import { Box, Typography, Link, Grid, IconButton } from "@mui/material";

// Material UI Icons
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#F2F2F2",
        color: "black",
        py: 4,
        px: { xs: 2, sm: 4 },
        mt: "auto",
        position: "relative"
      }}
    >
      <Box sx={{ position: "absolute", top: 0, right: 0, m: 2 }}>
        <IconButton href="https://github.com/ManojDhundhalva/CoEdit" target="_blank" color="inherit">
          <GitHubIcon />
        </IconButton>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, borderBottom: "1px solid black" }}>
            Contact
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            Email: coedit.service@gmail.com
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
