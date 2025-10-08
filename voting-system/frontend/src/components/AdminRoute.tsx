// src/components/AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Button, Card } from 'react-bootstrap';

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  if (loading) {
    return (
      <div 
        className="d-flex flex-column justify-content-center align-items-center" 
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
      >
        <div className="text-center">
          <div 
            className="spinner-border text-navy mb-3" 
            role="status"
            style={{ width: '4rem', height: '4rem', borderWidth: '0.4rem' }}
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h5 className="text-navy fw-bold">Verificando permisos...</h5>
          <p className="text-muted">Un momento por favor</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no es admin, mostrar página de acceso denegado
  if (!isAdmin) {
    return (
      <div 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem' }}
      >
        <Card className="border-0 shadow-lg text-center" style={{ maxWidth: '600px' }}>
          <Card.Body className="p-5">
            {/* Ícono de acceso denegado */}
            <div 
              className="d-flex align-items-center justify-content-center bg-danger text-white rounded-circle mx-auto mb-4 shadow"
              style={{ width: '100px', height: '100px' }}
            >
              <i className="bi bi-shield-x" style={{ fontSize: '3.5rem' }}></i>
            </div>

            {/* Título y mensaje */}
            <h2 className="text-navy fw-bold mb-3">Acceso Denegado</h2>
            <p className="text-muted fs-5 mb-4">
              Lo sentimos, <strong>{user?.nombreCompleto}</strong>. 
              No tienes permisos de administrador para acceder a esta sección.
            </p>

            {/* Información adicional */}
            <Alert variant="warning" className="text-start mb-4">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-info-circle-fill fs-5 mt-1"></i>
                <div>
                  <strong className="d-block mb-2">¿Necesitas acceso de administrador?</strong>
                  <small className="d-block text-muted">
                    Si crees que deberías tener acceso a esta área, contacta al administrador del sistema 
                    o al departamento de IT del Colegio de Ingenieros.
                  </small>
                </div>
              </div>
            </Alert>

            {/* Botones de acción */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Button 
                variant="navy" 
                size="lg"
                onClick={() => window.history.back()}
                className="px-4 fw-bold"
              >
                <i className="bi bi-arrow-left-circle-fill me-2"></i>
                Volver Atrás
              </Button>
              <Button 
                variant="outline-navy" 
                size="lg"
                onClick={() => window.location.href = '/'}
                className="px-4 fw-bold"
              >
                <i className="bi bi-house-fill me-2"></i>
                Ir al Inicio
              </Button>
            </div>

            {/* Footer con información del usuario */}
            <div className="mt-4 pt-4 border-top">
              <small className="text-muted d-block">
                <i className="bi bi-person-badge me-1"></i>
                Usuario actual: <strong className="text-navy">{user?.numeroColegiado}</strong>
              </small>
              <small className="text-muted d-block mt-1">
                <i className="bi bi-shield-check me-1"></i>
                Rol: <strong className="text-navy">Usuario Regular</strong>
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return children;
};

export default AdminRoute;