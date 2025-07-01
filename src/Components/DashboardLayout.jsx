import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../Pages/Dashboard";
import ParticipantRegistration from "../Pages/ParticipantRegistration";
import ParticipantList from "../Pages/ParticipantList";

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

const DashboardLayout = ({ onLogout }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
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
            backgroundColor: "#000", // black background
            color: "#fff",           // white text
            minHeight: "100vh",
            overflow: "auto",
          }}
        >
         
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
           <ParticipantRegistration />
           <ParticipantList />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
