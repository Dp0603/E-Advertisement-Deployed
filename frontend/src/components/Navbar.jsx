import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import AdbIcon from "@mui/icons-material/Adb"; // Example logo icon

const navLinks = [
  { label: "Services", to: "services" },
  { label: "FAQs", to: "faqs" },
  { label: "About Us", to: "about" },
  { label: "Contact Us", to: "contact" },
  { label: "Terms & Conditions", to: "terms" },
];

export const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "rgba(255,255,255,0.95)",
        color: "#222",
        boxShadow: "0 4px 24px 0 rgba(33,203,243,0.08)",
        backdropFilter: "blur(8px)",
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: "2px solid #e3f2fd",
      }}
      elevation={0}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 72 }}>
        {/* Logo & Brand */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            mr: 2,
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 40,
              height: 40,
              mr: 1,
              boxShadow: 2,
            }}
          >
            <AdbIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              color: "#1976d2",
              fontWeight: "bold",
              letterSpacing: 2,
              fontFamily: "Montserrat, Roboto, Arial",
              fontSize: "1.5rem",
              textShadow: "0 2px 8px rgba(33,203,243,0.08)",
            }}
          >
            AdVerse
          </Typography>
        </Box>

        {/* Center Links or Drawer Toggle */}
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ ml: "auto" }}
            >
              <MenuIcon sx={{ fontSize: 32 }} />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              PaperProps={{
                sx: {
                  width: 270,
                  background: "linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)",
                  borderLeft: "2px solid #21cbf3",
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", width: 36, height: 36, mr: 1 }}>
                    <AdbIcon sx={{ color: "#fff", fontSize: 22 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#1976d2", letterSpacing: 1 }}
                  >
                    AdVerse
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <List>
                  {navLinks.map((link) => (
                    <ListItem key={link.to} disablePadding>
                      <ListItemButton
                        component={ScrollLink}
                        to={link.to}
                        smooth={true}
                        duration={200}
                        onClick={handleDrawerToggle}
                        sx={{
                          color: "#1976d2",
                          fontWeight: 500,
                          borderRadius: 2,
                          "&.active": { color: "#1565c0" },
                        }}
                      >
                        <ListItemText primary={link.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mt: 1,
                  }}
                >
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      width: "100%",
                      fontWeight: 600,
                      borderRadius: "30px",
                      letterSpacing: 1,
                      "&:hover": {
                        borderColor: "#1565c0",
                        color: "#1565c0",
                        background: "#e3f2fd",
                      },
                    }}
                    onClick={handleDrawerToggle}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/specificregister"
                    variant="contained"
                    sx={{
                      background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                      color: "#fff",
                      width: "100%",
                      fontWeight: 600,
                      borderRadius: "30px",
                      letterSpacing: 1,
                      boxShadow: "0 4px 20px rgba(25,118,210,0.08)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                      },
                    }}
                    onClick={handleDrawerToggle}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                gap: 2.5,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  component={ScrollLink}
                  to={link.to}
                  smooth={true}
                  duration={200}
                  sx={{
                    color: "#1976d2",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    letterSpacing: 1,
                    background: "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#fff",
                      background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                    },
                  }}
                  activeClass="active"
                >
                  {link.label}
                </Button>
              ))}
            </Box>
            {/* Right-Side Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Login to your account" arrow>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    fontWeight: 600,
                    borderRadius: "30px",
                    letterSpacing: 1,
                    px: 3,
                    "&:hover": {
                      borderColor: "#1565c0",
                      color: "#1565c0",
                      background: "#e3f2fd",
                    },
                  }}
                >
                  Login
                </Button>
              </Tooltip>
              <Tooltip title="Create a new account" arrow>
                <Button
                  component={RouterLink}
                  to="/specificregister"
                  variant="contained"
                  sx={{
                    background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "30px",
                    letterSpacing: 1,
                    px: 3,
                    boxShadow: "0 4px 20px rgba(25,118,210,0.08)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Tooltip>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
