import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import ParticipantEdit from "../Pages/ParticipantEdit";

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [showEdit, setShowEdit] = useState(false);
  const [editParticipantId, setEditParticipantId] = useState(null);
  const location = useLocation();

  const fetchParticipants = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3002/api/contact/ParticipantRegistration",
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setParticipants(res.data);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch participants";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants, location.key]);

  const handleEdit = (id) => {
    if (!id) {
      setSnackbar({ open: true, message: "Invalid participant ID", severity: "warning" });
      return;
    }
    setEditParticipantId(id);
    setShowEdit(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      setSnackbar({ open: true, message: "Invalid participant ID", severity: "warning" });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3002/api/contact/ParticipantRegistration/${id}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setSnackbar({ open: true, message: "Deleted successfully", severity: "success" });
      fetchParticipants();
    } catch (err) {
      const msg = err.response?.data?.message || "Delete failed";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  if (showEdit) {
    return (
      <ParticipantEdit
        id={editParticipantId}
        onClose={() => {
          setShowEdit(false);
          fetchParticipants();
        }}
      />
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#000", color: "#fff", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Participants</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary">Save Changes</Button>
          <Button variant="outlined" sx={{ color: "#fff", borderColor: "#888" }}>Cancel</Button>
        </Box>
      </Box>

      <Paper sx={{ overflow: "auto", bgcolor: "#111" }}>
        <Table>
          <TableHead>
            <TableRow>
              {["S.NO","Name","Email","Phone","Gender","Blood Group","License","Actions"].map((h) => (
                <TableCell key={h} sx={{ color: "#fff" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((p, idx) => (
              <TableRow key={p._id}>
                <TableCell sx={{ color: "#fff" }}>{idx + 1}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{p.fullName}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{p.email}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{p.phoneNumber}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{["Male","Female","Other"][p.gender]}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{p.bloodGroup}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{p.licenseNumber}</TableCell>
                <TableCell>
                  <Button variant="contained" size="small" sx={{ mr: 1 }} onClick={() => handleEdit(p._id)}>Edit</Button>
                  <Button variant="outlined" size="small" sx={{ mr: 1, color: "#fff", borderColor: "#fff" }}>Clear</Button>
                  <Button variant="contained" color="error" size="small" onClick={() => handleDelete(p._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ParticipantList;
