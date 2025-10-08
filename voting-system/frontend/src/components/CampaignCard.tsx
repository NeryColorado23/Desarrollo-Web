// src/components/CampaignCard.tsx
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import type { Campaign } from '../types';
import { formatDateOnly, calculateTimeRemaining } from '../utils/helpers';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  const timeRemaining = calculateTimeRemaining(campaign.fechaFin);
  
  const getStatusBadge = () => {
    if (campaign.estado === 'activa') {
      return <Badge bg="success" className="px-3 py-2">Activa</Badge>;
    } else if (campaign.estado === 'finalizada') {
      return <Badge bg="danger" className="px-3 py-2">Finalizada</Badge>;
    } else {
      return <Badge bg="secondary" className="px-3 py-2">Inactiva</Badge>;
    }
  };

  const getVotingStatus = () => {
    if (campaign.habilitadaVotacion && !timeRemaining.isExpired) {
      return <Badge bg="primary" className="ms-2 px-3 py-2">Votación Habilitada</Badge>;
    }
    return null;
  };

  return (
    <Card className="campaign-card h-100 shadow-sm" onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card.Body className="d-flex flex-column">
        {/* Header con título y badges */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <h5 className="card-title text-navy mb-0 fw-bold">{campaign.titulo}</h5>
            <div className="d-flex flex-wrap gap-2">
              {getStatusBadge()}
              {getVotingStatus()}
            </div>
          </div>
        </div>
        
        {/* Descripción */}
        <Card.Text className="text-muted mb-3 flex-grow-1" style={{ minHeight: '60px' }}>
          {campaign.descripcion.length > 120 
            ? campaign.descripcion.substring(0, 120) + '...' 
            : campaign.descripcion}
        </Card.Text>
        
        {/* Fechas */}
        <div className="border-top border-bottom py-3 mb-3">
          <div className="row g-3">
            <div className="col-6 text-center">
              <div className="d-flex flex-column">
                <small className="text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-calendar-check me-1"></i>
                  Inicio
                </small>
                <strong className="text-navy fs-6">{formatDateOnly(campaign.fechaInicio)}</strong>
              </div>
            </div>
            <div className="col-6 text-center">
              <div className="d-flex flex-column">
                <small className="text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-calendar-x me-1"></i>
                  Fin
                </small>
                <strong className="text-navy fs-6">{formatDateOnly(campaign.fechaFin)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tiempo restante */}
        {!timeRemaining.isExpired && campaign.habilitadaVotacion && (
          <div className="mb-3">
            <div className="alert alert-warning mb-0 py-2 px-3 d-flex align-items-center justify-content-center" role="alert">
              <i className="bi bi-clock-history me-2 fs-5"></i>
              <span className="fw-bold">
                {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                {timeRemaining.hours}h {timeRemaining.minutes}m restantes
              </span>
            </div>
          </div>
        )}

        {/* Footer con info de votos */}
        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-center gap-2 p-2 bg-light rounded">
            <i className="bi bi-award text-warning fs-5"></i>
            <span className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>
              {campaign.cantidadVotosPorUsuario} {campaign.cantidadVotosPorUsuario === 1 ? 'voto' : 'votos'} por persona
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CampaignCard;