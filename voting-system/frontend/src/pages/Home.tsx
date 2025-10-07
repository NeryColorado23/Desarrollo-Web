// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { campaignAPI } from '../services/api';
import type { Campaign } from '../types';
import CampaignCard from '../components/CampaignCard';
import { handleAPIError } from '../utils/helpers';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await campaignAPI.getAll();
      setCampaigns(response.campaigns);
    } catch (err: any) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignClick = (campaignId: string): void => {
    navigate(`/campaign/${campaignId}`);
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
              <i className="bi bi-trophy-fill me-3"></i>
              Campañas de Votación
            </h1>
            <p className="mb-0 mt-2">
              Colegio de Ingenieros de Guatemala - Elecciones de Junta Directiva
            </p>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {campaigns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-inbox"></i>
          </div>
          <h3 className="empty-title">No hay campañas disponibles</h3>
          <p className="empty-description">
            Actualmente no hay campañas de votación activas.
          </p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <h4 className="text-navy">
                <i className="bi bi-list-check me-2"></i>
                Todas las Campañas ({campaigns.length})
              </h4>
            </Col>
          </Row>

          <Row>
            {campaigns.map((campaign) => (
              <Col key={campaign._id} xs={12} md={6} lg={4} className="mb-4">
                <CampaignCard
                  campaign={campaign}
                  onClick={() => handleCampaignClick(campaign._id)}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Home;