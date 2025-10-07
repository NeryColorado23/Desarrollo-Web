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
      return <Badge bg="success">Activa</Badge>;
    } else if (campaign.estado === 'finalizada') {
      return <Badge bg="danger">Finalizada</Badge>;
    } else {
      return <Badge bg="secondary">Inactiva</Badge>;
    }
  };

  const getVotingStatus = () => {
    if (campaign.habilitadaVotacion && !timeRemaining.isExpired) {
      return <Badge bg="primary" className="ms-2">Votación Habilitada</Badge>;
    }
    return null;
  };

  return (
    <Card className="campaign-card h-100" onClick={onClick}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="card-title text-navy mb-0">{campaign.titulo}</h5>
          <div>
            {getStatusBadge()}
            {getVotingStatus()}
          </div>
        </div>
        
        <Card.Text className="text-muted mb-3">
          {campaign.descripcion.length > 100 
            ? campaign.descripcion.substring(0, 100) + '...' 
            : campaign.descripcion}
        </Card.Text>
        
        <div className="border-top pt-3">
          <div className="row text-center">
            <div className="col-6">
              <small className="text-muted d-block">Inicio</small>
              <strong className="text-navy">{formatDateOnly(campaign.fechaInicio)}</strong>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">Fin</small>
              <strong className="text-navy">{formatDateOnly(campaign.fechaFin)}</strong>
            </div>
          </div>
        </div>

        {!timeRemaining.isExpired && campaign.habilitadaVotacion && (
          <div className="mt-3 text-center">
            <Badge bg="warning" text="dark">
              <i className="bi bi-clock me-1"></i>
              {timeRemaining.days > 0 && `${timeRemaining.days}d `}
              {timeRemaining.hours}h {timeRemaining.minutes}m restantes
            </Badge>
          </div>
        )}

        <div className="mt-3 text-center">
          <small className="text-muted">
            <i className="bi bi-award me-1"></i>
            {campaign.cantidadVotosPorUsuario} voto(s) por persona
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CampaignCard;