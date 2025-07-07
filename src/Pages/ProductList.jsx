import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditProduct from "../Pages/EditProduct";

const categories = ["All", "Shoes", "Clothing", "Accessories"];

const DarkContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#1a1a1a",
  minHeight: "100vh",
  padding: theme.spacing(3),
  color: "white",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  color: "white",
  borderRadius: "8px",
  minWidth: "120px",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2d2d2d",
    borderRadius: "8px",
    color: "white",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
    padding: "12px 16px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#999",
    opacity: 1,
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  color: "#ff6b35",
  borderRadius: "8px",
  padding: "12px",
  "&:hover": {
    backgroundColor: "#3d3d3d",
  },
}));

const StockButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  color: "white",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 400,
  padding: "8px 24px",
  "&:hover": {
    backgroundColor: "#3d3d3d",
  },
}));

const AddProductButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#e53e3e",
  color: "white",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  padding: "12px 24px",
  "&:hover": {
    backgroundColor: "#c33434",
  },
}));

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [productNo, setProductNo] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3002/api/contact/AddProduct",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesProductNo = product.productNo
        .toString()
        .includes(productNo);
      return matchesCategory && matchesProductNo;
    });
    setFilteredProducts(filtered);
  };

  const handleEditClick = (productId) => {
    setEditProductId(productId);
    setShowEdit(true);
  };

  if (showEdit) {
    return (
      <EditProduct
        id={editProductId}
        onClose={() => {
          setShowEdit(false);
          fetchProducts();
        }}
      />
    );
  }

  return (
    <DarkContainer>
      <Box display="flex" gap={2} alignItems="center" mb={3} flexWrap="wrap">
        <FormControl>
          <StyledSelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
          >
            {categories.map((cat) => (
              <MenuItem
                key={cat}
                value={cat}
                sx={{ backgroundColor: "#2d2d2d", color: "white" }}
              >
                {cat}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>

        <StyledTextField
          placeholder="Product No"
          value={productNo}
          onChange={(e) => setProductNo(e.target.value)}
          size="small"
        />

        <SearchButton onClick={handleSearch}>
          <SearchIcon />
        </SearchButton>

        <StockButton>Stock - IN</StockButton>
        <StockButton>Stock - Out</StockButton>

        <AddProductButton
          startIcon={<AddIcon />}
          onClick={() => navigate("/addproduct")}
        >
          Add Products
        </AddProductButton>
      </Box>

      <Grid container spacing={3} maxWidth="md" margin="auto">
        {filteredProducts.map((product) => (
          <Grid item xs={12} key={product._id}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              sx={{ backgroundColor: "#1a1a1a", borderRadius: 2 }}
            >
              <Box display="flex" gap={2}>
                <img
                  src={product.image}
                  alt={product.productName}
                  style={{
                    width: 150,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <Box>
                  <Typography variant="h6">
                    {product.productName.toUpperCase()}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Size:{" "}
                    {Array.isArray(product.sizes)
                      ? product.sizes.join(", ")
                      : product.sizes}
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>
                    Color:{" "}
                    {Array.isArray(product.colors)
                      ? product.colors.join(", ")
                      : product.colors}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
                onClick={() => handleEditClick(product._id)}
              >
                Edit
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </DarkContainer>
  );
};

export default ProductList;
