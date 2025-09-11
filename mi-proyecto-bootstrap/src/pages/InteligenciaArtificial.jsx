import React from 'react'
import { Link } from 'react-router-dom'

function InteligenciaArtificial() {
  const clases = [
    {
      semana: 1,
      tema: "Introducción a la IA y Búsqueda en Grafos",
      descripcion: "Fundamentos de la inteligencia artificial y algoritmos de búsqueda no informada.",
      algoritmos: ["Búsqueda en amplitud (BFS)", "Búsqueda en profundidad (DFS)", "Búsqueda de costo uniforme"],
      complejidad: "O(b^d)"
    },
    {
      semana: 2,
      tema: "Algoritmos Genéticos y Evolución",
      descripcion: "Introducción a los algoritmos evolutivos y optimización basada en selección natural.",
      algoritmos: ["Selección", "Cruce (Crossover)", "Mutación", "Elitismo"],
      complejidad: "O(g * p * f)"
    },
    {
      semana: 3,
      tema: "Introducción a Redes Neuronales",
      descripcion: "Fundamentos de las redes neuronales artificiales y el perceptrón.",
      algoritmos: ["Perceptrón simple", "Backpropagation", "Gradiente descendente"],
      complejidad: "O(n * m * e)"
    },
    {
      semana: 4,
      tema: "Búsqueda Heurística y A*",
      descripcion: "Algoritmos de búsqueda informada utilizando funciones heurísticas.",
      algoritmos: ["A* (A estrella)", "Búsqueda greedy", "Hill climbing"],
      complejidad: "O(b^d)"
    },
    {
      semana: 5,
      tema: "Machine Learning y Clasificación",
      descripcion: "Introducción al aprendizaje automático y algoritmos de clasificación básicos.",
      algoritmos: ["K-Nearest Neighbors", "Árboles de decisión", "Naive Bayes"],
      complejidad: "O(n * k)"
    }
  ]

  const aplicaciones = [
    { area: "Visión por Computadora", ejemplos: ["Reconocimiento facial", "Detección de objetos", "OCR"], dificultad: "Alta" },
    { area: "Procesamiento de Lenguaje Natural", ejemplos: ["Chatbots", "Traducción automática", "Análisis de sentimientos"], dificultad: "Alta" },
    { area: "Sistemas de Recomendación", ejemplos: ["Netflix", "Amazon", "Spotify"], dificultad: "Media" },
    { area: "Juegos y Entretenimiento", ejemplos: ["Ajedrez", "Go", "Videojuegos"], dificultad: "Media" },
    { area: "Robótica", ejemplos: ["Navegación autónoma", "Manipulación de objetos", "Drones"], dificultad: "Alta" },
    { area: "Finanzas", ejemplos: ["Trading algorítmico", "Detección de fraude", "Credit scoring"], dificultad: "Media" }
  ]

  const herramientasIA = [
    { nombre: "Python", tipo: "Lenguaje", uso: "Desarrollo principal", popularidad: 95 },
    { nombre: "TensorFlow", tipo: "Framework", uso: "Deep Learning", popularidad: 85 },
    { nombre: "PyTorch", tipo: "Framework", uso: "Investigación en IA", popularidad: 80 },
    { nombre: "Scikit-learn", tipo: "Biblioteca", uso: "Machine Learning clásico", popularidad: 90 },
    { nombre: "OpenCV", tipo: "Biblioteca", uso: "Visión por computadora", popularidad: 75 },
    { nombre: "NLTK", tipo: "Biblioteca", uso: "Procesamiento de lenguaje", popularidad: 70 }
  ]

  return (
    <div className="container my-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active">Inteligencia Artificial</li>
        </ol>
      </nav>

      {/* Header del curso */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-cpu display-4 text-primary me-3"></i>
            <div>
              <h1 className="display-5 fw-bold">Inteligencia Artificial</h1>
              <p className="lead text-muted">Algoritmos y conceptos fundamentales de la IA</p>
            </div>
          </div>
          <p className="fs-5">
            Introducción a algoritmos y conceptos fundamentales de la inteligencia artificial, 
            incluyendo búsqueda, optimización, aprendizaje automático y redes neuronales.
          </p>
        </div>
        <div className="col-lg-4">
          <div className="card bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body text-white">
              <h5 className="card-title">Información del Curso</h5>
              <ul className="list-unstyled">
                <li><strong>Duración:</strong> 5 semanas</li>
                <li><strong>Modalidad:</strong> Teórico-Práctica</li>
                <li><strong>Prerrequisitos:</strong> Programación, Matemáticas</li>
                <li><strong>Nivel:</strong> Intermedio-Avanzado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Áreas de aplicación */}
      <div className="mb-5">
        <h3 className="mb-4">
          <i className="bi bi-lightbulb text-warning me-2"></i>
          Áreas de Aplicación de la IA
        </h3>
        <div className="row">
          {aplicaciones.map((app, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title d-flex justify-content-between">
                    {app.area}
                    <span className={`badge ${
                      app.dificultad === 'Alta' ? 'bg-danger' : 
                      app.dificultad === 'Media' ? 'bg-warning' : 'bg-success'
                    }`}>
                      {app.dificultad}
                    </span>
                  </h6>
                  <ul className="list-unstyled">
                    {app.ejemplos.map((ejemplo, idx) => (
                      <li key={idx} className="small mb-1">
                        <i className="bi bi-dot text-primary"></i>
                        {ejemplo}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algoritmos principales usando ListGroup */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h3 className="mb-3">
            <i className="bi bi-diagram-2 text-success me-2"></i>
            Algoritmos Fundamentales
          </h3>
          <div className="list-group">
            <div className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">Búsqueda no informada</h6>
                <small className="text-primary">Semana 1</small>
              </div>
              <p className="mb-1">Algoritmos que no utilizan información específica del problema</p>
              <small>BFS, DFS, Costo uniforme - Complejidad exponencial</small>
            </div>
            <div className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">Algoritmos genéticos</h6>
                <small className="text-success">Semana 2</small>
              </div>
              <p className="mb-1">Optimización inspirada en la evolución natural</p>
              <small>Selección, cruce, mutación - Metaheurística poblacional</small>
            </div>
            <div className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">Redes neuronales básicas</h6>
                <small className="text-warning">Semana 3</small>
              </div>
              <p className="mb-1">Modelos inspirados en el cerebro humano</p>
              <small>Perceptrón, backpropagation - Aprendizaje supervisado</small>
            </div>
            <div className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">Búsqueda heurística</h6>
                <small className="text-info">Semana 4</small>
              </div>
              <p className="mb-1">Búsqueda informada con funciones heurísticas</p>
              <small>A*, Greedy, Hill climbing - Optimización dirigida</small>
            </div>
            <div className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">Machine Learning</h6>
                <small className="text-danger">Semana 5</small>
              </div>
              <p className="mb-1">Algoritmos de aprendizaje automático</p>
              <small>KNN, Árboles de decisión, Naive Bayes - Clasificación</small>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h3 className="mb-3">
            <i className="bi bi-tools text-info me-2"></i>
            Herramientas y Tecnologías
          </h3>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Herramienta</th>
                  <th>Tipo</th>
                  <th>Popularidad</th>
                </tr>
              </thead>
              <tbody>
                {herramientasIA.map((herramienta, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{herramienta.nombre}</strong>
                      <br />
                      <small className="text-muted">{herramienta.uso}</small>
                    </td>
                    <td>
                      <span className={`badge ${
                        herramienta.tipo === 'Lenguaje' ? 'bg-primary' :
                        herramienta.tipo === 'Framework' ? 'bg-success' : 'bg-info'
                      }`}>
                        {herramienta.tipo}
                      </span>
                    </td>
                    <td>
                      <div className="progress" style={{height: '20px'}}>
                        <div 
                          className="progress-bar bg-gradient" 
                          style={{width: `${herramienta.popularidad}%`}}
                        >
                          {herramienta.popularidad}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cronograma detallado usando Accordion */}
      <div className="mb-5">
        <h3 className="mb-3">
          <i className="bi bi-calendar-event text-primary me-2"></i>
          Cronograma Detallado de Clases
        </h3>
        <div className="accordion" id="cronogramaAccordion">
          {clases.map((clase, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#semana${index}`}
                  aria-expanded={index === 0 ? 'true' : 'false'}
                >
                  <div className="d-flex align-items-center">
                    <span className="badge bg-primary me-3">Semana {clase.semana}</span>
                    <div>
                      <strong>{clase.tema}</strong>
                      <br />
                      <small className="text-muted">Complejidad: {clase.complejidad}</small>
                    </div>
                  </div>
                </button>
              </h2>
              <div 
                id={`semana${index}`} 
                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                data-bs-parent="#cronogramaAccordion"
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-md-8">
                      <p className="mb-3">{clase.descripcion}</p>
                      <h6>Algoritmos a estudiar:</h6>
                      <div className="row">
                        {clase.algoritmos.map((algoritmo, idx) => (
                          <div key={idx} className="col-md-6 mb-2">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              <span>{algoritmo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Complejidad Temporal</h6>
                          <p className="card-text">
                            <code className="bg-dark text-light p-1 rounded">{clase.complejidad}</code>
                          </p>
                          <small className="text-muted">
                            Donde: b=factor de ramificación, d=profundidad, 
                            g=generaciones, p=población, n=datos, k=vecinos
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de evaluaciones */}
      <div className="mb-5">
        <h3 className="mb-3">
          <i className="bi bi-clipboard-check text-success me-2"></i>
          Sistema de Evaluación
        </h3>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-success">
              <tr>
                <th>Semana</th>
                <th>Tipo de Evaluación</th>
                <th>Contenido</th>
                <th>Peso</th>
                <th>Modalidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">1-2</td>
                <td><span className="badge bg-info">Laboratorio</span></td>
                <td>Implementación de algoritmos de búsqueda</td>
                <td>20%</td>
                <td>Individual</td>
              </tr>
              <tr>
                <td className="text-center">3</td>
                <td><span className="badge bg-warning">Examen Parcial</span></td>
                <td>Búsqueda y algoritmos genéticos</td>
                <td>25%</td>
                <td>Presencial</td>
              </tr>
              <tr>
                <td className="text-center">4</td>
                <td><span className="badge bg-info">Proyecto</span></td>
                <td>Red neuronal básica</td>
                <td>25%</td>
                <td>Equipos de 2</td>
              </tr>
              <tr>
                <td className="text-center">5</td>
                <td><span className="badge bg-danger">Examen Final</span></td>
                <td>Todos los temas del curso</td>
                <td>30%</td>
                <td>Presencial</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recursos adicionales */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-book me-2"></i>
                Bibliografía Recomendada
              </h5>
            </div>
            <div className="list-group list-group-flush">
              <div className="list-group-item">
                <h6 className="mb-1">Artificial Intelligence: A Modern Approach</h6>
                <p className="mb-1">Stuart Russell & Peter Norvig</p>
                <small className="text-muted">4ta Edición - Libro principal del curso</small>
              </div>
              <div className="list-group-item">
                <h6 className="mb-1">Pattern Recognition and Machine Learning</h6>
                <p className="mb-1">Christopher Bishop</p>
                <small className="text-muted">Para temas de ML avanzado</small>
              </div>
              <div className="list-group-item">
                <h6 className="mb-1">The Elements of Statistical Learning</h6>
                <p className="mb-1">Hastie, Tibshirani & Friedman</p>
                <small className="text-muted">Referencia matemática avanzada</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-warning">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Conceptos Clave a Dominar
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Comprensión de algoritmos</label>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{width: '85%'}}>85%</div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Implementación práctica</label>
                <div className="progress">
                  <div className="progress-bar bg-info" style={{width: '70%'}}>70%</div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Análisis de complejidad</label>
                <div className="progress">
                  <div className="progress-bar bg-warning" style={{width: '75%'}}>75%</div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Aplicación práctica</label>
                <div className="progress">
                  <div className="progress-bar bg-danger" style={{width: '80%'}}>80%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="d-flex justify-content-between">
        <Link to="/redes-computadoras" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Curso Anterior
        </Link>
        <Link to="/seguridad-informatica" className="btn btn-primary">
          Siguiente Curso
          <i className="bi bi-arrow-right ms-2"></i>
        </Link>
      </div>
    </div>
  )
}

export default InteligenciaArtificial