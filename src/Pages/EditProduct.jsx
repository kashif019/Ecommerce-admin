import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import axios from "axios";
import ImageCarousel from "../Pages/ImageCarousel";

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

const DarkContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#1a1a1a",
  minHeight: "100vh",
  padding: theme.spacing(4),
  color: "white",
  display: "flex",
  gap: theme.spacing(4),
}));

const ImageBox = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: "#111",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

const DetailBox = styled(Box)(({ theme }) => ({
  flex: 2,
  backgroundColor: "#111",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  color: "white",
  border: "1px solid #444",
  "&.Mui-selected": {
    backgroundColor: "#333",
    color: "#ff5252",
  },
  "&:hover": {
    backgroundColor: "#222",
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  textAlign: "center",
  minWidth: 120,
}));

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState("");
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3002/api/contact/AddProduct/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProduct(res.data);
        setProductName(res.data.productName);
        setImage(res.data.image);
        setSelectedSize(res.data.sizes?.[0] || "");
        setSelectedColor(res.data.colors?.[0] || "");
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch product",
          severity: "error",
        });
        console.error("Failed to fetch product", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleStockUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      for (let i = 0; i < quantity; i++) {
        await axios.patch(
          `http://localhost:3002/api/contact/AddProduct/${id}/stock?action=in`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      const res = await axios.get(
        `http://localhost:3002/api/contact/AddProduct/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProduct(res.data);
      setSnackbar({
        open: true,
        message: "Stock updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update stock",
        severity: "error",
      });
      console.error("Failed to update stock", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3002/api/contact/AddProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete product",
        severity: "error",
      });
      console.error("Failed to delete product", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3002/api/contact/AddProduct/${id}`,
        { productName, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Product updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update product",
        severity: "error",
      });
      console.error("Failed to update product", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!product) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={false}
        handleDrawerToggle={() => {}}
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
          onLogout={() => {}}
          isMobile={isMobile}
          handleDrawerToggle={() => {}}
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
          <ImageCarousel />
          <DarkContainer>
            <ImageBox>
              <img
                src={product.image}
                alt={product.productName}
                style={{ maxWidth: "100%", maxHeight: 350 }}
              />
            </ImageBox>

            <DetailBox>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap={2} flex={1}>
                  <IconButton
                    onClick={() =>
                      navigate("/dashboard/ecommerce", {
                        state: { showAddProduct: false },
                      })
                    }
                    sx={{ color: "white" }}
                  >
                    <ArrowBackIcon />
                  </IconButton>

                  <TextField
                    label="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: "#2d2d2d",
                      borderRadius: 1,
                      input: { color: "white" },
                      label: { color: "white" },
                      mb: 2,
                    }}
                  />
                </Box>
                <IconButton onClick={handleDelete} sx={{ color: "red" }}>
                  <i className="fas fa-trash" />
                </IconButton>
              </Box>

              <TextField
                label="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "#2d2d2d",
                  borderRadius: 1,
                  input: { color: "white" },
                  label: { color: "white" },
                  mb: 3,
                }}
              />

              <Typography fontWeight="bold" mt={2}>
                Size
              </Typography>
              <ToggleButtonGroup
                value={selectedSize}
                exclusive
                onChange={(e, val) => setSelectedSize(val)}
              >
                {product.sizes.map((size) => (
                  <StyledToggleButton key={size} value={size}>
                    {size}
                  </StyledToggleButton>
                ))}
              </ToggleButtonGroup>

              <Typography fontWeight="bold" mt={2}>
                Color
              </Typography>
              <ToggleButtonGroup
                value={selectedColor}
                exclusive
                onChange={(e, val) => setSelectedColor(val)}
              >
                {product.colors.map((color) => (
                  <StyledToggleButton key={color} value={color}>
                    {color}
                  </StyledToggleButton>
                ))}
              </ToggleButtonGroup>

              <Box mt={3}>
                <Typography>Quantity</Typography>
                <Select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{
                    mt: 1,
                    backgroundColor: "#2d2d2d",
                    color: "white",
                    borderRadius: 1,
                  }}
                >
                  {[...Array(10)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box display="flex" gap={2} mt={4} alignItems="center">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#e53e3e" }}
                  onClick={handleStockUpdate}
                >
                  Stock In
                </Button>

                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#4caf50" }}
                  onClick={handleUpdate}
                >
                  Update Details
                </Button>

                <Box display="flex" gap={2}>
                  <StatBox>
                    <Typography variant="body2">Sale Stocks</Typography>
                    <Typography variant="h6">
                      {product.stockQuantity - product.inStock}
                    </Typography>
                  </StatBox>
                  <StatBox>
                    <Typography variant="body2">Remain Stock</Typography>
                    <Typography variant="h6">{product.inStock}</Typography>
                  </StatBox>
                </Box>
              </Box>
            </DetailBox>

            <Snackbar
              open={snackbar.open}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
            >
              <Alert
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </DarkContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProduct;
