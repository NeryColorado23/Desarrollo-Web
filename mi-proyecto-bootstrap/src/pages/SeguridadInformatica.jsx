import React from 'react'
import { Link } from 'react-router-dom'

function SeguridadInformatica() {
  const clases = [
    {
      semana: 1,
      tema: "Fundamentos y Tipos de Amenazas",
      descripcion: "Introducción a la seguridad informática y clasificación de amenazas digitales.",
      amenazas: ["Malware", "Phishing", "SQL Injection", "Cross-Site Scripting (XSS)"],
      laboratorio: "Identificación de vulnerabilidades comunes"
    },
    {
      semana: 2,
      tema: "Criptografía y Cifrado",
      descripcion: "Principios de criptografía, algoritmos de cifrado simétrico y asimétrico.",
      amenazas: ["Cifrado simétrico (AES)", "Cifrado asimétrico (RSA)", "Funciones Hash", "Firma digital"],
      laboratorio: "Implementación de algoritmos de cifrado básicos"
    },
    {
      semana: 3,
      tema: "Firewalls y Sistemas de Detección",
      descripcion: "Configuración de firewalls y sistemas de detección de intrusos (IDS/IPS).",
      amenazas: ["Firewall de red", "Firewall de aplicación", "IDS basado en red", "IPS en tiempo real"],
      laboratorio: "Configuración de iptables y Snort"
    },
    {
      semana: 4,
      tema: "Antivirus y Protección de Endpoints",
      descripcion: "Sistemas antivirus, análisis heurístico y protección de dispositivos finales.",
      amenazas: ["Análisis de firmas", "Detección heurística", "Sandboxing", "Behavioral analysis"],
      laboratorio: "Configuración de antivirus empresarial"
    },
    {
      semana: 5,
      tema: "Auditoría y Buenas Prácticas",
      descripcion: "Auditorías de seguridad, frameworks de cumplimiento y mejores prácticas.",
      amenazas: ["Pentesting básico", "ISO 27001", "NIST Framework", "Políticas de seguridad"],
      laboratorio: "Auditoría de seguridad con herramientas automatizadas"
    }
  ]

  const tiposAmenazas = [
    { categoria: "Malware", ejemplos: ["Virus", "Troyanos", "Ransomware", "Spyware"], riesgo: "Alto", frecuencia: "Muy alta" },
    { categoria: "Ingeniería Social", ejemplos: ["Phishing", "Vishing", "Smishing", "Pretexting"], riesgo: "Alto", frecuencia: "Alta" },
    { categoria: "Ataques de Red", ejemplos: ["DDoS", "Man-in-the-Middle", "DNS Spoofing", "Packet Sniffing"], riesgo: "Medio", frecuencia: "Media" },
    { categoria: "Vulnerabilidades Web", ejemplos: ["SQL Injection", "XSS", "CSRF", "Directory Traversal"], riesgo: "Alto", frecuencia: "Alta" },
    { categoria: "Amenazas Físicas", ejemplos: ["Acceso no autorizado", "Robo de equipos", "Shoulder surfing"], riesgo: "Medio", frecuencia: "Baja" },
    { categoria: "Amenazas Internas", ejemplos: ["Empleados maliciosos", "Negligencia", "Acceso privilegiado"], riesgo: "Alto", frecuencia: "Media" }
  ]

  const herramientasSeguridad = [
    { nombre: "Wireshark", categoria: "Análisis de red", descripcion: "Captura y análisis de tráfico", licencia: "Open Source" },
    { nombre: "Nmap", categoria: "Escaneo de puertos", descripcion: "Descubrimiento de servicios", licencia: "Open Source" },
    { nombre: "Metasploit", categoria: "Pentesting", descripcion: "Framework de explotación", licencia: "Comercial/Free" },
    { nombre: "Burp Suite", categoria: "Seguridad web", descripcion: "Testing de aplicaciones web", licencia: "Comercial/Free" },
    { nombre: "Kali Linux", categoria: "Distribución", descripcion: "SO para auditorías de seguridad", licencia: "Open Source" },
    { nombre: "OWASP ZAP", categoria: "Seguridad web", descripcion: "Proxy de seguridad", licencia: "Open Source" }
  ]

  return (
    <div className="container my-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active">Seguridad Informática</li>
        </ol>
      </nav>

      {/* Header del curso */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-shield-check display-4 text-danger me-3"></i>
            <div>
              <h1 className="display-5 fw-bold text-danger">Seguridad Informática</h1>
              <p className="lead text-muted">Protección integral de sistemas y redes</p>
            </div>
          </div>
          <div className="alert alert-warning" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Importante:</strong> Este curso cubre conocimientos esenciales para proteger sistemas y redes 
            contra amenazas digitales modernas. El contenido incluye técnicas de defensa y contramedidas éticas.
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Información del Curso</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li><strong>Duración:</strong> 5 semanas</li>
                <li><strong>Modalidad:</strong> Teórico-Práctica</li>
                <li><strong>Prerrequisitos:</strong> Redes, Sistemas Operativos</li>
                <li><strong>Nivel:</strong> Intermedio-Avanzado</li>
                <li><strong>Certificación:</strong> Incluida</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de amenazas */}
      <div className="mb-5">
        <h3 className="mb-4">
          <i className="bi bi-bug text-danger me-2"></i>
          Clasificación de Amenazas Digitales
        </h3>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-danger">
              <tr>
                <th>Categoría</th>
                <th>Ejemplos Principales</th>
                <th>Nivel de Riesgo</th>
                <th>Frecuencia</th>
                <th>Contramedidas</th>
              </tr>
            </thead>
            <tbody>
              {tiposAmenazas.map((amenaza, index) => (
                <tr key={index}>
                  <td><strong>{amenaza.categoria}</strong></td>
                  <td>
                    {amenaza.ejemplos.map((ejemplo, idx) => (
                      <span key={idx} className="badge bg-secondary me-1 mb-1">{ejemplo}</span>
                    ))}
                  </td>
                  <td>
                    <span className={`badge ${
                      amenaza.riesgo === 'Alto' ? 'bg-danger' : 
                      amenaza.riesgo === 'Medio' ? 'bg-warning' : 'bg-success'
                    }`}>
                      {amenaza.riesgo}
                    </span>
                  </td>
                  <td>
                    <div className="progress" style={{height: '20px', minWidth: '80px'}}>
                      <div 
                        className={`progress-bar ${
                          amenaza.frecuencia === 'Muy alta' ? 'bg-danger' :
                          amenaza.frecuencia === 'Alta' ? 'bg-warning' : 
                          amenaza.frecuencia === 'Media' ? 'bg-info' : 'bg-success'
                        }`}
                        style={{width: amenaza.frecuencia === 'Muy alta' ? '95%' : 
                                     amenaza.frecuencia === 'Alta' ? '80%' :
                                     amenaza.frecuencia === 'Media' ? '60%' : '30%'}}
                      >
                        {amenaza.frecuencia}
                      </div>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target={`#modal${index}`}>
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cronograma con acordeón */}
      <div className="mb-5">
        <h3 className="mb-3">
          <i className="bi bi-calendar-range text-primary me-2"></i>
          Cronograma Detallado del Curso
        </h3>
        <div className="accordion" id="seguridadAccordion">
          {clases.map((clase, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#seguridad${index}`}
                  aria-expanded={index === 0 ? 'true' : 'false'}
                >
                  <div className="d-flex align-items-center w-100">
                    <span className="badge bg-danger me-3 fs-6">Semana {clase.semana}</span>
                    <div className="flex-grow-1">
                      <strong>{clase.tema}</strong>
                      <br />
                      <small className="text-muted">{clase.laboratorio}</small>
                    </div>
                    <i className="bi bi-shield-exclamation text-warning ms-2"></i>
                  </div>
                </button>
              </h2>
              <div 
                id={`seguridad${index}`} 
                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                data-bs-parent="#seguridadAccordion"
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-md-8">
                      <p className="mb-3">{clase.descripcion}</p>
                      <h6 className="mb-2">Temas principales a cubrir:</h6>
                      <div className="row">
                        {clase.amenazas.map((tema, idx) => (
                          <div key={idx} className="col-md-6 mb-2">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              <span className="small">{tema}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-light border-warning">
                        <div className="card-body">
                          <h6 className="card-title text-warning">
                            <i className="bi bi-gear me-1"></i>
                            Laboratorio Práctico
                          </h6>
                          <p className="card-text small">{clase.laboratorio}</p>
                          <div className="mt-2">
                            <span className="badge bg-info">Hands-on</span>
                            <span className="badge bg-success ms-1">4 horas</span>
                          </div>
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

      {/* Herramientas de seguridad */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h3 className="mb-3">
            <i className="bi bi-tools text-info me-2"></i>
            Herramientas de Seguridad
          </h3>
          <div className="list-group">
            {herramientasSeguridad.map((herramienta, index) => (
              <div key={index} className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1">{herramienta.nombre}</h6>
                  <span className={`badge ${
                    herramienta.licencia === 'Open Source' ? 'bg-success' : 
                    herramienta.licencia === 'Comercial/Free' ? 'bg-warning' : 'bg-danger'
                  }`}>
                    {herramienta.licencia}
                  </span>
                </div>
                <p className="mb-1">{herramienta.descripcion}</p>
                <small className="text-muted">
                  <i className="bi bi-tag me-1"></i>
                  {herramienta.categoria}
                </small>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <h3 className="mb-3">
            <i className="bi bi-diagram-3 text-success me-2"></i>
            Marco de Trabajo de Seguridad
          </h3>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Metodología CIA Triad</h5>
              <div className="mb-3">
                <h6 className="text-primary">
                  <i className="bi bi-lock me-2"></i>
                  Confidencialidad (Confidentiality)
                </h6>
                <div className="progress mb-2">
                  <div className="progress-bar bg-primary" style={{width: '90%'}}>90%</div>
                </div>
                <small className="text-muted">Protección de información contra acceso no autorizado</small>
              </div>
              <div className="mb-3">
                <h6 className="text-success">
                  <i className="bi bi-shield-check me-2"></i>
                  Integridad (Integrity)
                </h6>
                <div className="progress mb-2">
                  <div className="progress-bar bg-success" style={{width: '85%'}}>85%</div>
                </div>
                <small className="text-muted">Garantía de que la información no ha sido alterada</small>
              </div>
              <div className="mb-3">
                <h6 className="text-info">
                  <i className="bi bi-clock me-2"></i>
                  Disponibilidad (Availability)
                </h6>
                <div className="progress mb-2">
                  <div className="progress-bar bg-info" style={{width: '80%'}}>80%</div>
                </div>
                <small className="text-muted">Acceso oportuno y confiable a la información</small>
              </div>
            </div>
          </div>

          <div className="card mt-3 border-warning">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Principios Adicionales
              </h6>
            </div>
            <div className="list-group list-group-flush">
              <div className="list-group-item">
                <strong>Autenticación:</strong> Verificación de identidad
              </div>
              <div className="list-group-item">
                <strong>Autorización:</strong> Control de acceso a recursos
              </div>
              <div className="list-group-item">
                <strong>No repudio:</strong> Imposibilidad de negar acciones
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buenas prácticas */}
      <div className="mb-5">
        <h3 className="mb-3">
          <i className="bi bi-award text-warning me-2"></i>
          Buenas Prácticas de Seguridad
        </h3>
        <div className="row">
          <div className="col-md-4">
            <div className="card h-100 border-success">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">
                  <i className="bi bi-person-check me-2"></i>
                  Para Usuarios
                </h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Contraseñas seguras y únicas
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Autenticación de dos factores
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Actualizar software regularmente
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Verificar enlaces y archivos
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Copias de seguridad frecuentes
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-info">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">
                  <i className="bi bi-gear me-2"></i>
                  Para Administradores
                </h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check2 text-info me-2"></i>
                    Principio de menor privilegio
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-info me-2"></i>
                    Monitoreo de logs continuo
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-info me-2"></i>
                    Segmentación de red
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-info me-2"></i>
                    Auditorías regulares
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-info me-2"></i>
                    Plan de respuesta a incidentes
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-warning">
              <div className="card-header bg-warning text-dark">
                <h6 className="mb-0">
                  <i className="bi bi-building me-2"></i>
                  Para Organizaciones
                </h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check2 text-warning me-2"></i>
                    Políticas de seguridad claras
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-warning me-2"></i>
                    Capacitación del personal
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-warning me-2"></i>
                    Evaluaciones de riesgo
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-warning me-2"></i>
                    Cumplimiento normativo
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-warning me-2"></i>
                    Inversión en tecnología
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluación y certificación */}
      <div className="mb-5">
        <h3 className="mb-3">
          <i className="bi bi-trophy text-success me-2"></i>
          Sistema de Evaluación y Certificación
        </h3>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Componente</th>
                <th>Descripción</th>
                <th>Peso</th>
                <th>Fecha</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Laboratorios</strong></td>
                <td>Ejercicios prácticos semanales</td>
                <td>30%</td>
                <td>Semanal</td>
                <td><span className="badge bg-info">Práctico</span></td>
              </tr>
              <tr>
                <td><strong>Examen Parcial</strong></td>
                <td>Amenazas y criptografía</td>
                <td>25%</td>
                <td>Semana 3</td>
                <td><span className="badge bg-warning">Teórico</span></td>
              </tr>
              <tr>
                <td><strong>Proyecto Final</strong></td>
                <td>Auditoría de seguridad completa</td>
                <td>25%</td>
                <td>Semana 5</td>
                <td><span className="badge bg-success">Proyecto</span></td>
              </tr>
              <tr>
                <td><strong>Examen Final</strong></td>
                <td>Evaluación integral del curso</td>
                <td>20%</td>
                <td>Final</td>
                <td><span className="badge bg-danger">Comprensivo</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="alert alert-info mt-3" role="alert">
          <h6 className="alert-heading">
            <i className="bi bi-info-circle me-2"></i>
            Certificación Profesional
          </h6>
          <p className="mb-0">
            Los estudiantes que completen exitosamente el curso recibirán un certificado de 
            <strong> Fundamentos de Seguridad Informática</strong> reconocido por la industria.
            Se requiere una calificación mínima de 75% para obtener la certificación.
          </p>
        </div>
      </div>

      {/* Navegación */}
      <div className="d-flex justify-content-between">
        <Link to="/inteligencia-artificial" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Curso Anterior
        </Link>
        <Link to="/" className="btn btn-success">
          <i className="bi bi-house me-2"></i>
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}

export default SeguridadInformatica