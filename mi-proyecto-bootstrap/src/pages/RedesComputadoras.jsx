import React from 'react'
import { Link } from 'react-router-dom'

function RedesComputadoras() {
  const clases = [
    {
      semana: 1,
      tema: "Modelo OSI y Arquitectura de Redes",
      descripcion: "Introducción a las capas del modelo OSI y arquitecturas básicas de redes.",
      laboratorio: "Configuración de VirtualBox y simuladores de red"
    },
    {
      semana: 2,
      tema: "Direccionamiento IP y Subredes",
      descripcion: "Conceptos de direcciones IP, máscaras de red y división en subredes.",
      laboratorio: "Cálculo de subredes y configuración de IPs"
    },
    {
      semana: 3,
      tema: "Topologías y Protocolos de Red",
      descripción: "Diferentes topologías de red y protocolos de comunicación principales.",
      laboratorio: "Implementación de topologías con Packet Tracer"
    },
    {
      semana: 4,
      tema: "Routing y Switching",
      descripcion: "Configuración de routers y switches, algoritmos de enrutamiento.",
      laboratorio: "Configuración básica de equipos Cisco"
    },
    {
      semana: 5,
      tema: "Seguridad en Redes y Troubleshooting",
      descripcion: "Principios de seguridad de redes y resolución de problemas comunes.",
      laboratorio: "Diagnóstico y solución de problemas de red"
    }
  ]

  const protocolos = [
    { protocolo: "HTTP/HTTPS", capa: "Aplicación", puerto: "80/443", descripcion: "Protocolo de transferencia de hipertexto" },
    { protocolo: "FTP", capa: "Aplicación", puerto: "21", descripcion: "Protocolo de transferencia de archivos" },
    { protocolo: "TCP", capa: "Transporte", puerto: "Variable", descripcion: "Protocolo de control de transmisión" },
    { protocolo: "UDP", capa: "Transporte", puerto: "Variable", descripcion: "Protocolo de datagramas de usuario" },
    { protocolo: "IP", capa: "Red", puerto: "N/A", descripcion: "Protocolo de internet" },
    { protocolo: "ICMP", capa: "Red", puerto: "N/A", descripcion: "Protocolo de mensajes de control de internet" }
  ]

  return (
    <div className="container my-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active">Redes de Computadoras</li>
        </ol>
      </nav>

      {/* Header del curso */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-diagram-3 display-4 text-primary me-3"></i>
            <div>
              <h1 className="display-5 fw-bold">Redes de Computadoras</h1>
              <p className="lead text-muted">Comunicación entre dispositivos y protocolos de red</p>
            </div>
          </div>
          <p className="fs-5">
            Estudio comprehensivo de la comunicación entre dispositivos, protocolos de red, 
            arquitecturas y configuración de equipos de networking.
          </p>
        </div>
        <div className="col-lg-4">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">Información del Curso</h5>
              <ul className="list-unstyled">
                <li><strong>Duración:</strong> 5 semanas</li>
                <li><strong>Modalidad:</strong> Teórico-Práctica</li>
                <li><strong>Prerrequisitos:</strong> Sistemas Operativos</li>
                <li><strong>Nivel:</strong> Intermedio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Componentes clave del curso */}
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card h-100 border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="bi bi-layers me-2"></i>Modelo OSI</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between">
                  <span>7. Aplicación</span>
                  <span className="badge bg-success">HTTP, FTP</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>6. Presentación</span>
                  <span className="badge bg-info">SSL, TLS</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>5. Sesión</span>
                  <span className="badge bg-warning">NetBIOS</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>4. Transporte</span>
                  <span className="badge bg-danger">TCP, UDP</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>3. Red</span>
                  <span className="badge bg-primary">IP, ICMP</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>2. Enlace</span>
                  <span className="badge bg-secondary">Ethernet</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>1. Física</span>
                  <span className="badge bg-dark">Cable, WiFi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <h3 className="mb-3">Puntos Clave del Curso</h3>
          <div className="accordion" id="puntosClaveAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#modeloOSI">
                  Modelo OSI y Protocolos
                </button>
              </h2>
              <div id="modeloOSI" className="accordion-collapse collapse show" data-bs-parent="#puntosClaveAccordion">
                <div className="accordion-body">
                  <p>Comprensión profunda de las 7 capas del modelo OSI y cómo los protocolos interactúan en cada nivel.</p>
                  <ul>
                    <li>Separación de responsabilidades por capas</li>
                    <li>Encapsulación y desencapsulación de datos</li>
                    <li>Interoperabilidad entre diferentes tecnologías</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#direccionamiento">
                  Direccionamiento IP
                </button>
              </h2>
              <div id="direccionamiento" className="accordion-collapse collapse" data-bs-parent="#puntosClaveAccordion">
                <div className="accordion-body">
                  <p>Manejo de direcciones IPv4 e IPv6, cálculo de subredes y configuración de redes.</p>
                  <ul>
                    <li>Clases de direcciones IP y CIDR</li>
                    <li>Subnetting y VLSM</li>
                    <li>NAT y direcciones privadas</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#configuracion">
                  Configuración de Redes
                </button>
              </h2>
              <div id="configuracion" className="accordion-collapse collapse" data-bs-parent="#puntosClaveAccordion">
                <div className="accordion-body">
                  <p>Configuración práctica de equipos de red y resolución de problemas.</p>
                  <ul>
                    <li>Comandos básicos de Cisco IOS</li>
                    <li>Configuración de VLANs</li>
                    <li>Protocolos de enrutamiento dinámico</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de protocolos */}
      <div className="mb-5">
        <h3 className="mb-3">
          <i className="bi bi-wifi text-primary me-2"></i>
          Protocolos de Red Principales
        </h3>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Protocolo</th>
                <th>Capa OSI</th>
                <th>Puerto</th>
                <th>Descripción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {protocolos.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.protocolo}</strong></td>
                  <td>
                    <span className={`badge ${
                      item.capa === 'Aplicación' ? 'bg-success' : 
                      item.capa === 'Transporte' ? 'bg-warning' : 'bg-info'
                    }`}>
                      {item.capa}
                    </span>
                  </td>
                  <td><code>{item.puerto}</code></td>
                  <td>{item.descripcion}</td>
                  <td>
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <small className="text-muted ms-1">Activo</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cronograma de clases */}
      <div className="mb-5">
        <h3 className="mb-3">
          <i className="bi bi-calendar-check text-warning me-2"></i>
          Cronograma Detallado
        </h3>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Semana</th>
                <th>Tema Teórico</th>
                <th>Laboratorio Práctico</th>
                <th>Evaluación</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((clase, index) => (
                <tr key={index}>
                  <td className="text-center">
                    <span className="badge bg-primary fs-6">{clase.semana}</span>
                  </td>
                  <td>
                    <strong>{clase.tema}</strong>
                    <br />
                    <small className="text-muted">{clase.descripcion}</small>
                  </td>
                  <td>
                    <i className="bi bi-gear text-success me-1"></i>
                    {clase.laboratorio}
                  </td>
                  <td className="text-center">
                    {index === 2 ? (
                      <span className="badge bg-warning">Parcial</span>
                    ) : index === 4 ? (
                      <span className="badge bg-danger">Final</span>
                    ) : (
                      <span className="badge bg-info">Quiz</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recursos adicionales */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0"><i className="bi bi-book me-2"></i>Recursos de Estudio</h5>
            </div>
            <div className="list-group list-group-flush">
              <div className="list-group-item">
                <h6 className="mb-1">Cisco Packet Tracer</h6>
                <p className="mb-1">Simulador de redes para prácticas</p>
                <small>Descarga gratuita con registro</small>
              </div>
              <div className="list-group-item">
                <h6 className="mb-1">Wireshark</h6>
                <p className="mb-1">Analizador de protocolos de red</p>
                <small>Herramienta open source</small>
              </div>
              <div className="list-group-item">
                <h6 className="mb-1">GNS3</h6>
                <p className="mb-1">Emulador de redes avanzado</p>
                <small>Para configuraciones complejas</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0"><i className="bi bi-trophy me-2"></i>Competencias a Desarrollar</h5>
            </div>
            <div className="card-body">
              <div className="progress mb-2">
                <div className="progress-bar bg-success" style={{width: '90%'}}>Configuración básica 90%</div>
              </div>
              <div className="progress mb-2">
                <div className="progress-bar bg-info" style={{width: '75%'}}>Troubleshooting 75%</div>
              </div>
              <div className="progress mb-2">
                <div className="progress-bar bg-warning" style={{width: '80%'}}>Protocolos 80%</div>
              </div>
              <div className="progress">
                <div className="progress-bar bg-danger" style={{width: '70%'}}>Seguridad 70%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="d-flex justify-content-between">
        <Link to="/desarrollo-web" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Curso Anterior
        </Link>
        <Link to="/inteligencia-artificial" className="btn btn-primary">
          Siguiente Curso
          <i className="bi bi-arrow-right ms-2"></i>
        </Link>
      </div>
    </div>
  )
}

export default RedesComputadoras