import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';

const ParticipantList = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/contact/ParticipantRegistration');
      console.log('Fetched registrations:', response.data);
      setRegistrations(response.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const handleEdit = (id) => {
    console.log('Edit clicked for ID:', id);
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
        Form - Data
      </Typography>
      <Table sx={{ mt: 2, color: '#fff' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#fff' }}>S.No</TableCell>
            <TableCell sx={{ color: '#fff' }}>Name</TableCell>
            <TableCell sx={{ color: '#fff' }}>Email</TableCell>
            <TableCell sx={{ color: '#fff' }}>Phone</TableCell>
            <TableCell sx={{ color: '#fff' }}>Gender</TableCell>
            <TableCell sx={{ color: '#fff' }}>Blood Group</TableCell>
            <TableCell sx={{ color: '#fff' }}>License</TableCell>
            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {registrations.map((reg, index) => (
            <TableRow key={reg._id}>
              <TableCell sx={{ color: '#fff' }}>{index + 1}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{reg.fullName}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{reg.email}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{reg.phoneNumber}</TableCell>
              <TableCell sx={{ color: '#fff' }}>
                {reg.gender === 0 ? 'Male' : reg.gender === 1 ? 'Female' : 'Other'}
              </TableCell>
              <TableCell sx={{ color: '#fff' }}>{reg.bloodGroup}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{reg.licenseNumber}</TableCell>
              <TableCell sx={{ color: '#fff' }}>
                <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(reg._id)}>
                  Edit
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDelete(reg._id)}>
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

export default ParticipantList;