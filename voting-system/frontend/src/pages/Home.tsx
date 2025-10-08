// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { campaignAPI } from '../services/api';
import type { Campaign } from '../types';
import CampaignCard from '../components/CampaignCard';
import { handleAPIError } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'activa' | 'finalizada' | 'inactiva'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, filterStatus, searchTerm]);

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

  const filterCampaigns = (): void => {
    let filtered = campaigns;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.estado === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
  };

  const handleCampaignClick = (campaignId: string): void => {
    navigate(`/campaign/${campaignId}`);
  };

  const getStatusCounts = () => {
    return {
      all: campaigns.length,
      activa: campaigns.filter(c => c.estado === 'activa').length,
      finalizada: campaigns.filter(c => c.estado === 'finalizada').length,
      inactiva: campaigns.filter(c => c.estado === 'inactiva').length,
    };
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
          <h5 className="text-navy fw-bold">Cargando campañas...</h5>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Hero Header mejorado */}
        <Card className="border-0 shadow-sm mb-4" style={{ 
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
          color: 'white'
        }}>
          <Card.Body className="p-4 p-md-5">
            <Row className="align-items-center">
              <Col lg={8}>
                <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                  <div 
                    className="d-flex align-items-center justify-content-center bg-yellow rounded-circle"
                    style={{ width: '70px', height: '70px', minWidth: '70px' }}
                  >
                    <i className="bi bi-trophy-fill text-navy" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                  <div>
                    <h1 className="mb-2 fw-bold" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                      Campañas de Votación
                    </h1>
                    <p className="mb-0 opacity-75" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                      <i className="bi bi-building me-2"></i>
                      Colegio de Ingenieros de Guatemala
                    </p>
                  </div>
                </div>
                {isAuthenticated && (
                  <Alert variant="light" className="mb-0 mt-3 d-inline-flex align-items-center gap-2">
                    <i className="bi bi-person-circle text-primary fs-5"></i>
                    <span>
                      Bienvenido, <strong>{user?.nombreCompleto}</strong>
                    </span>
                  </Alert>
                )}
              </Col>
              <Col lg={4} className="text-lg-end mt-4 mt-lg-0">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-lg-end justify-content-center gap-3">
                    <div className="text-center">
                      <div className="display-4 fw-bold">{campaigns.length}</div>
                      <small className="text-uppercase opacity-75" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                        Campañas Totales
                      </small>
                    </div>
                    <div className="vr d-none d-lg-block" style={{ height: '60px', opacity: 0.3 }}></div>
                    <div className="text-center">
                      <div className="display-4 fw-bold text-success">{statusCounts.activa}</div>
                      <small className="text-uppercase opacity-75" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                        Activas
                      </small>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Alert de error */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        {/* Filtros y búsqueda */}
        {campaigns.length > 0 && (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-3 p-md-4">
              <Row className="align-items-center g-3">
                {/* Búsqueda */}
                <Col lg={6}>
                  <InputGroup size="lg">
                    <InputGroup.Text className="bg-white">
                      <i className="bi bi-search text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Buscar campañas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-start-0"
                    />
                    {searchTerm && (
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    )}
                  </InputGroup>
                </Col>

                {/* Filtros por estado */}
                <Col lg={6}>
                  <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                    <Button
                      size="sm"
                      variant={filterStatus === 'all' ? 'navy' : 'outline-secondary'}
                      onClick={() => setFilterStatus('all')}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-grid-fill"></i>
                      <span className="d-none d-sm-inline">Todas</span>
                      <Badge bg={filterStatus === 'all' ? 'yellow' : 'light'} text="dark">
                        {statusCounts.all}
                      </Badge>
                    </Button>
                    <Button
                      size="sm"
                      variant={filterStatus === 'activa' ? 'success' : 'outline-success'}
                      onClick={() => setFilterStatus('activa')}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-check-circle-fill"></i>
                      <span className="d-none d-sm-inline">Activas</span>
                      <Badge bg="light" text="dark">
                        {statusCounts.activa}
                      </Badge>
                    </Button>
                    <Button
                      size="sm"
                      variant={filterStatus === 'finalizada' ? 'danger' : 'outline-danger'}
                      onClick={() => setFilterStatus('finalizada')}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-x-circle-fill"></i>
                      <span className="d-none d-sm-inline">Finalizadas</span>
                      <Badge bg="light" text="dark">
                        {statusCounts.finalizada}
                      </Badge>
                    </Button>
                    <Button
                      size="sm"
                      variant={filterStatus === 'inactiva' ? 'secondary' : 'outline-secondary'}
                      onClick={() => setFilterStatus('inactiva')}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-pause-circle-fill"></i>
                      <span className="d-none d-sm-inline">Inactivas</span>
                      <Badge bg="light" text="dark">
                        {statusCounts.inactiva}
                      </Badge>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Lista de campañas */}
        {filteredCampaigns.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="empty-state">
                <i className="bi bi-inbox display-1 text-muted mb-4"></i>
                <h3 className="empty-title text-navy fw-bold mb-2">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No se encontraron campañas' 
                    : 'No hay campañas disponibles'}
                </h3>
                <p className="empty-description mb-4">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Intenta cambiar los filtros o la búsqueda para ver más resultados.'
                    : 'Actualmente no hay campañas de votación disponibles.'}
                </p>
                {(searchTerm || filterStatus !== 'all') && (
                  <Button 
                    variant="navy" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                  >
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    Limpiar Filtros
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ) : (
          <>
            {/* Header de resultados */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <h4 className="text-navy mb-0 fw-bold">
                <i className="bi bi-list-check me-2"></i>
                {filterStatus === 'all' ? 'Todas las Campañas' : 
                 filterStatus === 'activa' ? 'Campañas Activas' :
                 filterStatus === 'finalizada' ? 'Campañas Finalizadas' :
                 'Campañas Inactivas'}
              </h4>
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                {filteredCampaigns.length} resultado{filteredCampaigns.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {/* Grid de campañas */}
            <Row className="g-4">
              {filteredCampaigns.map((campaign) => (
                <Col key={campaign._id} xs={12} md={6} lg={4}>
                  <CampaignCard
                    campaign={campaign}
                    onClick={() => handleCampaignClick(campaign._id)}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Footer informativo */}
        {campaigns.length > 0 && (
          <Card className="border-0 shadow-sm mt-5 bg-light">
            <Card.Body className="p-4">
              <Row className="g-4">
                <Col md={4}>
                  <div className="text-center">
                    <i className="bi bi-shield-check text-primary display-4 mb-3"></i>
                    <h6 className="fw-bold text-navy mb-2">Votación Segura</h6>
                    <p className="text-muted small mb-0">
                      Tu voto es confidencial y está protegido por nuestro sistema
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <i className="bi bi-clock-history text-success display-4 mb-3"></i>
                    <h6 className="fw-bold text-navy mb-2">Vota a Tiempo</h6>
                    <p className="text-muted small mb-0">
                      Verifica las fechas límite de cada campaña antes de votar
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <i className="bi bi-graph-up-arrow text-warning display-4 mb-3"></i>
                    <h6 className="fw-bold text-navy mb-2">Resultados en Tiempo Real</h6>
                    <p className="text-muted small mb-0">
                      Observa los resultados actualizados de las votaciones
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default Home;