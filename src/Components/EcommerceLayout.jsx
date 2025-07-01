import React, { useState } from "react";
import { Box, Button, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AddProduct from "../Pages/AddProduct";
import ImageCarousel from "../Pages/ImageCarousel";
import ProductList from "../Pages/ProductList";
import EditProduct from "../Pages/EditProduct";
import IconButton from "@mui/material/IconButton";

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

const EcommerceLayout = ({ onLogout }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(location.state?.showAddProduct || false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleToggle = () => {
    setShowAddProduct((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>
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
          overflowX: "hidden",
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
            overflowX: "hidden",
          }}
        >
          <Box
            sx={{
              height: 200,
              backgroundColor: "#2a2a2a",
              borderRadius: 2,
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <ImageCarousel />
            <IconButton
              sx={{
                position: "absolute",
                left: 10,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
            >
              ‹
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                right: 10,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
            >
              ›
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleToggle}
            sx={{ mb: 2 }}
          >
            {showAddProduct ? "Product List" : "Add Product"}
          </Button>
          {showAddProduct ? <AddProduct /> : <ProductList />}
          <EditProduct />
        </Box>
      </Box>
    </Box>
  );
};

export default EcommerceLayout;
