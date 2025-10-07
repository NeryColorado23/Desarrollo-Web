// src/pages/CampaignDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import { campaignAPI, voteAPI } from '../services/api';
import type { Campaign, Candidate, CampaignStats, VoteAvailability } from '../types';
import { useAuth } from '../context/AuthContext';
import CandidateCard from '../components/CandidateCard';
import VotingChart from '../components/VotingChart';
import { 
  formatDateOnly, 
  calculateTimeRemaining, 
  formatTimeRemaining,
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

    // src/pages/CampaignDetail.tsx (continuación)

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
      <div className="spinner-custom">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Campaña no encontrada</Alert>
        <Button variant="navy" onClick={() => navigate('/')}>
          Volver a Campañas
        </Button>
      </Container>
    );
  }

  const getStatusBadge = () => {
    if (campaign.estado === 'activa') {
      return <Badge bg="success" className="fs-6">Activa</Badge>;
    } else if (campaign.estado === 'finalizada') {
      return <Badge bg="danger" className="fs-6">Finalizada</Badge>;
    } else {
      return <Badge bg="secondary" className="fs-6">Inactiva</Badge>;
    }
  };

  return (
    <Container className="py-5">
      <Button 
        variant="outline-navy" 
        className="mb-4"
        onClick={() => navigate('/')}
      >
        <i className="bi bi-arrow-left me-2"></i>
        Volver a Campañas
      </Button>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <div className="card-custom mb-4">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center mb-3">
              <h1 className="text-navy mb-0 me-3">{campaign.titulo}</h1>
              {getStatusBadge()}
            </div>
            <p className="text-muted mb-3">{campaign.descripcion}</p>
            <Row>
              <Col sm={6}>
                <small className="text-muted d-block">Fecha de Inicio</small>
                <strong>{formatDateOnly(campaign.fechaInicio)}</strong>
              </Col>
              <Col sm={6}>
                <small className="text-muted d-block">Fecha de Fin</small>
                <strong>{formatDateOnly(campaign.fechaFin)}</strong>
              </Col>
            </Row>
          </Col>
          <Col md={4}>
            {campaign.habilitadaVotacion && !timeRemaining.isExpired && (
              <div className={`voting-timer ${timeRemaining.days === 0 && timeRemaining.hours < 2 ? 'expiring' : ''}`}>
                <div className="timer-label">Tiempo Restante</div>
                <div className="timer-value">
                  {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                  {String(timeRemaining.hours).padStart(2, '0')}:
                  {String(timeRemaining.minutes).padStart(2, '0')}:
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
              </div>
            )}
            {timeRemaining.isExpired && (
              <Alert variant="danger" className="text-center mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Votación Finalizada
              </Alert>
            )}
          </Col>
        </Row>
      </div>

      {isAuthenticated && voteAvailability && (
        <div className="alert-custom info mb-4">
          <Row className="align-items-center">
            <Col md={8}>
              <strong>
                <i className="bi bi-info-circle me-2"></i>
                Votos disponibles: {voteAvailability.votosDisponibles} de {voteAvailability.totalVotosPermitidos}
              </strong>
            </Col>
            <Col md={4} className="text-md-end">
              <Badge bg="primary" className="fs-6">
                Votos emitidos: {voteAvailability.votosEmitidos}
              </Badge>
            </Col>
          </Row>
        </div>
      )}

      <Row className="mb-4">
        <Col>
          <h3 className="text-navy">
            <i className="bi bi-people-fill me-2"></i>
            Candidatos ({candidates.length})
          </h3>
        </Col>
      </Row>

      {candidates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-person-x"></i>
          </div>
          <h3 className="empty-title">No hay candidatos</h3>
          <p className="empty-description">
            Esta campaña aún no tiene candidatos registrados.
          </p>
        </div>
      ) : (
        <Row className="mb-5">
          {candidates.map((candidate) => (
            <Col key={candidate._id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
              <CandidateCard
                candidate={candidate}
                onVote={handleVote}
                isVotingEnabled={campaign.habilitadaVotacion && !timeRemaining.isExpired && isAuthenticated}
                hasVoted={votedCandidates.includes(candidate._id)}
                showVotes={true}
              />
            </Col>
          ))}
        </Row>
      )}

      {stats.length > 0 && (
        <Row>
          <Col>
            <VotingChart 
              data={stats} 
              title={`Resultados - ${campaign.titulo}`}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CampaignDetail;