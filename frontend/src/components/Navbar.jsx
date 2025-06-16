import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

export const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#ffffff", color: "#333", boxShadow: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left-Side Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
        >
          Adverse
        </Typography>

        {/* Center Links with Scroll Feature */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 3 }}>
          <Button component={ScrollLink} to="services" smooth={true} duration={200} sx={{ color: "inherit", cursor: "pointer" }}>
            Services
          </Button>
          <Button component={ScrollLink} to="faqs" smooth={true} duration={200} sx={{ color: "inherit", cursor: "pointer" }}>
            FAQs
          </Button>
          <Button component={ScrollLink} to="about" smooth={true} duration={200} sx={{ color: "inherit", cursor: "pointer" }}>
            About Us
          </Button>
          <Button component={ScrollLink} to="contact" smooth={true} duration={200} sx={{ color: "inherit", cursor: "pointer" }}>
            Contact Us
          </Button>
          <Button component={ScrollLink} to="terms" smooth={true} duration={200} sx={{ color: "inherit", cursor: "pointer" }}>
            Terms & Conditions
          </Button>
        </Box>

        {/* Right-Side Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={RouterLink} to="/login" variant="outlined" sx={{ borderColor: "#1976d2", color: "#1976d2" }}>
            Login
          </Button>
          <Button component={RouterLink} to="/specificregister" variant="contained" sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
