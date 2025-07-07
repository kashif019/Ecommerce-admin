// src/Routes/Landing.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../Components/DashboardLayout';
import EcommerceLayout from '../Components/EcommerceLayout';
import Login from '../Pages/Login';
import CreateAccount from '../Pages/CreateAccount';
import ForgotPassword from '../Pages/ForgotPassword';
import AddProduct from '../Pages/AddProduct';
import EditProduct from '../Pages/EditProduct';
import ProductList from '../Pages/ProductList';
import ParticipantEdit from '../Pages/ParticipantEdit';

const Landing = ({ onLogout }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login onLogin={() => {}} />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard/*" element={<DashboardLayout onLogout={onLogout} />} />
      <Route path="/dashboard/ecommerce/*" element={<EcommerceLayout onLogout={onLogout} />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/editproduct/:id" element={<EditProduct />} />
      <Route path="/productlist" element={<ProductList />} />
      <Route path="/participantedit/:id" element={<ParticipantEdit />} />

    </Routes>
  );
};

export default Landing;
