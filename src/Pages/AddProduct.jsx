// src/Pages/AddProduct.jsx
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Typography,
  MenuItem,
  Container,
  Paper,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from "@mui/material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

/* ───────── Styled helpers ───────── */
const DarkContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "#1a1a1a",
  minHeight: "100vh",
  padding: theme.spacing(3),
  color: "white",
}));

const StyledTextField = styled(TextField)(() => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2d2d2d",
    borderRadius: 8,
    "& fieldset": { border: "1px solid #555" },
    "&:hover fieldset": { border: "1px solid #777" },
    "&.Mui-focused fieldset": { border: "1px solid #999" },
  },
  "& .MuiInputBase-input": {
    color: "#fff",
    padding: "16px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#fff",
    opacity: 0.7,
  },
  "& .MuiInputLabel-root": { color: "#ccc" },
}));

const StyledSelect = styled(Select)(() => ({
  width: "100%",
  backgroundColor: "#2d2d2d",
  borderRadius: 8,
  color: "#fff",
  "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #555" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#777" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
}));

const UploadArea = styled(Paper)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  border: "2px dashed #666",
  borderRadius: 8,
  padding: theme.spacing(6),
  textAlign: "center",
  color: "#999",
  cursor: "pointer",
  minHeight: 250,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": { borderColor: "#888" },
}));

/* ───────── Constants ───────── */
const categories   = ["Shoes", "Clothing", "Accessories"];
const sizesList    = ["XS", "S", "M", "L", "XL", "XXL"];
const colorsList   = ["Red", "White", "Blue", "Green", "Black", "Yellow"];

const initialState = {
  productName: "",
  price: "",
  productNo: "",
  inStock: "",
  category: "",
  sizes: [],
  stockQuantity: "",
  colors: [],
  description: "",
  image: "",
};

/* ───────── Component ───────── */
const AddProduct = () => {
  const [form,      setForm]      = useState(initialState);
  const [preview,   setPreview]   = useState("");
  const [snackbar,  setSnackbar]  = useState({ open: false, message: "", type: "success" });
  const [loading,   setLoading]   = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setForm((p) => ({ ...p, image: base64 }));
      setPreview(base64);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { "image/*": [] },
  });

  const handleImageAreaClick = () => open();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSelectChange = (field) => (event) => {
    setForm((p) => ({ ...p, [field]: event.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const sanitizedForm = {
        ...form,
        price: Number(form.price),
        productNo: Number(form.productNo),
        inStock: Number(form.inStock),
        stockQuantity: Number(form.stockQuantity),
      };

      await axios.post("http://localhost:3002/api/contact/AddProduct", sanitizedForm, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setSnackbar({ open: true, message: "Product added successfully", type: "success" });
      setForm(initialState);
      setPreview("");
    } catch {
      setSnackbar({ open: true, message: "Failed to create product. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DarkContainer maxWidth={false}>
      <Box component="form" onSubmit={handleSubmit}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight={300} letterSpacing={2}>
            Add New Product
          </Typography>
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            Add Product
          </Button>
        </Box>

        <Paper sx={{ backgroundColor: "#2d2d2d", borderRadius: 2, p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h2" fontWeight={300} letterSpacing={3} color="white">
              PRODUCT INFO
            </Typography>
            <Box display="flex" gap={2}>
              <Button variant="contained" color="error" disabled={loading}>Delete</Button>
              <Button type="button" variant="contained" color="error" onClick={handleSubmit} disabled={loading}>
                Create
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3} columns={12}>
            <Grid xs={12} md={6}><StyledTextField placeholder="Product Name" name="productName" value={form.productName} onChange={handleChange} /></Grid>
            <Grid xs={12} md={6}><StyledTextField placeholder="Category"     name="category"    value={form.category}    onChange={handleChange} /></Grid>

            <Grid xs={12} md={6}><StyledTextField placeholder="Price"        name="price"       value={form.price}       onChange={handleChange} /></Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color:"#ccc" }}>Sizes</InputLabel>
                <StyledSelect multiple value={form.sizes} onChange={handleSelectChange("sizes")} input={<OutlinedInput label="Sizes"/>}
                  renderValue={(selected) => (
                    <Box sx={{ display:"flex", flexWrap:"wrap", gap:0.5 }}>
                      {selected.map((v) => (<Chip key={v} label={v}/>))}
                    </Box>
                  )}>
                  {sizesList.map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
                </StyledSelect>
              </FormControl>
            </Grid>

            <Grid xs={12} md={6}><StyledTextField placeholder="Product No"     name="productNo"     value={form.productNo}     onChange={handleChange} /></Grid>
            <Grid xs={12} md={6}><StyledTextField placeholder="Stock Quantity" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} /></Grid>

            <Grid xs={12} md={6}><StyledTextField placeholder="In Stock"       name="inStock"       value={form.inStock}       onChange={handleChange} /></Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color:"#ccc" }}>Colors</InputLabel>
                <StyledSelect multiple value={form.colors} onChange={handleSelectChange("colors")} input={<OutlinedInput label="Colors"/>}
                  renderValue={(selected) => (
                    <Box sx={{ display:"flex", flexWrap:"wrap", gap:0.5 }}>
                      {selected.map((v) => (<Chip key={v} label={v}/>))}
                    </Box>
                  )}>
                  {colorsList.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                </StyledSelect>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3} columns={12}>
          <Grid xs={12} md={6}>
            <UploadArea {...getRootProps()} onClick={handleImageAreaClick}>
              <input {...getInputProps()} />
              {preview ? (
                <img src={preview} alt="Preview" style={{ maxWidth:"100%", maxHeight:300, borderRadius:8 }} />
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize:60, color:"#666", mb:2 }}/>
                  <Typography>Drag &amp; Drop or click to upload image</Typography>
                </>
              )}
            </UploadArea>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="h6" fontWeight={300} mb={2} color="white">
              Description
            </Typography>
            <StyledTextField
              fullWidth multiline rows={8} placeholder="Description"
              name="description" value={form.description} onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open:false })} anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert severity={snackbar.type} variant="filled" sx={{ width:"100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DarkContainer>
  );
};

export default AddProduct;
