import { Height } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

export const AdvertiserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }
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
          sx={{ width: "180px", ml: "6px" }} >
          Profile
        </Button>

        <Button
          component={Link} to="change-password"
          variant='contained'
          color='secondary'
          sx={{ width: "180px", ml: "6px" }}
        >Change password </Button>

        <Button
          component={Link} to="logout"
          variant='contained'
          color='error'
          onClick={(handleLogout)}
          sx={{ width: "180px", ml: "6px" }}
        >Logout</Button>
      </Box>

      {location?.pathname === "/advertiserprofile" && <Navigate to="profile" replace />}


      <Outlet />






    </Box >


  )




}







