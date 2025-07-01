import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import Header from '../Components/Header'; // Adjust path as needed
import Sidebar from '../Components/Sidebar'; // Adjust path as needed

const SIDEBAR_WIDTH = 80;
const HEADER_HEIGHT = 34;

const StockManagement = ({ initialMode = 'in', onBack }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [mode, setMode] = useState(initialMode); // 'in' or 'out'
  const [selectedProducts, setSelectedProducts] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3002/api/contact/getaddproduct', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(res.data);
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(res.data.map((product) => product.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch products',
          severity: 'error',
        });
      }
    };
    fetchProducts();
  }, []);

  // Handle stock update
  const handleStockUpdate = async (productId, action) => {
    try {
      const res = await axios.patch(
        `http://localhost:3002/api/contact/updatestock/${productId}?action=${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? { ...product, inStock: res.data.inStock, stockQuantity: res.data.stockQuantity }
            : product
        )
      );
      setSnackbar({
        open: true,
        message: `Stock ${action === 'in' ? 'increased' : 'decreased'}`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to update stock:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Stock update failed',
        severity: 'error',
      });
    }
  };

  // Handle product quantity selection (placeholder for now)
  const handleProductSelect = (productId, quantity) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  // Filter products by mode and category
  const filteredProducts = products
    .filter((product) => (mode === 'in' ? product.inStock > 0 : product.inStock === 0))
    .filter((product) => category === 'All' || product.category === category);

  // Calculate totals for footer
  const totalCurrentStock = filteredProducts.reduce((sum, product) => sum + (product.inStock || 0), 0);
  const totalUnitsToAdd = Object.values(selectedProducts).reduce((sum, qty) => sum + (qty || 0), 0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#2a2a2a',
            color: '#fff',
            border: 'none',
          },
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          mr: { xs: 0, md: '80px' }, // Added right margin to match sidebar width
          backgroundColor: '#1a1a1a',
          color: '#fff',
        }}
      >
        {/* Header */}
        <Header
          handleDrawerToggle={handleDrawerToggle}
          onLogout={handleLogout}
          sx={{
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #333',
          }}
        />

        {/* Stock Management Content */}
        <Box
          component="main"
          sx={{
            pt: `${HEADER_HEIGHT + 16}px`,
            flexGrow: 1,
          }}
        >
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}
              >
                Stock Management
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#666', fontSize: '0.9rem' }}
              >
                (stock in - stock out)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant={mode === 'in' ? 'contained' : 'outlined'}
                onClick={() => setMode('in')}
                sx={{
                  backgroundColor: mode === 'in' ? '#009688' : '#333',
                  color: '#fff',
                  borderColor: '#555',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: mode === 'in' ? '#00796b' : '#444',
                    borderColor: '#777',
                  },
                }}
              >
                Stock In
              </Button>
              <Button
                variant={mode === 'out' ? 'contained' : 'outlined'}
                onClick={() => setMode('out')}
                sx={{
                  backgroundColor: mode === 'out' ? '#f44336' : '#333',
                  color: '#fff',
                  borderColor: '#555',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: mode === 'out' ? '#d32f2f' : '#444',
                    borderColor: '#777',
                  },
                }}
              >
                Stock Out
              </Button>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: '#999' }}>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: 2,
                    '& .MuiSvgIcon-root': { color: '#fff' },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {categories.filter((cat) => cat !== 'All').map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={onBack}
                sx={{
                  backgroundColor: '#555',
                  color: '#fff',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#666' },
                }}
              >
                Back to Product List
              </Button>
            </Box>
          </Box>

          {/* Products List */}
          <Box sx={{ backgroundColor: '#2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
            {filteredProducts.length === 0 ? (
              <Typography
                variant="body1"
                sx={{ color: '#999', width: '100%', textAlign: 'center', p: 2 }}
              >
                No products {mode === 'in' ? 'with stock available' : 'out of stock'}.
              </Typography>
            ) : (
              filteredProducts.map((product, index) => (
                <Box
                  key={product._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: index < filteredProducts.length - 1 ? '1px solid #333' : 'none',
                    '&:hover': { backgroundColor: '#333' },
                  }}
                >
                  {/* Index */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#666',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {index + 1}
                    </Typography>
                  </Box>

                  {/* Product Image */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: '#f0f0f0',
                      borderRadius: 1,
                      mr: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={product.image || 'https://via.placeholder.com/80'}
                      alt={product.productName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>

                  {/* Product Info */}
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ minWidth: 120 }}>
                      <Typography sx={{ color: '#999', fontSize: '0.8rem', mb: 0.5 }}>
                        Product No
                      </Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {product.productNo || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography sx={{ color: '#999', fontSize: '0.8rem', mb: 0.5 }}>
                        Product Name
                      </Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {product.productName || 'Product Name'}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                      <Typography sx={{ color: '#999', fontSize: '0.8rem', mb: 0.5 }}>
                        Current Stock
                      </Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {product.inStock || 0}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Add Stock Button */}
                  <Button
                    variant="outlined"
                    sx={{
                      color: '#fff',
                      borderColor: '#555',
                      backgroundColor: '#333',
                      minWidth: 100,
                      '&:hover': {
                        backgroundColor: '#444',
                        borderColor: '#777',
                      },
                    }}
                    onClick={() => handleStockUpdate(product._id, mode)}
                  >
                    {mode === 'in' ? 'Add Stock +' : 'Remove Stock -'}
                  </Button>
                </Box>
              ))
            )}
          </Box>

          {/* Footer Summary */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 3,
              p: 2,
              backgroundColor: '#2a2a2a',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>
                  Total Current Stock
                </Typography>
                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {totalCurrentStock}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>
                  Total Units to Add
                </Typography>
                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {totalUnitsToAdd}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff4444',
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                '&:hover': { backgroundColor: '#cc3333' },
              }}
            >
              Update Stock
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default StockManagement;