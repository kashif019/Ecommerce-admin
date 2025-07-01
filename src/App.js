// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './Components/AuthRoutes';
import Landing from './Pages/Landing';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <Route path="/*" element={<AuthRoutes onLogin={handleLogin} />} />
        ) : (
          <Route path="/*" element={<Landing onLogout={handleLogout} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
