import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  const menuItems = [
    { text: "Profile", icon: <AccountCircleIcon sx={{ color: "white" }} />, path: "/advertiserprofile" },
    { text: "Payment", icon: <PaymentIcon sx={{ color: "white" }} /> },
    { text: "History", icon: <HistoryIcon sx={{ color: "white" }} /> }
  ];

  return (
    <>
      {/* Menu Button to Open Sidebar */}
      <IconButton onClick={toggleDrawer(true)} sx={{ color: "white", position: "absolute", top: 20, left: 20 }}>
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { backgroundColor: "#0A1929", color: "white" },
        }}
      >
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.text == "Profile") {
                    navigate(item.path)
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
