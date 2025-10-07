// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CampaignDetail from './pages/CampaignDetail';
import MyVotes from './pages/MyVotes';
import AdminDashboard from './pages/AdminDashboard';
import './styles/main.scss';
import AdminRoute from './components/AdminRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100">
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/campaign/:id"
              element={
                <PrivateRoute>
                  <CampaignDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-votes"
              element={
                <PrivateRoute>
                  <MyVotes />
                </PrivateRoute>
              }
            />
            
            {/* Rutas de administrador */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;