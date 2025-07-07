import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import ParticipantList from "./ParticipantList"; // ✅ Ensure path is correct

const genders = [
  { label: "Male", value: 0 },
  { label: "Female", value: 1 },
  { label: "Other", value: 2 },
];

const emptyForm = {
  fullName: "",
  gender: 0,
  bloodGroup: "",
  licenseNumber: "",
  dateOfBirth: "",
  instagramID: "",
  address: "",
  email: "",
  phoneNumber: "",
};

const textFieldSx = {
  input: { color: "#000" },
  "& .MuiInputBase-input::placeholder": { color: "#000", opacity: 0.5 },
};

const ParticipantRegistration = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showList, setShowList] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawToken = localStorage.getItem("token");
    const headers =
      rawToken && rawToken !== "null" && rawToken !== "undefined"
        ? { Authorization: `Bearer ${rawToken}` }
        : {};

    try {
      await axios.post(
        "http://localhost:3002/api/contact/ParticipantRegistration",
        formData,
        { headers }
      );
      setSnackbar({
        open: true,
        message: "Participant registered successfully",
        severity: "success",
      });
      setFormData(emptyForm);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Registration failed",
        severity: "error",
      });
    }
  };

  const handleToggleList = () => {
    setShowList(true);
  };

  if (showList) {
    return <ParticipantList />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Participant Registration
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} columns={12}>
            <Grid xs={12} md={6}>
              <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required sx={textFieldSx} />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField select fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleChange} sx={textFieldSx}>
                {genders.map((g) => (
                  <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField fullWidth label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required sx={textFieldSx} />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField fullWidth label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required sx={textFieldSx} />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField type="date" fullWidth label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} InputLabelProps={{ shrink: true }} required sx={textFieldSx} />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField fullWidth label="Instagram ID" name="instagramID" value={formData.instagramID} onChange={handleChange} sx={textFieldSx} />
            </Grid>
            <Grid xs={12}>
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required sx={textFieldSx} />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField fullWidth type="email" label="Email" name="email" value={formData.email} onChange={handleChange} required sx={textFieldSx} />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required sx={textFieldSx} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={handleToggleList}
            >
              Show List
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ParticipantRegistration;
