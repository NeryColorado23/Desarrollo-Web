import React from 'react'

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Información del Proyecto</h5>
            <p className="mb-2">
              Sitio web informativo sobre cursos finales de Ingeniería en Sistemas
            </p>
            <p className="mb-0">
              <small className="text-muted">© 2025 - Todos los derechos reservados</small>
            </p>
          </div>
          <div className="col-md-6">
            <h5>Integrantes del Equipo</h5>
            <div className="d-flex flex-column">
              <span className="mb-1">
                <i className="bi bi-person-fill me-2"></i>
                <strong>Nery Colorado</strong> - Carné: [Tu carné aquí]
              </span>
              {/* Agrega más integrantes si es necesario */}
              {/* 
              <span className="mb-1">
                <i className="bi bi-person-fill me-2"></i>
                <strong>[Nombre]</strong> - Carné: [Carné]
              </span>
              */}
            </div>
          </div>
        </div>
        <hr className="my-3" />
        <div className="text-center">
          <small className="text-muted">
            Desarrollado con React y Bootstrap
          </small>
        </div>
      </div>
    </footer>
  )
}

export default Footer