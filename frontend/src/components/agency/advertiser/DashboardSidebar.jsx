import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
  Tooltip,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    text: "Profile",
    icon: <AccountCircleIcon sx={{ color: "#21cbf3" }} />,
    path: "/advertiserprofile",
    tooltip: "View and edit your profile",
  },
  {
    text: "Payment",
    icon: <PaymentIcon sx={{ color: "#21cbf3" }} />,
    path: "/advertiserprofile/payment",
    tooltip: "Manage your payments",
  },
  {
    text: "History",
    icon: <HistoryIcon sx={{ color: "#21cbf3" }} />,
    path: "/advertiser/history",
    tooltip: "View your activity history",
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => setOpen(open);

  return (
    <>
      {/* Floating Menu Button */}
      <Fade in={!open}>
        <Box
          sx={{
            position: "fixed",
            top: 28,
            left: 28,
            zIndex: 1301,
            display: open ? "none" : "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title="Open Menu" arrow>
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{
                color: "#fff",
                background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                boxShadow: 4,
                width: 56,
                height: 56,
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                },
                transition: "all 0.2s",
              }}
              size="large"
            >
              <MenuIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
            color: "#fff",
            width: 270,
            borderRight: "2px solid #21cbf3",
            boxShadow: 6,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 2,
            background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
            borderBottom: "2px solid #21cbf3",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              letterSpacing: 1,
              fontFamily: "Montserrat, Roboto, Arial",
            }}
          >
            Advertiser Menu
          </Typography>
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{
              color: "#fff",
              background: "rgba(33,203,243,0.15)",
              "&:hover": { background: "#21cbf3" },
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ background: "#21cbf3", mb: 1 }} />
        <List sx={{ width: "100%", py: 1 }}>
          {menuItems.map((item) => (
            <Tooltip key={item.text} title={item.tooltip} placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setOpen(false);
                    navigate(item.path);
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                      color: "#fff",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: "1.1rem",
                          letterSpacing: 1,
                        }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ background: "#21cbf3", mt: 1 }} />
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="caption" color="#21cbf3">
            &copy; {new Date().getFullYear()} AdVerse Advertiser
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
