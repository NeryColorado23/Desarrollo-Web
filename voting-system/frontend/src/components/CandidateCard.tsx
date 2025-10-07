// src/components/CandidateCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
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
    <Card className={`candidate-card ${isSelected ? 'selected' : ''}`}>
      <Card.Body>
        <div className="candidate-avatar">
          {candidate.fotoUrl ? (
            <img 
              src={candidate.fotoUrl} 
              alt={candidate.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            getInitials(candidate.nombre)
          )}
        </div>
        
        <h5 className="candidate-name">{candidate.nombre}</h5>
        
        <p className="text-muted small mb-3">{candidate.descripcion}</p>
        
        {showVotes && (
          <div className="candidate-votes mb-3">
            <i className="bi bi-trophy-fill me-2"></i>
            {candidate.votos} votos
          </div>
        )}
        
        {isVotingEnabled && onVote && !hasVoted && (
          <Button 
            variant="navy" 
            className="w-100"
            onClick={() => onVote(candidate._id)}
          >
            <i className="bi bi-check-circle me-2"></i>
            Votar
          </Button>
        )}
        
        {hasVoted && (
          <Button variant="success" className="w-100" disabled>
            <i className="bi bi-check-circle-fill me-2"></i>
            Ya votaste por este candidato
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CandidateCard;