// src/pages/CampaignDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Badge, Card, ProgressBar } from 'react-bootstrap';
import { campaignAPI, voteAPI } from '../services/api';
import type { Campaign, Candidate, CampaignStats, VoteAvailability } from '../types';
import { useAuth } from '../context/AuthContext';
import CandidateCard from '../components/CandidateCard';
import VotingChart from '../components/VotingChart';
import { 
  formatDateOnly, 
  calculateTimeRemaining, 
  handleAPIError 
} from '../utils/helpers';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<CampaignStats[]>([]);
  const [voteAvailability, setVoteAvailability] = useState<VoteAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [votedCandidates, setVotedCandidates] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchCampaignData();
      fetchVoteAvailability();
      fetchMyVotes();
    }
  }, [id]);

  useEffect(() => {
    if (campaign) {
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(campaign.fechaFin));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [campaign]);

  const fetchCampaignData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await campaignAPI.getById(id!);
      setCampaign(response.campaign);
      setCandidates(response.candidates);
      
      const statsResponse = await campaignAPI.getStats(id!);
      setStats(statsResponse.candidateStats);
    } catch (err: any) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteAvailability = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const response = await voteAPI.getAvailable(id!);
      setVoteAvailability(response);
    } catch (err: any) {
      console.error('Error al obtener disponibilidad de votos:', err);
    }
  };

  const fetchMyVotes = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      const response = await voteAPI.getMyVotes();
      const campaignVotes = response.votes.filter(
        (vote: any) => vote.campaignId._id === id || vote.campaignId === id
      );
      setVotedCandidates(campaignVotes.map((vote: any) => vote.candidateId._id || vote.candidateId));
    } catch (err: any) {
      console.error('Error al obtener votos:', err);
    }
  };

  const handleVote = async (candidateId: string): Promise<void> => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para votar');
      navigate('/login');
      return;
    }

    if (!campaign?.habilitadaVotacion) {
      alert('La votación no está habilitada para esta campaña');
      return;
    }

    if (timeRemaining.isExpired) {
      alert('El periodo de votación ha finalizado');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres votar por este candidato?')) {
      try {
        setError('');
        await voteAPI.cast(id!, candidateId);
        setSuccess('¡Voto registrado exitosamente!');
        
        // Actualizar datos
        await fetchCampaignData();
        await fetchVoteAvailability();
        await fetchMyVotes();

        setTimeout(() => setSuccess(''), 5000);
      } catch (err: any) {
        setError(handleAPIError(err));
      }
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
          <h5 className="text-navy fw-bold">Cargando campaña...</h5>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <Container className="py-5">
        <Card className="border-0 shadow-sm text-center p-5">
          <Card.Body>
            <i className="bi bi-exclamation-triangle-fill text-danger display-1 mb-4"></i>
            <h3 className="text-navy fw-bold mb-3">Campaña no encontrada</h3>
            <p className="text-muted mb-4">La campaña que buscas no existe o ha sido eliminada.</p>
            <Button variant="navy" size="lg" onClick={() => navigate('/')}>
              <i className="bi bi-arrow-left me-2"></i>
              Volver a Campañas
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const getStatusBadge = () => {
    if (campaign.estado === 'activa') {
      return (
        <Badge bg="success" className="px-3 py-2 fs-6">
          <i className="bi bi-check-circle-fill me-2"></i>
          Activa
        </Badge>
      );
    } else if (campaign.estado === 'finalizada') {
      return (
        <Badge bg="danger" className="px-3 py-2 fs-6">
          <i className="bi bi-x-circle-fill me-2"></i>
          Finalizada
        </Badge>
      );
    } else {
      return (
        <Badge bg="secondary" className="px-3 py-2 fs-6">
          <i className="bi bi-pause-circle-fill me-2"></i>
          Inactiva
        </Badge>
      );
    }
  };

  const totalVotos = stats.reduce((sum, stat) => sum + stat.votos, 0);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Botón de regreso mejorado */}
        <Button 
          variant="outline-navy" 
          className="mb-4 shadow-sm"
          onClick={() => navigate('/')}
        >
          <i className="bi bi-arrow-left-circle-fill me-2"></i>
          Volver a Campañas
        </Button>

        {/* Alertas mejoradas */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')} className="shadow-sm">
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
          </Alert>
        )}

        {/* Header de la campaña mejorado */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col lg={8}>
                {/* Título y estado */}
                <div className="d-flex align-items-center flex-wrap gap-3 mb-3">
                  <h1 className="text-navy mb-0 fw-bold">{campaign.titulo}</h1>
                  {getStatusBadge()}
                  {campaign.habilitadaVotacion && (
                    <Badge bg="primary" className="px-3 py-2 fs-6">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Votación Habilitada
                    </Badge>
                  )}
                </div>

                {/* Descripción */}
                <p className="text-muted mb-4 fs-5">{campaign.descripcion}</p>

                {/* Información de fechas */}
                <Row className="g-3">
                  <Col sm={6}>
                    <Card className="border-0 bg-light h-100">
                      <Card.Body className="p-3">
                        <small className="text-muted text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-calendar-check me-1"></i>
                          Fecha de Inicio
                        </small>
                        <h5 className="mb-0 fw-bold text-navy">{formatDateOnly(campaign.fechaInicio)}</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={6}>
                    <Card className="border-0 bg-light h-100">
                      <Card.Body className="p-3">
                        <small className="text-muted text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-calendar-x me-1"></i>
                          Fecha de Fin
                        </small>
                        <h5 className="mb-0 fw-bold text-navy">{formatDateOnly(campaign.fechaFin)}</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>

              {/* Timer o estado de votación */}
              <Col lg={4} className="mt-4 mt-lg-0">
                {campaign.habilitadaVotacion && !timeRemaining.isExpired ? (
                  <Card 
                    className={`border-0 shadow text-white text-center ${
                      timeRemaining.days === 0 && timeRemaining.hours < 2 ? 'bg-danger' : 'bg-navy'
                    }`}
                  >
                    <Card.Body className="p-4">
                      <div className="mb-2">
                        <i className="bi bi-clock-history" style={{ fontSize: '2.5rem' }}></i>
                      </div>
                      <h6 className="text-uppercase mb-3" style={{ letterSpacing: '1px', opacity: 0.9 }}>
                        Tiempo Restante
                      </h6>
                      <div className="timer-value mb-2" style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                        {String(timeRemaining.hours).padStart(2, '0')}:
                        {String(timeRemaining.minutes).padStart(2, '0')}:
                        {String(timeRemaining.seconds).padStart(2, '0')}
                      </div>
                      {timeRemaining.days === 0 && timeRemaining.hours < 2 && (
                        <Badge bg="warning" text="dark" className="mt-2 px-3 py-2">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          ¡Votación por terminar!
                        </Badge>
                      )}
                    </Card.Body>
                  </Card>
                ) : timeRemaining.isExpired ? (
                  <Alert variant="danger" className="text-center mb-0 shadow">
                    <i className="bi bi-clock-history display-4 d-block mb-3"></i>
                    <h5 className="fw-bold">Votación Finalizada</h5>
                    <p className="mb-0">El periodo de votación ha terminado</p>
                  </Alert>
                ) : (
                  <Alert variant="warning" className="text-center mb-0 shadow">
                    <i className="bi bi-pause-circle display-4 d-block mb-3"></i>
                    <h5 className="fw-bold">Votación No Disponible</h5>
                    <p className="mb-0">La votación aún no ha sido habilitada</p>
                  </Alert>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Información de votos disponibles (usuario autenticado) */}
        {isAuthenticated && voteAvailability && (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle"
                      style={{ width: '50px', height: '50px', minWidth: '50px' }}
                    >
                      <i className="bi bi-ticket-perforated-fill fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold text-navy">Tus Votos Disponibles</h6>
                      <p className="mb-0 text-muted">
                        <strong className="text-navy">{voteAvailability.votosDisponibles}</strong> de{' '}
                        <strong className="text-navy">{voteAvailability.totalVotosPermitidos}</strong> disponibles
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mt-3 mt-md-0">
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Progreso de votación</span>
                      <Badge bg="success" className="px-2">
                        {voteAvailability.votosEmitidos} emitido{voteAvailability.votosEmitidos !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <ProgressBar 
                      now={(voteAvailability.votosEmitidos / voteAvailability.totalVotosPermitidos) * 100}
                      style={{ height: '20px' }}
                    >
                      <ProgressBar 
                        variant="success"
                        now={(voteAvailability.votosEmitidos / voteAvailability.totalVotosPermitidos) * 100}
                        label={`${Math.round((voteAvailability.votosEmitidos / voteAvailability.totalVotosPermitidos) * 100)}%`}
                      />
                    </ProgressBar>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Sección de candidatos */}
        <div className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-navy text-white p-3">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0 fw-bold">
                  <i className="bi bi-people-fill me-2"></i>
                  Candidatos
                </h3>
                <Badge bg="yellow" text="dark" className="px-3 py-2 fs-6">
                  {candidates.length} candidato{candidates.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </Card.Header>
          </Card>
        </div>

        {/* Lista de candidatos */}
        {candidates.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <div className="empty-state">
                <i className="bi bi-person-x display-1 text-muted mb-4"></i>
                <h3 className="empty-title text-navy fw-bold mb-2">No hay candidatos</h3>
                <p className="empty-description">
                  Esta campaña aún no tiene candidatos registrados.
                </p>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4 mb-5">
            {candidates.map((candidate) => (
              <Col key={candidate._id} xs={12} sm={6} lg={4} xl={3}>
                <CandidateCard
                  candidate={candidate}
                  onVote={handleVote}
                  isVotingEnabled={campaign.habilitadaVotacion && !timeRemaining.isExpired && isAuthenticated}
                  hasVoted={votedCandidates.includes(candidate._id)}
                  showVotes={true}
                  isSelected={votedCandidates.includes(candidate._id)}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Estadísticas y gráfico */}
        {stats.length > 0 && (
          <div className="mt-5">
            {/* Resumen de participación */}
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 text-center">
                    <i className="bi bi-people-fill text-primary display-4 mb-3"></i>
                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                      Total de Votos
                    </h6>
                    <h2 className="mb-0 fw-bold text-navy">{totalVotos}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 text-center">
                    <i className="bi bi-trophy-fill text-warning display-4 mb-3"></i>
                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                      Candidatos
                    </h6>
                    <h2 className="mb-0 fw-bold text-navy">{candidates.length}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 text-center">
                    <i className="bi bi-graph-up text-success display-4 mb-3"></i>
                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                      Líder Actual
                    </h6>
                    <h5 className="mb-0 fw-bold text-navy text-truncate">
                      {stats[0]?.nombre || 'N/A'}
                    </h5>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Gráfico de resultados */}
            <VotingChart 
              data={stats} 
              title={`Resultados de Votación`}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default CampaignDetail;