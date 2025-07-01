import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  Snackbar,
  Alert,
  TextField,
  Grid,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import Header from "../Components/Header"; // Existing Header component
import Sidebar from "../Components/Sidebar"; // Existing Sidebar component
import ImageCarousel from "../Pages/ImageCarousel"; // Existing ImageCarousel component

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

const EditProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [product, setProduct] = useState(location.state?.product || null);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    productNo: "",
    category: "",
    sizes: "",
    stockQuantity: "",
    inStock: "",
    colors: "",
    description: "",
    image: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["Black", "White", "Red", "Violet", "Orange", "Yellow"];

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!product) {
      axios
        .get(`http://localhost:3002/api/contact/getaddproduct/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setProduct(res.data))
        .catch((err) => {
          console.error("Error fetching product:", err.response?.data || err);
          setSnackbar({
            open: true,
            message: "Failed to fetch product",
            severity: "error",
          });
        });
    }
  }, [id, product]);

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        price: product.price?.toString() || "",
        productNo: product.productNo?.toString() || "",
        category: product.category || "",
        sizes: product.sizes || sizes[0],
        stockQuantity: product.stockQuantity?.toString() || "",
        inStock: product.inStock?.toString() || "",
        colors: product.colors || colors[0],
        description: product.description || "",
        image: product.image || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleSubmit = async () => {
    if (
      !formData.productName ||
      !formData.price ||
      !formData.inStock ||
      !formData.category ||
      !formData.sizes ||
      !formData.stockQuantity ||
      !formData.colors ||
      !formData.image
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    const updated = {
      productName: formData.productName,
      price: Number(formData.price),
      productNo: formData.productNo ? Number(formData.productNo) : undefined,
      category: formData.category,
      sizes: formData.sizes,
      stockQuantity: Number(formData.stockQuantity),
      inStock: Number(formData.inStock),
      colors: formData.colors,
      description: formData.description,
      image: formData.image,
    };

    try {
      const res = await axios.put(
        `http://localhost:3002/api/contact/updateproduct/${id}`,
        updated,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProduct(res.data);
      setSnackbar({
        open: true,
        message: "Product updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update product:", error.response?.data || error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update product",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `http://localhost:3002/api/contact/deleteproduct/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSnackbar({
          open: true,
          message: "Product deleted",
          severity: "success",
        });
        navigate("/productlist");
      } catch (error) {
        console.error(
          "Failed to delete product:",
          error.response?.data || error
        );
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to delete product",
          severity: "error",
        });
      }
    }
  };

  const handleStockUpdate = async (action) => {
    try {
      const res = await axios.patch(
        `http://localhost:3002/api/contact/updatestock/${id}?action=${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProduct(res.data);
      setFormData((prev) => ({
        ...prev,
        inStock: res.data.inStock.toString(),
        stockQuantity: res.data.stockQuantity.toString(),
      }));
      setSnackbar({
        open: true,
        message: `Stock ${action === "in" ? "increased" : "decreased"}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update stock:", error.response?.data || error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Stock update failed",
        severity: "error",
      });
    }
  };

  if (!product) return <Typography>Loading product...</Typography>;

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
          backgroundColor: "#1a1a1a",
        }}
      >
        <Header
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
          onLogout={handleLogout}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: `${HEADER_HEIGHT + 16}px`,
            px: 3,
            pb: 3,
            backgroundColor: "#1a1a1a",
            color: "#fff",
            minHeight: "100vh",
            overflowX: "hidden",
          }}
        >
          {/* Image Carousel Section */}
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

          {/* Product Edit Section */}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container spacing={3} sx={{ height: "100%" }}>
              {/* Product Image */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: 400,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={formData.image || "https://via.placeholder.com/300"}
                    alt={formData.productName}
                    sx={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                      maxWidth: 300,
                      maxHeight: 300,
                    }}
                  />
                </Card>
                <Box
                  {...getRootProps()}
                  sx={{
                    mt: 2,
                    height: 60,
                    backgroundColor: "#333",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ccc",
                    cursor: "pointer",
                    border: "2px dashed #555",
                    "&:hover": { backgroundColor: "#444" },
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography variant="body2">
                    {formData.image ? "Change image" : "Upload image"}
                  </Typography>
                </Box>
              </Grid>

              {/* Product Details */}
              <Grid item xs={12} md={5}>
                <Box sx={{ color: "#fff" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    {formData.productName || "RIDING HELMET"}
                  </Typography>

                  {/* Size Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{ mb: 1, fontWeight: "bold" }}
                    >
                      Size
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {sizes.map((size) => (
                        <Button
                          key={size}
                          variant={
                            formData.sizes === size ? "contained" : "outlined"
                          }
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, sizes: size }))
                          }
                          sx={{
                            minWidth: 50,
                            height: 40,
                            backgroundColor:
                              formData.sizes === size ? "#555" : "transparent",
                            color: "#fff",
                            borderColor: "#555",
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "#555",
                              borderColor: "#555",
                            },
                          }}
                        >
                          {size}
                        </Button>
                      ))}
                    </Box>
                  </Box>

                  {/* Color Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{ mb: 1, fontWeight: "bold" }}
                    >
                      Color
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {colors.map((color) => (
                        <Button
                          key={color}
                          variant={
                            formData.colors === color ? "contained" : "outlined"
                          }
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, colors: color }))
                          }
                          sx={{
                            minWidth: 70,
                            height: 40,
                            backgroundColor:
                              formData.colors === color
                                ? "#555"
                                : "transparent",
                            color: "#fff",
                            borderColor: "#555",
                            borderRadius: 1,
                            textTransform: "capitalize",
                            "&:hover": {
                              backgroundColor: "#555",
                              borderColor: "#555",
                            },
                          }}
                        >
                          {color}
                        </Button>
                      ))}
                    </Box>
                  </Box>

                  {/* Quantity and Selected Info */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Quantity
                      </Typography>
                      <TextField
                        size="small"
                        value={formData.stockQuantity}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            stockQuantity: e.target.value,
                          }))
                        }
                        sx={{
                          width: 80,
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#333",
                            color: "#fff",
                            "& fieldset": { borderColor: "#555" },
                            "&:hover fieldset": { borderColor: "#777" },
                            "&.Mui-focused fieldset": { borderColor: "#999" },
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      Selected Size: {formData.sizes}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ccc" }}>
                      Selected Color: {formData.colors}
                    </Typography>
                  </Box>

                  {/* Submit Button */}
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      backgroundColor: "#ff4444",
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "none",
                      px: 4,
                      py: 1,
                      "&:hover": { backgroundColor: "#cc3333" },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>

              {/* Stock Information */}
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 2,
                    color: "#fff",
                  }}
                >
                  <IconButton
                    onClick={handleDelete}
                    sx={{
                      backgroundColor: "#ff4444",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#cc3333" },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <Box
                    sx={{
                      backgroundColor: "#2a2a2a",
                      p: 2,
                      borderRadius: 2,
                      textAlign: "center",
                      minWidth: 120,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      Sale Stocks
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {formData.stockQuantity || "200"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "#2a2a2a",
                      p: 2,
                      borderRadius: 2,
                      textAlign: "center",
                      minWidth: 120,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      Remain Stock
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {formData.inStock || "103"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Button
                      onClick={() => handleStockUpdate("in")}
                      sx={{
                        backgroundColor: "#009688",
                        color: "#fff",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#00796b" },
                      }}
                    >
                      Stock In
                    </Button>
                    <Button
                      onClick={() => handleStockUpdate("out")}
                      sx={{
                        backgroundColor: "#f44336",
                        color: "#fff",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#d32f2f" },
                      }}
                    >
                      Stock Out
                    </Button>
                    <Button
                      onClick={() =>
                        navigate("/dashboard/ecommerce", {
                          state: { showAddProduct: false },
                        })
                      }
                      sx={{
                        backgroundColor: "#555",
                        color: "#fff",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#666" },
                      }}
                    >
                      Back to Products
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProduct;
