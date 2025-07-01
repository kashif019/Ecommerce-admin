import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';

const ParticipantRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    bloodGroup: '',
    licenseNumber: '',
    dateOfBirth: '',
    instagramID: '',
    address: '',
    email: '',
    phoneNumber: ''
  });
  const [registrations, setRegistrations] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch all registrations on component mount
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/contact/ParticipantRegistration');
      setRegistrations(response.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing registration
        await axios.put(`http://localhost:3002/api/contact/ParticipantRegistration/${editId}`, formData);
        setEditId(null);
      } else {
        // Create new registration
        await axios.post('http://localhost:3002/api/contact/ParticipantRegistration', formData);
      }
      setFormData({
        fullName: '',
        gender: '',
        bloodGroup: '',
        licenseNumber: '',
        dateOfBirth: '',
        instagramID: '',
        address: '',
        email: '',
        phoneNumber: ''
      });
      fetchRegistrations();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleEdit = (id) => {
    const registrationToEdit = registrations.find(reg => reg._id === id);
    setFormData(registrationToEdit);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/contact/ParticipantRegistration/${id}`);
      fetchRegistrations();
    } catch (err) {
      console.error('Error deleting registration:', err);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Participant Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <FormControl fullWidth variant="outlined" margin="normal" sx={{ bgcolor: '#1e1e1e' }}>
          <InputLabel sx={{ color: '#fff' }}>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Gender"
            sx={{ color: '#fff' }}
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="0">Male</MenuItem>
            <MenuItem value="1">Female</MenuItem>
            <MenuItem value="2">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Blood Group"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          label="License Number"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          label="Instagram ID"
          name="instagramID"
          value={formData.instagramID}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {editId ? 'Update' : 'Submit'}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={() => {
              setFormData({
                fullName: '',
                gender: '',
                bloodGroup: '',
                licenseNumber: '',
                dateOfBirth: '',
                instagramID: '',
                address: '',
                email: '',
                phoneNumber: ''
              });
              setEditId(null);
            }}
          >
            Reset
          </Button>
        </Box>
      </form>

      {/* Display Registrations Table */}
      <Typography variant="h5" sx={{ mt: 4 }}>Registered Participants</Typography>
      <Table sx={{ mt: 2, color: '#fff' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#fff' }}>Full Name</TableCell>
            <TableCell sx={{ color: '#fff' }}>Gender</TableCell>
            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {registrations.map((reg) => (
            <TableRow key={reg._id}>
              <TableCell sx={{ color: '#fff' }}>{reg.fullName}</TableCell>
              <TableCell sx={{ color: '#fff' }}>
                {reg.gender === 0 ? 'Male' : reg.gender === 1 ? 'Female' : 'Other'}
              </TableCell>
              <TableCell sx={{ color: '#fff' }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(reg._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(reg._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ParticipantRegistration;