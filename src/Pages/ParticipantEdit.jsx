import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const genders = [
  { label: "Male", value: 0 },
  { label: "Female", value: 1 },
  { label: "Other", value: 2 },
];

const ParticipantEdit = ({ id: propId, onClose }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  const [msg, setMsg] = useState({ open: false, text: "", sev: "success" });

  const [form, setForm] = useState({
    fullName: "",
    gender: 0,
    bloodGroup: "",
    licenseNumber: "",
    dateOfBirth: "",
    instagramID: "",
    address: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:3002/api/contact/ParticipantRegistration/${id}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        setForm({
          ...data,
          gender: Number(data.gender),
          dateOfBirth: data.dateOfBirth?.slice(0, 10) || "",
        });
      } catch (err) {
        setMsg({
          open: true,
          text: err.response?.data?.message || "Load failed",
          sev: "error",
        });
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "gender" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        dateOfBirth: form.dateOfBirth
          ? new Date(`${form.dateOfBirth}T00:00:00Z`).toISOString()
          : null,
      };
      await axios.put(
        `http://localhost:3002/api/contact/ParticipantRegistration/${id}`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setMsg({ open: true, text: "Updated!", sev: "success" });
      setTimeout(() => {
        if (onClose) onClose();
        else navigate("/participants");
      }, 600);
    } catch (err) {
      setMsg({
        open: true,
        text: err.response?.data?.message || "Update failed",
        sev: "error",
      });
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else navigate("/participants");
  };

  const textFieldSx = {
    input: { color: "#fff" },
    "& .MuiInputLabel-root": { color: "#ccc" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#ccc" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#fff" },
    },
    "& .MuiInputBase-input::placeholder": { color: "#fff", opacity: 0.7 },
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#000", color: "#fff", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Edit Participant
      </Typography>

      <Grid container spacing={2} columns={12}>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            name="fullName"
            label="Full Name"
            value={form.fullName}
            onChange={handleChange}
            sx={textFieldSx}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            select
            fullWidth
            name="gender"
            label="Gender"
            value={form.gender}
            onChange={handleChange}
            sx={{
              ...textFieldSx,
              "& .MuiSelect-select": {
                color: "#fff", // ensures selected item is visible
              },
            }}
          >
            {genders.map((g) => (
              <MenuItem
                key={g.value}
                value={g.value}
                sx={{ color: "#fff", backgroundColor: "#2d2d2d" }}
              >
                {g.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            name="bloodGroup"
            label="Blood Group"
            value={form.bloodGroup}
            onChange={handleChange}
            sx={textFieldSx}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            name="licenseNumber"
            label="License Number"
            value={form.licenseNumber}
            onChange={handleChange}
            sx={textFieldSx}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            type="date"
            fullWidth
            name="dateOfBirth"
            label="Date Of Birth"
            InputLabelProps={{ shrink: true }}
            value={form.dateOfBirth}
            onChange={handleChange}
            sx={textFieldSx}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            name="instagramID"
            label="Instagram ID"
            value={form.instagramID}
            onChange={handleChange}
            sx={textFieldSx}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            fullWidth
            name="address"
            label="Address"
            value={form.address}
            onChange={handleChange}
            sx={textFieldSx}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            sx={textFieldSx}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            name="phoneNumber"
            label="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            sx={textFieldSx}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#fff" }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>

      <Snackbar
        open={msg.open}
        autoHideDuration={3000}
        onClose={() => setMsg({ ...msg, open: false })}
      >
        <Alert severity={msg.sev} sx={{ width: "100%" }}>
          {msg.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParticipantEdit;
