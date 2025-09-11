import React from 'react'
import CourseCard from '../components/CourseCard'

function Home() {
  const courses = [
    {
      title: "Desarrollo Web",
      description: "Fundamentos para construir sitios web usando HTML, CSS y JavaScript.",
      icon: "bi bi-code-slash",
      link: "/desarrollo-web",
      topics: ["HTML básico", "Estilos con CSS", "Interactividad con JavaScript"]
    },
    {
      title: "Redes de Computadoras",
      description: "Estudio de la comunicación entre dispositivos y protocolos de red.",
      icon: "bi bi-diagram-3",
      link: "/redes-computadoras",
      topics: ["Modelo OSI", "Direcciones IP", "Configuración de redes"]
    },
    {
      title: "Inteligencia Artificial",
      description: "Introducción a algoritmos y conceptos fundamentales de la IA.",
      icon: "bi bi-cpu",
      link: "/inteligencia-artificial",
      topics: ["Búsqueda no informada", "Algoritmos genéticos", "Redes neuronales básicas"]
    },
    {
      title: "Seguridad Informática",
      description: "Conocimientos esenciales para proteger sistemas y redes.",
      icon: "bi bi-shield-check",
      link: "/seguridad-informatica",
      topics: ["Tipos de amenazas", "Criptografía básica", "Buenas prácticas de seguridad"]
    }
  ]

  return (
    <div>
      {/* Carrusel Hero */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="bg-primary text-white py-5">
              <div className="container text-center">
                <h1 className="display-4 fw-bold">Cursos Finales - Ingeniería en Sistemas</h1>
                <p className="lead">Explora los conocimientos esenciales de la carrera</p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="bg-success text-white py-5">
              <div className="container text-center">
                <h2 className="display-5 fw-bold">Tecnologías Modernas</h2>
                <p className="lead">Aprende las herramientas más utilizadas en la industria</p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="bg-info text-white py-5">
              <div className="container text-center">
                <h2 className="display-5 fw-bold">Preparación Profesional</h2>
                <p className="lead">Desarrolla habilidades para tu futuro profesional</p>
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="container my-5">
        {/* Sección de Introducción */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="display-6 fw-bold mb-3">Sobre Este Sitio</h2>
            <p className="lead text-muted">
              Este sitio muestra información detallada sobre los cursos finales de la carrera de 
              Ingeniería en Sistemas. Cada curso incluye contenido relevante, temas clave y 
              recursos de aprendizaje.
            </p>
          </div>
        </div>

        {/* Lista de Cursos */}
        <div className="mb-5">
          <h2 className="text-center mb-4">Lista de Cursos Disponibles</h2>
          <div className="row">
            {courses.map((course, index) => (
              <CourseCard 
                key={index}
                title={course.title}
                description={course.description}
                icon={course.icon}
                link={course.link}
                topics={course.topics}
              />
            ))}
          </div>
        </div>

        {/* Sección adicional con estadísticas */}
        <div className="row text-center mb-5">
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body">
                <i className="bi bi-book display-5 text-primary mb-3"></i>
                <h4>4</h4>
                <p className="text-muted">Cursos Disponibles</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body">
                <i className="bi bi-clock display-5 text-success mb-3"></i>
                <h4>12</h4>
                <p className="text-muted">Semanas de Contenido</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body">
                <i className="bi bi-trophy display-5 text-warning mb-3"></i>
                <h4>100%</h4>
                <p className="text-muted">Contenido Práctico</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body">
                <i className="bi bi-gear display-5 text-info mb-3"></i>
                <h4>React</h4>
                <p className="text-muted">Tecnología Moderna</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home