// src/components/CandidateCard.tsx
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import type { Candidate } from '../types';
import { getInitials } from '../utils/helpers';

interface CandidateCardProps {
  candidate: Candidate;
  onVote?: (candidateId: string) => void;
  isVotingEnabled?: boolean;
  hasVoted?: boolean;
  showVotes?: boolean;
  isSelected?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onVote,
  isVotingEnabled = false,
  hasVoted = false,
  showVotes = false,
  isSelected = false,
}) => {
  return (
    <Card 
      className={`candidate-card h-100 ${isSelected ? 'selected' : ''}`}
      style={{ 
        transition: 'all 0.3s ease',
        border: isSelected ? '3px solid #f4d03f' : '1px solid #dee2e6'
      }}
    >
      <Card.Body className="d-flex flex-column align-items-center text-center p-4">
        {/* Avatar con badge de selección */}
        <div className="position-relative mb-3">
          <div 
            className="candidate-avatar shadow-sm"
            style={{
              border: isSelected ? '4px solid #f4d03f' : '4px solid #e9ecef',
              transition: 'all 0.3s ease'
            }}
          >
            {candidate.fotoUrl ? (
              <img 
                src={candidate.fotoUrl} 
                alt={candidate.nombre}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  borderRadius: '50%' 
                }}
              />
            ) : (
              <span style={{ fontSize: '2.5rem' }}>{getInitials(candidate.nombre)}</span>
            )}
          </div>
          
          {isSelected && (
            <div 
              className="position-absolute top-0 end-0 bg-yellow rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '35px', height: '35px' }}
            >
              <i className="bi bi-check-circle-fill text-navy fs-4"></i>
            </div>
          )}
        </div>
        
        {/* Nombre del candidato */}
        <h5 className="candidate-name mb-2 fw-bold text-navy">{candidate.nombre}</h5>
        
        {/* Descripción/Propuesta */}
        <div className="flex-grow-1 mb-3" style={{ minHeight: '60px' }}>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            {candidate.descripcion}
          </p>
        </div>
        
        {/* Contador de votos */}
        {showVotes && (
          <div className="mb-3 w-100">
            <div className="d-flex align-items-center justify-content-center gap-2 p-3 bg-light rounded-3">
              <i className="bi bi-trophy-fill text-warning fs-4"></i>
              <div className="d-flex flex-column align-items-start">
                <span className="text-muted small">Total de votos</span>
                <span className="fw-bold fs-5 text-navy">{candidate.votos}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Botón de votación */}
        {isVotingEnabled && onVote && !hasVoted && (
          <Button 
            variant="navy" 
            className="w-100 py-2 fw-bold"
            onClick={() => onVote(candidate._id)}
            style={{ 
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="bi bi-hand-thumbs-up-fill me-2"></i>
            Votar por este candidato
          </Button>
        )}
        
        {/* Estado de voto realizado */}
        {hasVoted && (
          <div className="w-100">
            <div className="alert alert-success mb-0 py-3 d-flex align-items-center justify-content-center" role="alert">
              <i className="bi bi-check-circle-fill me-2 fs-5"></i>
              <span className="fw-bold">¡Tu voto fue registrado!</span>
            </div>
          </div>
        )}
        
        {/* Estado cuando no puede votar pero ve resultados */}
        {!isVotingEnabled && !hasVoted && !showVotes && (
          <div className="w-100">
            <Badge bg="secondary" className="w-100 py-2 text-wrap" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-lock-fill me-1"></i>
              Votación no disponible
            </Badge>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CandidateCard;