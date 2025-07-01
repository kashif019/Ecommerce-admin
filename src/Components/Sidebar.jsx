import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_WIDTH = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle, isMobile }) => {
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, borderBottom: "1px solid #333" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontFamily: "monospace",
            textAlign: "center",
            color: "#fff",
          }}
        >
          Ten Sports Race
        </Typography>
      </Box>

      <Box sx={{ flex: 1, pt: 2 }}>
        <List sx={{ px: 1 }}>
          <ListItemButton
            component={Link}
            to="/dashboard"
            selected={location.pathname === "/dashboard" || location.pathname === "/dashboard/"}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              "&.Mui-selected": {
                backgroundColor: "#ff0000",
                "&:hover": {
                  backgroundColor: "#cc0000",
                },
              },
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === "/dashboard" || location.pathname === "/dashboard/"
                    ? "#fff"
                    : "#ccc",
                minWidth: 40,
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight:
                    location.pathname === "/dashboard" || location.pathname === "/dashboard/"
                      ? "bold"
                      : "normal",
                },
              }}
            />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/dashboard/ecommerce"
            selected={location.pathname.startsWith("/dashboard/ecommerce")}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              "&.Mui-selected": {
                backgroundColor: "#ff0000",
                "&:hover": {
                  backgroundColor: "#cc0000",
                },
              },
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname.startsWith("/dashboard/ecommerce") ? "#fff" : "#ccc",
                minWidth: 40,
              }}
            >
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText
              primary="E-commerce"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: location.pathname.startsWith("/dashboard/ecommerce")
                    ? "bold"
                    : "normal",
                },
              }}
            />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          backgroundColor: "#0d0d0d",
          color: "#fff",
          border: "none",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        backgroundColor: "#0d0d0d",
        color: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200,
        borderRight: "1px solid #333",
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default Sidebar;
