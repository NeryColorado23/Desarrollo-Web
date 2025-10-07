// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <BSNavbar expand="lg" className="navbar-custom" sticky="top">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Votación CIG
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-yellow ms-2">
                  Registrarse
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">
                  Campañas
                </Nav.Link>
                
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin">
                    Panel Admin
                  </Nav.Link>
                )}
                
                <Nav.Link as={Link} to="/my-votes">
                  Mis Votos
                </Nav.Link>
                
                <NavDropdown
                  title={
                    <span>
                      <span className="badge bg-yellow text-navy me-2">
                        {getInitials(user?.nombreCompleto || '')}
                      </span>
                      {user?.nombreCompleto}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item disabled>
                    <small className="text-muted">{user?.correoElectronico}</small>
                  </NavDropdown.Item>
                  <NavDropdown.Item disabled>
                    <small className="text-muted">
                      Colegiado: {user?.numeroColegiado}
                    </small>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
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