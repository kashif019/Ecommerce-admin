import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import StockManagement from "./StockManagement"; // Adjust path as needed
import AddProduct from "../Pages/AddProduct"; // Adjust path if needed

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [view, setView] = useState("list"); // 'list' or 'stock'
  const [stockMode, setStockMode] = useState("in"); // 'in' or 'out'
  const [showAddProduct, setShowAddProduct] = useState(false);

  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleToggle = () => {
    setShowAddProduct((prev) => !prev);
  };

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Violet",
    "Orange",
    "Yellow",
  ];

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/api/contact/getaddproduct",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Log images for debugging
      res.data.forEach((product) => {
        console.log(
          `Product ${product.productName} image:`,
          product.image ? `${product.image.substring(0, 30)}...` : "No image"
        );
      });
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err.response?.data || err);
      setSnackbar({
        open: true,
        message: "Failed to fetch products",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter(
        (p) =>
          p.productName.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    setFiltered(result);
  }, [search, selectedCategory, products]);

  const handleSizeSelect = (id, size) => {
    setSelectedSize((prev) => ({ ...prev, [id]: size }));
  };

  const handleColorSelect = (id, color) => {
    setSelectedColor((prev) => ({ ...prev, [id]: color }));
  };

  const updateStock = async (id, action) => {
    try {
      await axios.patch(
        `http://localhost:3002/api/contact/updatestock/${id}?action=${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchProducts();
      setSnackbar({
        open: true,
        message: `Stock ${action === "in" ? "increased" : "decreased"}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Failed to update stock:", err.response?.data || err);
      setSnackbar({
        open: true,
        message: "Stock update failed",
        severity: "error",
      });
    }
  };

  const handleSubmitUpdate = async (productId) => {
    const updatedData = {
      sizes: selectedSize[productId],
      colors: selectedColor[productId],
    };

    try {
      await axios.put(
        `http://localhost:3002/api/contact/updateproduct/${productId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSnackbar({
        open: true,
        message: "Product updated",
        severity: "success",
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to update product:", err.response?.data || err);
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    }
  };

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  if (view === "stock") {
    return (
      <StockManagement initialMode={stockMode} onBack={() => setView("list")} />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Product List
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiSelect-icon": { color: "#fff" },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder="Product No"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            backgroundColor: "#333",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { border: "none" },
            },
            "& .MuiInputBase-input::placeholder": { color: "#999" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#999" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={() => {
            setStockMode("in");
            setView("stock");
          }}
          sx={{
            backgroundColor: "#009688",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            "&:hover": { backgroundColor: "#00796b" },
          }}
        >
          Stock - IN Management
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            setStockMode("out");
            setView("stock");
          }}
          sx={{
            backgroundColor: "#f44336",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            "&:hover": { backgroundColor: "#d32f2f" },
          }}
        >
          Stock - Out Management
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleToggle}
          sx={{
            backgroundColor: "#ff4444",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            "&:hover": { backgroundColor: "#cc3333" },
          }}
        >
          Add Products
        </Button>
      </Box>

      {showAddProduct && <AddProduct />}

      <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
        {filtered.map((product) => (
          <Card
            key={product._id}
            sx={{
              display: "flex",
              mb: 2,
              backgroundColor: "#2a2a2a",
              borderRadius: 2,
              border: "none",
              boxShadow: "none",
            }}
          >
            <CardMedia
              component="img"
              image={
                product.image && product.image.startsWith("data:image/")
                  ? product.image
                  : "https://via.placeholder.com/150"
              }
              sx={{
                width: 150,
                height: 150,
                objectFit: "contain",
                backgroundColor: "#333",
                borderRadius: "8px 0 0 8px",
              }}
              alt={product.productName || "Product Image"}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150";
                console.warn(`Failed to load image for ${product.productName}`);
              }}
            />

            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  mb: 1,
                  textTransform: "uppercase",
                }}
              >
                {product.productName || "RIDING HELMET"}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: "#fff", mb: 1 }}>
                  Size
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={
                        selectedSize[product._id] === size
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleSizeSelect(product._id, size)}
                      sx={{
                        minWidth: 40,
                        height: 32,
                        backgroundColor:
                          selectedSize[product._id] === size
                            ? "#555"
                            : "transparent",
                        color: "#fff",
                        borderColor: "#555",
                        borderRadius: 1,
                        fontSize: "0.75rem",
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

              <Box>
                <Typography variant="body2" sx={{ color: "#fff", mb: 1 }}>
                  Color
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {colors.map((color) => (
                    <Button
                      key={color}
                      variant={
                        selectedColor[product._id] === color
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleColorSelect(product._id, color)}
                      sx={{
                        minWidth: 60,
                        height: 32,
                        backgroundColor:
                          selectedColor[product._id] === color
                            ? "#555"
                            : "transparent",
                        color: "#fff",
                        borderColor: "#555",
                        borderRadius: 1,
                        fontSize: "0.75rem",
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
                  <IconButton
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#555",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#666" },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                gap: 1,
                minWidth: 200,
              }}
            >
              <IconButton
                onClick={() =>
                  navigate(`/editproduct/${product._id}`, {
                    state: { product },
                  })
                }
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  mb: 1,
                  "&:hover": { backgroundColor: "#444" },
                }}
              >
                <EditIcon />
              </IconButton>

              <Typography
                variant="body2"
                sx={{ color: "#999", textAlign: "center" }}
              >
                Selected Size: {selectedSize[product._id] || "XL"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#999", textAlign: "center" }}
              >
                Selected Color: {selectedColor[product._id] || "black"}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Button
                  size="small"
                  onClick={() => updateStock(product._id, "in")}
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    fontSize: "0.7rem",
                    minWidth: 60,
                    height: 28,
                    "&:hover": { backgroundColor: "#444" },
                  }}
                >
                  stock in
                </Button>
                <Button
                  size="small"
                  onClick={() => updateStock(product._id, "out")}
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    fontSize: "0.7rem",
                    minWidth: 60,
                    height: 28,
                    "&:hover": { backgroundColor: "#444" },
                  }}
                >
                  stock out
                </Button>
              </Box>

              <Button
                variant="contained"
                onClick={() => handleSubmitUpdate(product._id)}
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  fontWeight: "bold",
                  textTransform: "none",
                  mt: 1,
                  minWidth: 80,
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                submit
              </Button>
            </Box>
          </Card>
        ))}
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

export default ProductList;
