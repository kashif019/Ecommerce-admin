import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Delete, Create, CloudUpload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#3a3a3a',
            '& fieldset': {
              borderColor: '#555',
            },
            '&:hover fieldset': {
              borderColor: '#777',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff0000',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#b0b0b0',
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#ff0000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#cc0000',
          },
        },
      },
    },
  },
});

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    sizes: '',
    productNo: '',
    stockQuantity: '',
    inStock: '',
    colors: 'Red,White,Blue',
    description: 'Lorem Ipsum Dolor Sit Amet Consectetur. Morbi Massa Sed Pretium Ultrices. Aliquam Volutpat Viverra Tristique Tellus Fusce Amet. Commodo Porttitor Risus Tellus Ipsum Arcu Mus. Ullamcorper Orci Eget Aliquet Ornare. Dui Tellus Faucibus Sapien Non Non Tempor Massa Mattis.',
  });
  const [image, setImage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
      setSnackbar({
        open: true,
        message: 'Image uploaded successfully',
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Image size exceeds 5MB limit',
        severity: 'error',
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.productName ||
      !formData.category ||
      !formData.price ||
      !formData.sizes ||
      !formData.productNo ||
      !formData.stockQuantity ||
      !formData.inStock ||
      !formData.colors ||
      !image
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields, including an image.',
        severity: 'error',
      });
      return;
    }

    // Validate numeric fields
    const numericFields = {
      price: Number(formData.price),
      productNo: Number(formData.productNo),
      inStock: Number(formData.inStock),
      stockQuantity: Number(formData.stockQuantity),
    };

    if (
      Object.values(numericFields).some((value) => isNaN(value) || value < 0)
    ) {
      setSnackbar({
        open: true,
        message: 'Price, Product No, In Stock, and Stock Quantity must be valid positive numbers.',
        severity: 'error',
      });
      return;
    }

    const product = {
      ...formData,
      ...numericFields,
      image,
    };

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      console.log('Payload:', product);
      const res = await axios.post(
        'http://localhost:3002/api/contact/addproduct',
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        setSnackbar({
          open: true,
          message: 'Product created successfully! Add another?',
          severity: 'success',
        });
        setFormData({
          productName: '',
          category: '',
          price: '',
          sizes: '',
          productNo: '',
          stockQuantity: '',
          inStock: '',
          colors: 'Red,White,Blue',
          description: formData.description,
        });
        setImage(null);
      }
    } catch (error) {
      console.error('Failed to create product:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      setSnackbar({
        open: true,
        message: error.response?.data?.message || `Failed to create product: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
            Add New Product
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#ff0000',
              '&:hover': { backgroundColor: '#cc0000' },
              textTransform: 'none',
              px: 3,
              py: 1,
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Product Info Section */}
        <Paper sx={{ p: 3, backgroundColor: '#2d2d2d', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', letterSpacing: '0.1em' }}>
              PRODUCT INFO
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Delete />}
                onClick={() => {
                  setFormData({
                    productName: '',
                    category: '',
                    price: '',
                    sizes: '',
                    productNo: '',
                    stockQuantity: '',
                    inStock: '',
                    colors: 'Red,White,Blue',
                    description: formData.description,
                  });
                  setImage(null);
                  setSnackbar({
                    open: true,
                    message: 'Form cleared',
                    severity: 'info',
                  });
                }}
                sx={{
                  backgroundColor: '#ff0000',
                  '&:hover': { backgroundColor: '#cc0000' },
                  textTransform: 'none',
                }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                startIcon={<Create />}
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#ff0000',
                  '&:hover': { backgroundColor: '#cc0000' },
                  textTransform: 'none',
                }}
              >
                Create
              </Button>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* First Row */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Product Name"
                  value={formData.productName}
                  onChange={handleInputChange('productName')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange('category')}
                  variant="outlined"
                />
              </Grid>

              {/* Second Row */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange('price')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Sizes"
                  value={formData.sizes}
                  onChange={handleInputChange('sizes')}
                  variant="outlined"
                />
              </Grid>

              {/* Third Row */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Product No"
                  value={formData.productNo}
                  onChange={handleInputChange('productNo')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Stock Quantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange('stockQuantity')}
                  variant="outlined"
                />
              </Grid>

              {/* Fourth Row */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="In Stock"
                  value={formData.inStock}
                  onChange={handleInputChange('inStock')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Colors : Red,White,Blue"
                  value={formData.colors}
                  onChange={handleInputChange('colors')}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* Image Upload and Description */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card
                  {...getRootProps()}
                  sx={{
                    backgroundColor: '#3a3a3a',
                    border: '2px dashed #555',
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#404040',
                      borderColor: '#777',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    {image ? (
                      <Box>
                        <img
                          src={image}
                          alt="Product preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '150px',
                            objectFit: 'contain',
                            marginBottom: '8px',
                          }}
                        />
                        <Typography variant="body1" sx={{ color: '#888' }}>
                          Click or drop to replace image
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <CloudUpload sx={{ fontSize: 48, color: '#888', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: '#888' }}>
                          Drag & drop or click to upload main image
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ backgroundColor: '#3a3a3a', p: 2, borderRadius: 1, minHeight: 200 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'transparent',
                        border: 'none',
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default AddProduct;