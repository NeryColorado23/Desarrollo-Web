import React from 'react'

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Tarea No. 2</h5>
            <p className="mb-2">
              Pagina web que creamos usando React y Boostrap
            </p>
            <p className="mb-0">
              <small className="text-muted">© 2025 - Todos los derechos reservados</small>
            </p>
          </div>
          <div className="col-md-6">
            <h5>Derechos reservados UMG Naranjo</h5>
            <div className="d-flex flex-column">
              <span className="mb-1">
                <i className="bi bi-person-fill me-2"></i>
                <strong>Nery Colorado</strong>  9490-22-4867
              </span>
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