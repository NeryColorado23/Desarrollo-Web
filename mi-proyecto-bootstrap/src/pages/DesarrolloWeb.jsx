import React from 'react'
import { Link } from 'react-router-dom'

function DesarrolloWeb() {
  const clases = [
    {
      semana: 1,
      tema: "Introducción a HTML",
      descripcion: "Fundamentos del lenguaje de marcado HTML, estructura básica y elementos principales.",
      objetivos: ["Conocer la estructura HTML", "Crear documentos web básicos", "Usar etiquetas semánticas"]
    },
    {
      semana: 2,
      tema: "CSS Básico y Estilos",
      descripcion: "Aplicación de estilos visuales usando CSS, selectores y propiedades básicas.",
      objetivos: ["Aplicar estilos básicos", "Usar selectores CSS", "Crear layouts simples"]
    },
    {
      semana: 3,
      tema: "JavaScript para Principiantes",
      descripcion: "Introducción a la programación web del lado cliente con JavaScript.",
      objetivos: ["Manipular el DOM", "Manejar eventos", "Crear interactividad básica"]
    },
    {
      semana: 4,
      tema: "Responsive Design y Bootstrap",
      descripcion: "Diseño adaptativo para diferentes dispositivos usando CSS Grid, Flexbox y Bootstrap.",
      objetivos: ["Crear diseños responsivos", "Usar Bootstrap framework", "Optimizar para móviles"]
    },
    {
      semana: 5,
      tema: "JavaScript Avanzado y APIs",
      descripcion: "Conceptos avanzados de JavaScript, AJAX, Fetch API y manipulación de datos.",
      objetivos: ["Consumir APIs REST", "Manejar asincronía", "Trabajar con JSON"]
    }
  ]

  const herramientas = [
    { nombre: "Visual Studio Code", tipo: "Editor de código", uso: "Desarrollo principal" },
    { nombre: "Chrome DevTools", tipo: "Herramienta de depuración", uso: "Debug y testing" },
    { nombre: "Git", tipo: "Control de versiones", uso: "Gestión de código" },
    { nombre: "Node.js", tipo: "Runtime de JavaScript", uso: "Servidor de desarrollo" },
    { nombre: "Bootstrap", tipo: "Framework CSS", uso: "Diseño responsive" }
  ]

  return (
    <div className="container my-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active">Desarrollo Web</li>
        </ol>
      </nav>

      {/* Header del curso */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-code-slash display-4 text-primary me-3"></i>
            <div>
              <h1 className="display-5 fw-bold">Desarrollo Web</h1>
              <p className="lead text-muted">Fundamentos para construir sitios web modernos</p>
            </div>
          </div>
          <p className="fs-5">
            Este curso enseña los fundamentos para construir sitios web usando HTML, CSS y JavaScript.
            Los estudiantes aprenderán a crear interfaces de usuario interactivas y responsive.
          </p>
        </div>
        <div className="col-lg-4">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">Información del Curso</h5>
              <ul className="list-unstyled">
                <li><strong>Duración:</strong> 5 semanas</li>
                <li><strong>Modalidad:</strong> Presencial</li>
                <li><strong>Prerrequisitos:</strong> Ninguno</li>
                <li><strong>Nivel:</strong> Principiante</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Puntos Clave usando ListGroup */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h2 className="h4 mb-3">
            <i className="bi bi-check-circle text-success me-2"></i>
            Puntos Clave del Curso
          </h2>
          <div className="list-group">
            <div className="list-group-item">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">HTML Básico</h6>
                <small className="text-success">Fundamental</small>
              </div>
              <p className="mb-1">Estructura y semántica de documentos web</p>
              <small>Etiquetas, atributos y mejores prácticas</small>
            </div>
            <div className="list-group-item">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">Estilos con CSS</h6>
                <small className="text-primary">Intermedio</small>
              </div>
              <p className="mb-1">Diseño visual y layout responsivo</p>
              <small>Selectores, flexbox, grid y animaciones</small>
            </div>
            <div className="list-group-item">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">Interactividad con JavaScript</h6>
                <small className="text-warning">Avanzado</small>
              </div>
              <p className="mb-1">Programación del lado cliente</p>
              <small>DOM, eventos, APIs y funciones asíncronas</small>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="h4 mb-3">
            <i className="bi bi-tools text-primary me-2"></i>
            Herramientas y Tecnologías
          </h2>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Herramienta</th>
                  <th>Tipo</th>
                  <th>Uso</th>
                </tr>
              </thead>
              <tbody>
                {herramientas.map((herramienta, index) => (
                  <tr key={index}>
                    <td><strong>{herramienta.nombre}</strong></td>
                    <td><span className="badge bg-secondary">{herramienta.tipo}</span></td>
                    <td>{herramienta.uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Temario detallado usando Accordion */}
      <div className="mb-5">
        <h2 className="h4 mb-3">
          <i className="bi bi-journal-text text-info me-2"></i>
          Temario Detallado por Clase
        </h2>
        <div className="accordion" id="temarioAccordion">
          {clases.map((clase, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#collapse${index}`}
                  aria-expanded={index === 0 ? 'true' : 'false'}
                >
                  <span className="badge bg-primary me-2">Semana {clase.semana}</span>
                  {clase.tema}
                </button>
              </h2>
              <div 
                id={`collapse${index}`} 
                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                data-bs-parent="#temarioAccordion"
              >
                <div className="accordion-body">
                  <p className="mb-3">{clase.descripcion}</p>
                  <h6>Objetivos de Aprendizaje:</h6>
                  <ul className="list-unstyled">
                    {clase.objetivos.map((objetivo, idx) => (
                      <li key={idx} className="mb-1">
                        <i className="bi bi-arrow-right text-success me-2"></i>
                        {objetivo}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla resumen de clases */}
      <div className="mb-5">
        <h2 className="h4 mb-3">
          <i className="bi bi-calendar-week text-warning me-2"></i>
          Cronograma de Clases
        </h2>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th scope="col">Semana</th>
                <th scope="col">Tema Principal</th>
                <th scope="col">Duración</th>
                <th scope="col">Tipo de Clase</th>
                <th scope="col">Entregables</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((clase, index) => (
                <tr key={index}>
                  <th scope="row">{clase.semana}</th>
                  <td>{clase.tema}</td>
                  <td>4 horas</td>
                  <td>
                    <span className={`badge ${index < 2 ? 'bg-success' : index < 4 ? 'bg-warning' : 'bg-danger'}`}>
                      {index < 2 ? 'Teórica' : index < 4 ? 'Práctica' : 'Proyecto'}
                    </span>
                  </td>
                  <td>
                    {index === 0 && "Estructura HTML básica"}
                    {index === 1 && "Página con estilos CSS"}
                    {index === 2 && "Interactividad con JS"}
                    {index === 3 && "Sitio responsive"}
                    {index === 4 && "Proyecto final completo"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navegación */}
      <div className="d-flex justify-content-between">
        <Link to="/" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Volver al Inicio
        </Link>
        <Link to="/redes-computadoras" className="btn btn-primary">
          Siguiente Curso
          <i className="bi bi-arrow-right ms-2"></i>
        </Link>
      </div>
    </div>
  )
}

export default DesarrolloWeb