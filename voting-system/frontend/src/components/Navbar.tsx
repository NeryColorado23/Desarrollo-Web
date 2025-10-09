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
    <>
      <style>
        {`
          .nav-dropdown-custom .dropdown-menu {
            right: 0 !important;
            left: auto !important;
            min-width: 350px !important;
            margin-top: 0.5rem !important;
          }
          
          .nav-dropdown-custom .dropdown-toggle {
            background-color: #6c757d !important;
            border: none !important;
            border-radius: 0.375rem !important;
            padding: 10px 20px !important;
            transition: all 0.3s !important;
          }
          
          .nav-dropdown-custom .dropdown-toggle:hover,
          .nav-dropdown-custom .dropdown-toggle:focus,
          .nav-dropdown-custom.show .dropdown-toggle {
            background-color: #5a6268 !important;
          }
          
          .nav-dropdown-custom .dropdown-toggle::after {
            display: none !important;
          }
          
          @media (max-width: 991px) {
            .nav-dropdown-custom .dropdown-menu {
              right: auto !important;
              left: 0 !important;
            }
          }
        `}
      </style>
      
      <BSNavbar expand="lg" className="navbar-custom shadow-sm" sticky="top">
        <Container fluid style={{ maxWidth: '1600px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
          {/* Logo y nombre */}
          <BSNavbar.Brand 
            as={Link} 
            to="/" 
            className="d-flex align-items-center"
            style={{ textDecoration: 'none' }}
          >
            <i className="bi bi-box-seam-fill me-2" style={{ fontSize: '1.8rem' }}></i>
            <span className="fw-bold" style={{ fontSize: '1.3rem' }}>Votación CIG</span>
          </BSNavbar.Brand>
          
          <BSNavbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </BSNavbar.Toggle>
          
          <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-lg-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/login"
                    className="rounded fw-semibold"
                    style={{ 
                      textDecoration: 'none',
                      padding: '12px 30px',
                      fontSize: '1.05rem',
                      backgroundColor: '#5DADE2',
                      color: '#FFFFFF',
                      transition: 'all 0.3s',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3498DB';
                      e.currentTarget.style.borderColor = '#2874A6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#5DADE2';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/register" 
                    className="btn btn-yellow fw-bold shadow-sm"
                    style={{ 
                      padding: '12px 30px',
                      fontSize: '1.05rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      display: 'inline-block',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#F39C12';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Registrarse
                  </Nav.Link>
                </>
              ) : (
                <>
                  {/* Links de navegación con estilo de botón */}
                  <Nav.Link 
                    as={Link} 
                    to="/"
                    className="rounded fw-semibold d-flex align-items-center"
                    style={{ 
                      textDecoration: 'none',
                      padding: '12px 25px',
                      fontSize: '1.05rem',
                      backgroundColor: '#5DADE2',
                      color: '#FFFFFF',
                      transition: 'all 0.3s',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3498DB';
                      e.currentTarget.style.borderColor = '#2874A6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#5DADE2';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <i className="bi bi-house-fill me-2" style={{ fontSize: '1.1rem' }}></i>
                    Campañas
                  </Nav.Link>
                  
                  {isAdmin && (
                    <Nav.Link 
                      as={Link} 
                      to="/admin"
                      className="rounded fw-semibold d-flex align-items-center"
                      style={{ 
                        textDecoration: 'none',
                        padding: '12px 25px',
                        fontSize: '1.05rem',
                        backgroundColor: '#5DADE2',
                        color: '#FFFFFF',
                        transition: 'all 0.3s',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#3498DB';
                        e.currentTarget.style.borderColor = '#2874A6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#5DADE2';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <i className="bi bi-speedometer2 me-2" style={{ fontSize: '1.1rem' }}></i>
                      Panel Admin
                      <Badge bg="warning" text="dark" className="ms-2" style={{ fontSize: '0.85rem', padding: '5px 10px' }}>Admin</Badge>
                    </Nav.Link>
                  )}
                  
                  <Nav.Link 
                    as={Link} 
                    to="/my-votes"
                    className="rounded fw-semibold d-flex align-items-center"
                    style={{ 
                      textDecoration: 'none',
                      padding: '12px 25px',
                      fontSize: '1.05rem',
                      backgroundColor: '#5DADE2',
                      color: '#FFFFFF',
                      transition: 'all 0.3s',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3498DB';
                      e.currentTarget.style.borderColor = '#2874A6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#5DADE2';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '1.1rem' }}></i>
                    Mis Votos
                  </Nav.Link>
                  
                  {/* Dropdown de usuario mejorado */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <NavDropdown
                      title={
                        <span className="d-flex align-items-center">
                          <span 
                            className="badge bg-yellow text-navy me-2 d-flex align-items-center justify-content-center fw-bold shadow-sm"
                            style={{
                              width: '45px',
                              height: '45px',
                              borderRadius: '50%',
                              fontSize: '1.1rem',
                              border: '3px solid #003366'
                            }}
                          >
                            {getInitials(user?.nombreCompleto || '')}
                          </span>
                          <span className="d-none d-lg-inline fw-semibold" style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>
                            {user?.nombreCompleto}
                          </span>
                        </span>
                      }
                      id="user-dropdown"
                      align="end"
                      className="nav-dropdown-custom"
                    >
                      {/* Header del dropdown */}
                      <div className="px-5 py-4 bg-navy border-bottom" style={{ minWidth: '350px' }}>
                        <div className="fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>
                          {user?.nombreCompleto}
                        </div>
                        <div className="d-block mt-3" style={{ fontSize: '1rem', color: '#E0E0E0' }}>
                          <i className="bi bi-envelope-fill me-2"></i>
                          {user?.correoElectronico}
                        </div>
                        <div className="d-block mt-3" style={{ fontSize: '1rem', color: '#E0E0E0' }}>
                          <i className="bi bi-card-text me-2"></i>
                          Colegiado: {user?.numeroColegiado}
                        </div>
                      </div>
                      
                      <NavDropdown.Divider />
                      
                      {/* Botón de cerrar sesión */}
                      <NavDropdown.Item 
                        onClick={handleLogout}
                        className="d-flex align-items-center py-3"
                        style={{ 
                          fontSize: '1.1rem',
                          color: '#dc3545',
                          fontWeight: '600',
                          backgroundColor: 'transparent',
                          transition: 'all 0.3s',
                          paddingLeft: '2.5rem',
                          paddingRight: '2.5rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffe5e5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-3" style={{ fontSize: '1.4rem' }}></i>
                        <span className="fw-bold">Cerrar Sesión</span>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </div>
                </>
              )}
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </>
  );
};

export default Navbar;