// src/pages/MyVotes.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
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
      // Manejar la respuesta correctamente
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
      <div className="spinner-custom">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <div className="dashboard-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h1>
              <i className="bi bi-check-circle-fill me-3"></i>
              Mis Votos
            </h1>
            <p className="mb-0 mt-2">
              Historial de votaciones en las que has participado
            </p>
          </Col>
          <Col xs="auto">
            <Badge bg="warning" text="dark" className="fs-5">
              {votes.length} {votes.length === 1 ? 'Voto' : 'Votos'}
            </Badge>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {votes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-inbox"></i>
          </div>
          <h3 className="empty-title">No has emitido votos</h3>
          <p className="empty-description">
            Participa en las campañas activas para registrar tus votos aquí.
          </p>
        </div>
      ) : (
        <Row>
          {votes.map((vote) => {
            // Verificar si campaignId y candidateId son objetos o strings
            const campaign = typeof vote.campaignId === 'object' ? vote.campaignId : null;
            const candidate = typeof vote.candidateId === 'object' ? vote.candidateId : null;

            if (!campaign || !candidate) {
              return null; // Skip this vote if data is incomplete
            }

            return (
              <Col key={vote._id} xs={12} md={6} lg={4} className="mb-4">
                <Card className="card-custom h-100">
                  <Card.Body>
                    <div className="mb-3">
                      <Badge bg="primary" className="mb-2">
                        <i className="bi bi-trophy me-1"></i>
                        Campaña
                      </Badge>
                      <h5 className="text-navy mb-1">
                        {campaign.titulo}
                      </h5>
                      <small className="text-muted">
                        {campaign.descripcion.length > 80
                          ? campaign.descripcion.substring(0, 80) + '...'
                          : campaign.descripcion}
                      </small>
                    </div>

                    <div className="border-top pt-3 mb-3">
                      <Badge bg="success" className="mb-2">
                        <i className="bi bi-person-check me-1"></i>
                        Tu Voto
                      </Badge>
                      <h6 className="text-navy mb-1">{candidate.nombre}</h6>
                      <small className="text-muted">{candidate.descripcion}</small>
                    </div>

                    <div className="border-top pt-3">
                      <small className="text-muted">
                        <i className="bi bi-calendar-check me-2"></i>
                        Votado el: {formatDate(vote.fechaVoto)}
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default MyVotes;