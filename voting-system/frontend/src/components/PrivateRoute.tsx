// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div 
        className="d-flex flex-column justify-content-center align-items-center" 
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
      >
        <div className="text-center">
          {/* Spinner animado */}
          <div 
            className="spinner-border text-navy mb-4" 
            role="status"
            style={{ width: '4rem', height: '4rem', borderWidth: '0.4rem' }}
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
          
          {/* Logo o ícono */}
          <div className="mb-3">
            <i className="bi bi-box-seam-fill text-navy" style={{ fontSize: '3rem' }}></i>
          </div>
          
          {/* Texto de carga */}
          <h5 className="text-navy fw-bold mb-2">Votación CIG</h5>
          <p className="text-muted mb-0">Verificando sesión...</p>
          
          {/* Animación de puntos */}
          <div className="mt-3">
            <span className="text-muted">
              Cargando
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;