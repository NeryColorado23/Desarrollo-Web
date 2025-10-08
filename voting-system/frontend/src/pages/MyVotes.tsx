// src/pages/MyVotes.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { voteAPI } from '../services/api';
import { formatDate, handleAPIError } from '../utils/helpers';

interface VoteWithDetails {
  _id: string;
  campaignId: {
    _id: string;
    titulo: string;
    descripcion: string;
  } | string;
  candidateId: {
    _id: string;
    nombre: string;
    descripcion: string;
  } | string;
  fechaVoto: string;
}

const MyVotes: React.FC = () => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState<VoteWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyVotes();
  }, []);

  const fetchMyVotes = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await voteAPI.getMyVotes();
      const votesData = response.votes || [];
      setVotes(votesData);
    } catch (err: any) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="d-flex flex-column justify-content-center align-items-center" 
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
      >
        <div className="text-center">
          <div 
            className="spinner-border text-navy mb-3" 
            role="status"
            style={{ width: '4rem', height: '4rem', borderWidth: '0.4rem' }}
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h5 className="text-navy fw-bold">Cargando tus votos...</h5>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Header mejorado */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div 
                    className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle shadow-sm"
                    style={{ width: '60px', height: '60px', minWidth: '60px' }}
                  >
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <div>
                    <h1 className="mb-1 fw-bold text-navy">Mis Votos</h1>
                    <p className="mb-0 text-muted">
                      <i className="bi bi-clock-history me-2"></i>
                      Historial completo de tus participaciones
                    </p>
                  </div>
                </div>
              </Col>
              <Col xs="auto">
                <div className="text-center">
                  <div className="display-5 fw-bold text-navy">{votes.length}</div>
                  <Badge bg="warning" text="dark" className="px-3 py-2 mt-2">
                    <i className="bi bi-award-fill me-1"></i>
                    {votes.length === 1 ? 'Voto Emitido' : 'Votos Emitidos'}
                  </Badge>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Alerta de error */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        {/* Estado vacío o lista de votos */}
        {votes.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <div className="empty-state">
                <div className="text-center mb-4">
                  <i className="bi bi-inbox display-1 text-muted mb-4" style={{ fontSize: '6rem' }}></i>
                  <h3 className="text-navy fw-bold mb-3">No has emitido votos aún</h3>
                  <p className="text-muted mb-4 fs-5">
                    Participa en las campañas activas para comenzar a votar y<br />
                    ver tu historial de participación aquí.
                  </p>
                  <Button 
                    variant="navy" 
                    size="lg"
                    onClick={() => navigate('/')}
                    className="px-5 py-3 fw-bold shadow-sm"
                  >
                    <i className="bi bi-trophy-fill me-2"></i>
                    Ver Campañas Disponibles
                  </Button>
                </div>

                {/* Información adicional */}
                <Row className="mt-5 g-4">
                  <Col md={4}>
                    <div className="text-center">
                      <i className="bi bi-shield-check text-success display-4 mb-3"></i>
                      <h6 className="fw-bold text-navy mb-2">Voto Seguro</h6>
                      <p className="text-muted small mb-0">
                        Tu voto es confidencial y está protegido
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center">
                      <i className="bi bi-clock-history text-primary display-4 mb-3"></i>
                      <h6 className="fw-bold text-navy mb-2">Historial Completo</h6>
                      <p className="text-muted small mb-0">
                        Guarda registro de todas tus participaciones
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center">
                      <i className="bi bi-award-fill text-warning display-4 mb-3"></i>
                      <h6 className="fw-bold text-navy mb-2">Tu Opinión Cuenta</h6>
                      <p className="text-muted small mb-0">
                        Participa en las decisiones importantes
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <>
            {/* Info banner */}
            <Alert variant="info" className="shadow-sm mb-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle-fill fs-4"></i>
                    <div>
                      <strong>Registro Permanente</strong>
                      <p className="mb-0 small">
                        Este es tu historial oficial de votaciones. Los datos son inmutables y verificables.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/')}
                  >
                    <i className="bi bi-trophy me-2"></i>
                    Ver Más Campañas
                  </Button>
                </Col>
              </Row>
            </Alert>

            {/* Grid de votos */}
            <Row className="g-4">
              {votes.map((vote) => {
                const campaign = typeof vote.campaignId === 'object' ? vote.campaignId : null;
                const candidate = typeof vote.candidateId === 'object' ? vote.candidateId : null;

                if (!campaign || !candidate) {
                  return null;
                }

                return (
                  <Col key={vote._id} xs={12} md={6} lg={4}>
                    <Card className="border-0 shadow-sm h-100 position-relative overflow-hidden">
                      {/* Badge de verificación en la esquina */}
                      <div 
                        className="position-absolute top-0 end-0 bg-success text-white px-3 py-2"
                        style={{ 
                          borderBottomLeftRadius: '0.5rem',
                          zIndex: 1
                        }}
                      >
                        <i className="bi bi-patch-check-fill"></i>
                      </div>

                      <Card.Body className="p-4">
                        {/* Sección de campaña */}
                        <div className="mb-4">
                          <Badge bg="primary" className="px-3 py-2 mb-3">
                            <i className="bi bi-trophy-fill me-2"></i>
                            Campaña
                          </Badge>
                          <h5 className="text-navy fw-bold mb-2">
                            {campaign.titulo}
                          </h5>
                          <p className="text-muted small mb-0">
                            {campaign.descripcion.length > 100
                              ? campaign.descripcion.substring(0, 100) + '...'
                              : campaign.descripcion}
                          </p>
                        </div>

                        {/* Divider */}
                        <hr className="my-3" />

                        {/* Sección de candidato votado */}
                        <div className="mb-4">
                          <Badge bg="success" className="px-3 py-2 mb-3">
                            <i className="bi bi-person-check-fill me-2"></i>
                            Tu Voto
                          </Badge>
                          <div className="d-flex align-items-start gap-3">
                            <div 
                              className="d-flex align-items-center justify-content-center bg-navy text-white rounded-circle fw-bold"
                              style={{ 
                                width: '50px', 
                                height: '50px', 
                                minWidth: '50px',
                                fontSize: '1.2rem'
                              }}
                            >
                              {candidate.nombre.charAt(0)}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="text-navy fw-bold mb-1">{candidate.nombre}</h6>
                              <p className="text-muted small mb-0">
                                {candidate.descripcion.length > 60
                                  ? candidate.descripcion.substring(0, 60) + '...'
                                  : candidate.descripcion}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <hr className="my-3" />

                        {/* Fecha del voto */}
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2 text-muted">
                            <i className="bi bi-calendar-check-fill"></i>
                            <small className="fw-semibold">Fecha de Voto</small>
                          </div>
                          <Badge bg="light" text="dark" className="px-3 py-2">
                            <i className="bi bi-clock me-1"></i>
                            {formatDate(vote.fechaVoto)}
                          </Badge>
                        </div>
                      </Card.Body>

                      {/* Footer de la card */}
                      <Card.Footer className="bg-light border-0 p-3 text-center">
                        <small className="text-muted">
                          <i className="bi bi-shield-lock-fill me-1"></i>
                          Voto verificado y registrado
                        </small>
                      </Card.Footer>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {/* Resumen al final */}
            <Card className="border-0 shadow-sm mt-5 bg-light">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h5 className="text-navy fw-bold mb-2">
                      <i className="bi bi-graph-up-arrow me-2"></i>
                      Tu Participación
                    </h5>
                    <p className="text-muted mb-0">
                      Has participado en <strong className="text-navy">{votes.length}</strong> {votes.length === 1 ? 'campaña' : 'campañas'} de votación.
                      ¡Gracias por tu participación activa!
                    </p>
                  </Col>
                  <Col md={4} className="text-md-end mt-3 mt-md-0">
                    <Button 
                      variant="navy" 
                      size="lg"
                      onClick={() => navigate('/')}
                      className="fw-bold"
                    >
                      <i className="bi bi-plus-circle-fill me-2"></i>
                      Ver Más Campañas
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
};

export default MyVotes;