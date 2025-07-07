import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, useMediaQuery, Button } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../Pages/Dashboard";
import ParticipantRegistration from "../Pages/ParticipantRegistration";
import ParticipantList from "../Pages/ParticipantList";
import PartticipantEdit from "../Pages/ParticipantEdit";

const SIDEBAR_WIDTH = 350;
const HEADER_HEIGHT = 80;

const DashboardLayout = ({ onLogout }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleToggleRegistration = () => {
    setShowRegistration((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#000" }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          onLogout={onLogout}
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: `${HEADER_HEIGHT + 16}px`,
            px: 3,
            pb: 3,
            backgroundColor: "#000",
            color: "#fff",
            minHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>

          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleToggleRegistration}
              sx={{ mr: 2 }}
            >
              {showRegistration
                ? "Hide ParticipantRegistration"
                : "Show ParticipantRegistration"}
            </Button>
          </Box>

          {showRegistration && (
            <Box sx={{ mb: 3 }}>
              <ParticipantRegistration />
            </Box>
          )}

          
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
