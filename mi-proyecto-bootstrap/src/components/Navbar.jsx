import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-mortarboard me-2"></i>
          Ingeniería en Sistemas
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Cursos
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/desarrollo-web">Desarrollo Web</Link></li>
                <li><Link className="dropdown-item" to="/redes-computadoras">Redes de Computadoras</Link></li>
                <li><Link className="dropdown-item" to="/inteligencia-artificial">Inteligencia Artificial</Link></li>
                <li><Link className="dropdown-item" to="/seguridad-informatica">Seguridad Informática</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar