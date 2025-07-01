// src/Pages/AuthRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Pages/Login';
import CreateAccount from '../Pages/CreateAccount';
import ForgotPassword from '../Pages/ForgotPassword';

const AuthRoutes = ({ onLogin }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AuthRoutes;
