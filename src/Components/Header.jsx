import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

const Header = ({ onLogout, isMobile, handleDrawerToggle }) => {
  const location = useLocation();
  const isEcommerce = location.pathname.includes("/ecommerce");
  const title = isEcommerce ? "Ecommerce" : "Dashboard";

  return (
    <Box
      sx={{
        height: HEADER_HEIGHT,
        backgroundColor: "#111",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: isMobile ? 0 : SIDEBAR_WIDTH,
        right: 0,
        zIndex: 1100,
        px: 3,
        borderBottom: "1px solid #333",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "#fff",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontFamily: "monospace",
              textTransform: "uppercase",
              fontSize: "1.1rem",
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: "50px",
              height: "3px",
              backgroundColor: "#ff0000",
              mt: "2px",
              borderRadius: "2px",
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          sx={{
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          <NotificationsOutlinedIcon />
        </IconButton>

        <Button
          sx={{
            color: "#fff",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          <AccountCircleIcon sx={{ mr: 1 }} />
          Admin User
        </Button>

        <Button
          onClick={onLogout}
          sx={{
            backgroundColor: "#ff0000",
            color: "#fff",
            fontWeight: "bold",
            px: 3,
            py: 1,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#cc0000",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
  