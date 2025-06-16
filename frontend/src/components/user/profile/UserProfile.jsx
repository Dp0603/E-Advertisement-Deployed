import { Height } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

export const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    navigate("/login"); // Redirect to login page
    window.location.reload(); // Reload to ensure session is cleared
  };

  return (
    <Box
      display="flex"
      height="100vh"



    >

      <Box
        width="230px"
        borderRight="1px light"
        display="flex"
        flexDirection="column"
        p="3"
        gap={5}
        bgcolor="#F7EBE7"
        sx={{ pt: 4 }}


      >
        <Typography variant='h5' fontWeight={"bold"} sx={{ mt: 8, ml: 1, width: "200px", color: "Highlight" }} >Account Settings</Typography>

        <Button
          component={Link} to="profile"
          variant='contained'
          color='secondary'
          sx={{ width: "200px", ml: "6px" }} >
          Profile
        </Button>

        <Button
          component={Link} to="change-password"
          variant='contained'
          color='secondary'
          sx={{ width: "200px", ml: "6px" }}
        >Change password </Button>

        <Button
          component={Link} to="logout"
          variant='contained'
          color='error'
          sx={{ width: "200px", ml: "6px" }}
          onClick={handleLogout} // Call logout function directly
        >Logout</Button>
      </Box>

      <Box sx={{ flexGrow: 1, bgcolor: "#EFD7CF", display: "flex" }}>
      {location?.pathname === "/userprofile" && <Navigate to="profile" replace />}


      <Outlet />
      </Box>






    </Box >


  );
};







