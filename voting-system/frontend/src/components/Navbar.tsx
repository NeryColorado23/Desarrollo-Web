// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <BSNavbar expand="lg" className="navbar-custom shadow-sm" sticky="top">
      <Container>
        {/* Logo y nombre */}
        <BSNavbar.Brand 
          as={Link} 
          to="/" 
          className="d-flex align-items-center"
          style={{ textDecoration: 'none' }}
        >
          <i className="bi bi-box-seam-fill me-2 fs-4"></i>
          <span className="fw-bold">Votación CIG</span>
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </BSNavbar.Toggle>
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-2">
            {!isAuthenticated ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  className="px-3 py-2 rounded"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register" 
                  className="btn btn-yellow ms-lg-2 fw-bold"
                  style={{ 
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Registrarse
                </Nav.Link>
              </>
            ) : (
              <>
                {/* Links de navegación */}
                <Nav.Link 
                  as={Link} 
                  to="/"
                  className="px-3 py-2 rounded d-flex align-items-center"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="bi bi-house-fill me-2"></i>
                  Campañas
                </Nav.Link>
                
                {isAdmin && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin"
                    className="px-3 py-2 rounded d-flex align-items-center"
                    style={{ textDecoration: 'none' }}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    Panel Admin
                    <Badge bg="warning" text="dark" className="ms-2">Admin</Badge>
                  </Nav.Link>
                )}
                
                <Nav.Link 
                  as={Link} 
                  to="/my-votes"
                  className="px-3 py-2 rounded d-flex align-items-center"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Mis Votos
                </Nav.Link>
                
                {/* Dropdown de usuario */}
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <span 
                        className="badge bg-yellow text-navy me-2 d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          fontSize: '0.9rem'
                        }}
                      >
                        {getInitials(user?.nombreCompleto || '')}
                      </span>
                      <span className="d-none d-lg-inline fw-semibold">
                        {user?.nombreCompleto}
                      </span>
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                  className="nav-dropdown-custom"
                >
                  {/* Header del dropdown */}
                  <div className="px-3 py-2 bg-light border-bottom">
                    <div className="fw-bold text-navy">{user?.nombreCompleto}</div>
                    <small className="text-muted d-block">
                      <i className="bi bi-envelope-fill me-1"></i>
                      {user?.correoElectronico}
                    </small>
                    <small className="text-muted d-block mt-1">
                      <i className="bi bi-card-text me-1"></i>
                      Colegiado: {user?.numeroColegiado}
                    </small>
                  </div>
                  
                  <NavDropdown.Divider />
                  
                  {/* Botón de cerrar sesión */}
                  <NavDropdown.Item 
                    onClick={handleLogout}
                    className="text-danger d-flex align-items-center py-2"
                  >
                    <i className="bi bi-box-arrow-right me-2 fs-5"></i>
                    <span className="fw-semibold">Cerrar Sesión</span>
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;