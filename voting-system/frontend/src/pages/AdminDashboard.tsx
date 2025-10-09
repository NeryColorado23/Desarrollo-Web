// src/pages/AdminDashboard.tsx (VERSIÓN COMPLETA CON DISEÑO MEJORADO)
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Card, 
  Modal, 
  Form, 
  Alert,
  Table,
  Badge,
  OverlayTrigger,
  Tooltip,
  ProgressBar
} from 'react-bootstrap';
import { campaignAPI, voteAPI } from '../services/api';
import { 
  Campaign, 
  CampaignFormData, 
  CandidateFormData, 
  Candidate 
} from '../types';
import { formatDate, handleAPIError, downloadJSON } from '../utils/helpers';

const AdminDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const [campaignForm, setCampaignForm] = useState<CampaignFormData>({
    titulo: '',
    descripcion: '',
    cantidadVotosPorUsuario: 1,
    fechaInicio: '',
    fechaFin: '',
  });
  
  const [candidateForm, setCandidateForm] = useState<CandidateFormData>({
    nombre: '',
    descripcion: '',
    fotoUrl: '',
  });
  
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      fetchCandidates(selectedCampaign._id);
    }
  }, [selectedCampaign]);

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

  const fetchCandidates = async (campaignId: string): Promise<void> => {
    try {
      const response = await campaignAPI.getById(campaignId);
      setCandidates(response.candidates);
    } catch (err: any) {
      setError(handleAPIError(err));
    }
  };

  const handleCreateCampaign = async (): Promise<void> => {
    try {
      setError('');
      await campaignAPI.create(campaignForm);
      setSuccess('Campaña creada exitosamente');
      setShowCampaignModal(false);
      resetCampaignForm();
      fetchCampaigns();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(handleAPIError(err));
    }
  };

  const handleUpdateCampaign = async (): Promise<void> => {
    if (!editingCampaign) return;
    
    try {
      setError('');
      await campaignAPI.update(editingCampaign._id, campaignForm);
      setSuccess('Campaña actualizada exitosamente');
      setShowCampaignModal(false);
      setEditingCampaign(null);
      resetCampaignForm();
      fetchCampaigns();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(handleAPIError(err));
    }
  };

  const handleDeleteCampaign = async (campaignId: string): Promise<void> => {
    if (window.confirm('¿Estás seguro de eliminar esta campaña? Esta acción no se puede deshacer.')) {
      try {
        setError('');
        await campaignAPI.delete(campaignId);
        setSuccess('Campaña eliminada exitosamente');
        fetchCampaigns();
        if (selectedCampaign?._id === campaignId) {
          setSelectedCampaign(null);
        }
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(handleAPIError(err));
      }
    }
  };

  const handleToggleVoting = async (campaignId: string): Promise<void> => {
    try {
      setError('');
      await campaignAPI.toggleVoting(campaignId);
      setSuccess('Estado de votación actualizado');
      fetchCampaigns();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(handleAPIError(err));
    }
  };

  const handleCreateCandidate = async (): Promise<void> => {
    if (!selectedCampaign) return;
    
    try {
      setError('');
      await campaignAPI.addCandidate(selectedCampaign._id, candidateForm);
      setSuccess('Candidato agregado exitosamente');
      setShowCandidateModal(false);
      resetCandidateForm();
      fetchCandidates(selectedCampaign._id);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(handleAPIError(err));
    }
  };

  const handleUpdateCandidate = async (): Promise<void> => {
    if (!selectedCampaign || !editingCandidate) return;
    
    try {
      setError('');
      await campaignAPI.updateCandidate(
        selectedCampaign._id,
        editingCandidate._id,
        candidateForm
      );
      setSuccess('Candidato actualizado exitosamente');
      setShowCandidateModal(false);
      setEditingCandidate(null);
      resetCandidateForm();
      fetchCandidates(selectedCampaign._id);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(handleAPIError(err));
    }
  };

  const handleDeleteCandidate = async (candidateId: string): Promise<void> => {
    if (!selectedCampaign) return;
    
    if (window.confirm('¿Estás seguro de eliminar este candidato?')) {
      try {
        setError('');
        await campaignAPI.deleteCandidate(selectedCampaign._id, candidateId);
        setSuccess('Candidato eliminado exitosamente');
        fetchCandidates(selectedCampaign._id);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(handleAPIError(err));
      }
    }
  };

  const handleGenerateReport = async (): Promise<void> => {
    try {
      setError('');
      const response = await voteAPI.getReport();
      setReport(response);
      setShowReportModal(true);
    } catch (err: any) {
      setError(handleAPIError(err));
    }
  };

  const handleDownloadReport = (): void => {
    if (report) {
      downloadJSON(report, `reporte-votacion-${new Date().toISOString()}`);
    }
  };

  const openCreateCampaignModal = (): void => {
    resetCampaignForm();
    setEditingCampaign(null);
    setShowCampaignModal(true);
  };

  const openEditCampaignModal = (campaign: Campaign): void => {
    setEditingCampaign(campaign);
    setCampaignForm({
      titulo: campaign.titulo,
      descripcion: campaign.descripcion,
      cantidadVotosPorUsuario: campaign.cantidadVotosPorUsuario,
      fechaInicio: new Date(campaign.fechaInicio).toISOString().split('T')[0],
      fechaFin: new Date(campaign.fechaFin).toISOString().split('T')[0],
    });
    setShowCampaignModal(true);
  };

  const openCreateCandidateModal = (): void => {
    if (!selectedCampaign) {
      alert('Selecciona una campaña primero');
      return;
    }
    resetCandidateForm();
    setEditingCandidate(null);
    setShowCandidateModal(true);
  };

  const openEditCandidateModal = (candidate: Candidate): void => {
    setEditingCandidate(candidate);
    setCandidateForm({
      nombre: candidate.nombre,
      descripcion: candidate.descripcion,
      fotoUrl: candidate.fotoUrl || '',
    });
    setShowCandidateModal(true);
  };

  const resetCampaignForm = (): void => {
    setCampaignForm({
      titulo: '',
      descripcion: '',
      cantidadVotosPorUsuario: 1,
      fechaInicio: '',
      fechaFin: '',
    });
  };

  const resetCandidateForm = (): void => {
    setCandidateForm({
      nombre: '',
      descripcion: '',
      fotoUrl: '',
    });
  };

  if (loading) {
    return (
      <div 
        className="d-flex flex-column justify-content-center align-items-center ms-5" 
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
          <h4 className="text-navy fw-bold">Cargando Panel de Administración...</h4>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-5 px-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header mejorado */}
      <Card className="dashboard-header mb-4 border-0 shadow">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center bg-navy rounded-circle"
                  style={{ width: '70px', height: '70px', minWidth: '70px' }}
                >
                  <i className="bi bi-gear-fill text-white" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h1 className="mb-2 fw-bold text-white" style={{ fontSize: '2rem' }}>Panel de Administración</h1>
                  <p className="mb-0 text-muted" style={{ fontSize: '1.1rem' }}>
                    <i className="bi bi-shield-check me-2"></i>
                    Gestión completa de campañas y votaciones
                  </p>
                </div>
              </div>
            </Col>
            <Col xs="auto">
              <Button 
                variant="success" 
                size="lg"
                onClick={handleGenerateReport}
                className="fw-bold shadow"
                style={{ fontSize: '1.1rem', padding: '12px 30px' }}
              >
                <i className="bi bi-file-earmark-bar-graph-fill me-2"></i>
                Generar Reporte Completo
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Alertas mejoradas */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm mb-4" style={{ fontSize: '1.05rem' }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')} className="shadow-sm mb-4" style={{ fontSize: '1.05rem' }}>
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
        </Alert>
      )}

      <Row className="g-4">
        {/* Columna de Campañas */}
        <Col lg={5}>
          <Card className="shadow border-0 h-100">
            <Card.Header className="bg-navy text-white p-4">
              <div className="d-flex justify-content-between align-items-center ms-5">
                <h4 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>
                  <i className="bi bi-trophy-fill me-2"></i>
                  <span style={{ color: 'white' }}>Campañas</span>
                  <Badge bg="yellow" text="dark" className="ms-3" style={{ fontSize: '1rem', padding: '8px 15px' }}>
                    {campaigns.length}
                  </Badge>
                </h4>

                <Button 
                  size="lg" 
                  variant="yellow" 
                  onClick={openCreateCampaignModal}
                  className="fw-bold shadow"
                  style={{ fontSize: '1rem', padding: '10px 25px'}}
                >
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Nueva Campaña
                </Button>
              </div>
            </Card.Header>
            <Card.Body style={{ maxHeight: '75vh', overflowY: 'auto' }} className="p-4">
              {campaigns.length === 0 ? (
                <div className="empty-state py-5">
                  <div className="text-center">
                    <i className="bi bi-inbox text-muted mb-4" style={{ fontSize: '5rem' }}></i>
                    <h4 className="text-muted fw-bold mb-3" style={{ fontSize: '1.5rem' }}>No hay campañas creadas</h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>Comienza creando tu primera campaña</p>
                    <Button variant="navy" size="lg" onClick={openCreateCampaignModal} style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
                      <i className="bi bi-plus-lg me-2"></i>
                      Crear Primera Campaña
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {campaigns.map((campaign) => (
                    <Card
                      key={campaign._id}
                      className={`border-0 shadow-sm ${
                        selectedCampaign?._id === campaign._id ? 'border-start border-warning border-5' : ''
                      }`}
                      onClick={() => setSelectedCampaign(campaign)}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: selectedCampaign?._id === campaign._id ? '#fff9e6' : 'white'
                      }}
                    >
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1">
                            <h5 className="mb-2 fw-bold text-navy" style={{ fontSize: '1.3rem' }}>{campaign.titulo}</h5>
                            <p className="text-muted mb-3" style={{ fontSize: '1rem', lineHeight: '1.6' }}>{campaign.descripcion.substring(0, 100)}...</p>
                            <div className="d-flex flex-wrap gap-2">
                              {campaign.estado === 'activa' && (
                                <Badge bg="success" style={{ fontSize: '0.95rem', padding: '8px 15px' }}>
                                  <i className="bi bi-check-circle-fill me-2"></i>
                                  Activa
                                </Badge>
                              )}
                              {campaign.estado === 'finalizada' && (
                                <Badge bg="danger" style={{ fontSize: '0.95rem', padding: '8px 15px' }}>
                                  <i className="bi bi-x-circle-fill me-2"></i>
                                  Finalizada
                                </Badge>
                              )}
                              {campaign.estado === 'inactiva' && (
                                <Badge bg="secondary" style={{ fontSize: '0.95rem', padding: '8px 15px' }}>
                                  <i className="bi bi-pause-circle-fill me-2"></i>
                                  Inactiva
                                </Badge>
                              )}
                              {campaign.habilitadaVotacion && (
                                <Badge bg="primary" style={{ fontSize: '0.95rem', padding: '8px 15px' }}>
                                  <i className="bi bi-box-arrow-in-right me-2"></i>
                                  Votación Habilitada
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2 pt-3 border-top">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Editar campaña</Tooltip>}
                          >
                            <Button
                              size="lg"
                              variant="outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditCampaignModal(campaign);
                              }}
                              style={{ fontSize: '1rem', padding: '10px 20px' }}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                          </OverlayTrigger>
                          
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{campaign.habilitadaVotacion ? 'Pausar votación' : 'Activar votación'}</Tooltip>}
                          >
                            <Button
                              size="lg"
                              variant={campaign.habilitadaVotacion ? 'warning' : 'success'}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleVoting(campaign._id);
                              }}
                              style={{ fontSize: '1rem', padding: '10px 20px' }}
                            >
                              <i className={`bi bi-${campaign.habilitadaVotacion ? 'pause' : 'play'}-circle-fill`}></i>
                            </Button>
                          </OverlayTrigger>
                          
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Eliminar campaña</Tooltip>}
                          >
                            <Button
                              size="lg"
                              variant="outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCampaign(campaign._id);
                              }}
                              style={{ fontSize: '1rem', padding: '10px 20px' }}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Columna de Candidatos */}
        <Col lg={7}>
          {selectedCampaign ? (
            <Card className="shadow border-0">
              <Card.Header className="bg-navy text-white p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-2 fw-bold" style={{ fontSize: '1.5rem' }}>
                      <i className="bi bi-people-fill me-2"></i>
                      Candidatos
                    </h4>
                    <p className="mb-0 opacity-75" style={{ fontSize: '1.05rem' }}>{selectedCampaign.titulo}</p>
                  </div>
                  <Button 
                    size="lg" 
                    variant="yellow" 
                    onClick={openCreateCandidateModal}
                    className="fw-bold shadow"
                    style={{ fontSize: '1rem', padding: '10px 25px' }}
                  >
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Agregar Candidato
                  </Button>
                </div>
              </Card.Header>
              <Card.Body style={{ maxHeight: '75vh', overflowY: 'auto' }} className="p-4">
                {candidates.length === 0 ? (
                  <div className="empty-state py-5">
                    <div className="text-center">
                      <i className="bi bi-person-x text-muted mb-4" style={{ fontSize: '5rem' }}></i>
                      <h4 className="text-muted fw-bold mb-3" style={{ fontSize: '1.5rem' }}>No hay candidatos</h4>
                      <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>Agrega candidatos a esta campaña</p>
                      <Button variant="navy" size="lg" onClick={openCreateCandidateModal} style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Agregar Primer Candidato
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0" style={{ fontSize: '1.05rem' }}>
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '70px', fontSize: '1.1rem', padding: '15px' }} className="text-center">#</th>
                          <th style={{ fontSize: '1.1rem', padding: '15px' }}>Nombre</th>
                          <th style={{ fontSize: '1.1rem', padding: '15px' }}>Propuesta</th>
                          <th className="text-center" style={{ width: '120px', fontSize: '1.1rem', padding: '15px' }}>
                            <i className="bi bi-trophy-fill me-2"></i>
                            Votos
                          </th>
                          <th className="text-center" style={{ width: '180px', fontSize: '1.1rem', padding: '15px' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((candidate, index) => (
                          <tr key={candidate._id}>
                            <td className="text-center" style={{ padding: '20px' }}>
                              {index === 0 && candidate.votos > 0 ? (
                                <i className="bi bi-trophy-fill text-warning" style={{ fontSize: '1.8rem' }}></i>
                              ) : (
                                <span className="fw-bold text-muted" style={{ fontSize: '1.2rem' }}>{index + 1}</span>
                              )}
                            </td>
                            <td style={{ padding: '20px' }}>
                              <div className="d-flex align-items-center gap-3">
                                {candidate.fotoUrl ? (
                                  <img 
                                    src={candidate.fotoUrl} 
                                    alt={candidate.nombre}
                                    className="rounded-circle"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div 
                                    className="rounded-circle bg-navy text-white d-flex align-items-center justify-content-center fw-bold"
                                    style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}
                                  >
                                    {candidate.nombre.charAt(0)}
                                  </div>
                                )}
                                <strong style={{ fontSize: '1.1rem' }}>{candidate.nombre}</strong>
                              </div>
                            </td>
                            <td style={{ padding: '20px' }}>
                              <span className="text-muted" style={{ fontSize: '1rem' }}>
                                {candidate.descripcion.substring(0, 60)}...
                              </span>
                            </td>
                            <td className="text-center" style={{ padding: '20px' }}>
                              <Badge bg="primary" style={{ fontSize: '1.1rem', padding: '10px 20px' }}>
                                {candidate.votos}
                              </Badge>
                            </td>
                            <td className="text-center" style={{ padding: '20px' }}>
                              <div className="d-flex gap-2 justify-content-center">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Editar candidato</Tooltip>}
                                >
                                  <Button
                                    size="lg"
                                    variant="outline-primary"
                                    onClick={() => openEditCandidateModal(candidate)}
                                    style={{ fontSize: '1rem', padding: '10px 18px' }}
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </Button>
                                </OverlayTrigger>
                                
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Eliminar candidato</Tooltip>}
                                >
                                  <Button
                                    size="lg"
                                    variant="outline-danger"
                                    onClick={() => handleDeleteCandidate(candidate._id)}
                                    style={{ fontSize: '1rem', padding: '10px 18px' }}
                                  >
                                    <i className="bi bi-trash3-fill"></i>
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow border-0" style={{ height: '100%' }}>
              <Card.Body className="d-flex align-items-center justify-content-center" style={{ minHeight: '600px' }}>
                <div className="text-center">
                  <i className="bi bi-arrow-left-circle text-muted mb-4" style={{ fontSize: '6rem' }}></i>
                  <h3 className="text-navy fw-bold mb-3" style={{ fontSize: '2rem' }}>Selecciona una campaña</h3>
                  <p className="text-muted mb-0" style={{ fontSize: '1.2rem' }}>
                    Elige una campaña de la izquierda para ver y gestionar sus candidatos
                  </p>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Modal de Campaña */}
      <Modal show={showCampaignModal} onHide={() => setShowCampaignModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-navy text-white p-4">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.5rem' }}>
            <i className="bi bi-trophy-fill me-2"></i>
            {editingCampaign ? 'Editar Campaña' : 'Nueva Campaña'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-card-heading me-2"></i>
                Título de la Campaña
              </Form.Label>
              <Form.Control
                type="text"
                value={campaignForm.titulo}
                onChange={(e) => setCampaignForm({ ...campaignForm, titulo: e.target.value })}
                placeholder="Ej: Elecciones Junta Directiva 2025"
                className="form-control-lg"
                style={{ fontSize: '1.05rem', padding: '12px 20px' }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-card-text me-2"></i>
                Descripción
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={campaignForm.descripcion}
                onChange={(e) => setCampaignForm({ ...campaignForm, descripcion: e.target.value })}
                placeholder="Describe la campaña y sus objetivos..."
                style={{ fontSize: '1.05rem', padding: '12px 20px' }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-123 me-2"></i>
                Cantidad de Votos por Usuario
              </Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={campaignForm.cantidadVotosPorUsuario}
                onChange={(e) => setCampaignForm({ ...campaignForm, cantidadVotosPorUsuario: parseInt(e.target.value) })}
                className="form-control-lg"
                style={{ fontSize: '1.05rem', padding: '12px 20px' }}
                required
              />
              <Form.Text className="text-muted" style={{ fontSize: '1rem' }}>
                <i className="bi bi-info-circle me-1"></i>
                Número de votos que cada usuario puede emitir en esta campaña
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                    <i className="bi bi-calendar-check me-2"></i>
                    Fecha de Inicio
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={campaignForm.fechaInicio}
                    onChange={(e) => setCampaignForm({ ...campaignForm, fechaInicio: e.target.value })}
                    className="form-control-lg"
                    style={{ fontSize: '1.05rem', padding: '12px 20px' }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                    <i className="bi bi-calendar-x me-2"></i>
                    Fecha de Fin
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={campaignForm.fechaFin}
                    onChange={(e) => setCampaignForm({ ...campaignForm, fechaFin: e.target.value })}
                    className="form-control-lg"
                    style={{ fontSize: '1.05rem', padding: '12px 20px' }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light p-4">
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => setShowCampaignModal(false)} 
            style={{ fontSize: '1.05rem', padding: '10px 25px' }}
          >
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </Button>
          <Button 
            variant="navy"
            size="lg"
            onClick={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
            className="fw-bold"
            style={{ fontSize: '1.05rem', padding: '10px 25px' }}
          >
            <i className={`bi bi-${editingCampaign ? 'check' : 'plus'}-circle-fill me-2`}></i>
            {editingCampaign ? 'Actualizar' : 'Crear'} Campaña
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Candidato */}
      <Modal show={showCandidateModal} onHide={() => setShowCandidateModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-navy text-white p-4">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.5rem' }}>
            <i className="bi bi-person-fill me-2"></i>
            {editingCandidate ? 'Editar Candidato' : 'Nuevo Candidato'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-person-badge me-2"></i>
                Nombre del Candidato
              </Form.Label>
              <Form.Control
                type="text"
                value={candidateForm.nombre}
                onChange={(e) => setCandidateForm({ ...candidateForm, nombre: e.target.value })}
                placeholder="Ej: Ing. Juan Pérez"
                className="form-control-lg"
                style={{ fontSize: '1.05rem', padding: '12px 20px' }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-file-text me-2"></i>
                Propuesta / Descripción
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={candidateForm.descripcion}
                onChange={(e) => setCandidateForm({ ...candidateForm, descripcion: e.target.value })}
                placeholder="Experiencia profesional, propuestas, visión..."
                style={{ fontSize: '1.05rem', padding: '12px 20px' }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-image me-2"></i>
                URL de Foto (Opcional)
              </Form.Label>
              <Form.Control
                type="url"
                value={candidateForm.fotoUrl}
                onChange={(e) => setCandidateForm({ ...candidateForm, fotoUrl: e.target.value })}
                placeholder="https://ejemplo.com/foto.jpg"
                style={{ fontSize: '1.05rem', padding: '12px 20px' }}
              />
              <Form.Text className="text-muted" style={{ fontSize: '1rem' }}>
                <i className="bi bi-info-circle me-1"></i>
                Si no se proporciona, se usarán las iniciales del nombre
              </Form.Text>
              
              {candidateForm.fotoUrl && (
                <div className="mt-3 text-center">
                  <p className="text-muted mb-2" style={{ fontSize: '1rem' }}>Vista previa:</p>
                  <img 
                    src={candidateForm.fotoUrl} 
                    alt="Vista previa"
                    className="rounded-circle shadow-sm"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light p-4">
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => setShowCandidateModal(false)} 
            style={{ fontSize: '1.05rem', padding: '10px 25px' }}
          >
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </Button>
          <Button 
            variant="navy"
            size="lg"
            onClick={editingCandidate ? handleUpdateCandidate : handleCreateCandidate}
            className="fw-bold"
            style={{ fontSize: '1.05rem', padding: '10px 25px' }}
          >
            <i className={`bi bi-${editingCandidate ? 'check' : 'plus'}-circle-fill me-2`}></i>
            {editingCandidate ? 'Actualizar' : 'Agregar'} Candidato
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Reporte */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="xl" centered>
        <Modal.Header closeButton className="bg-navy text-white p-4">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.5rem' }}>
            <i className="bi bi-file-earmark-bar-graph-fill me-2"></i>
            Reporte General de Votaciones
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }} className="p-4">
          {report && (
            <>
              {/* Estadísticas generales */}
              <div className="mb-5">
                <h4 className="text-navy fw-bold mb-4" style={{ fontSize: '1.4rem' }}>
                  <i className="bi bi-graph-up me-2"></i>
                  Resumen General
                </h4>
                <Row className="g-4">
                  <Col md={4}>
                    <Card className="border-0 shadow h-100">
                      <Card.Body className="text-center p-4">
                        <div className="d-flex align-items-center justify-content-center gap-3">
                          <i className="bi bi-box-arrow-in-right text-warning" style={{ fontSize: '3.5rem' }}></i>
                          <div className="text-start">
                            <small className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>
                              Total de Votos
                            </small>
                            <h2 className="mb-0 fw-bold text-navy" style={{ fontSize: '2.5rem' }}>{report.totalVotosGeneral}</h2>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="border-0 shadow h-100">
                      <Card.Body className="text-center p-4">
                        <div className="d-flex align-items-center justify-content-center gap-3">
                          <i className="bi bi-trophy-fill text-primary" style={{ fontSize: '3.5rem' }}></i>
                          <div className="text-start">
                            <small className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>
                              Total Campañas
                            </small>
                            <h2 className="mb-0 fw-bold text-navy" style={{ fontSize: '2.5rem' }}>{report.totalCampañas}</h2>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="border-0 shadow h-100">
                      <Card.Body className="text-center p-4">
                        <div className="d-flex align-items-center justify-content-center gap-3">
                          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3.5rem' }}></i>
                          <div className="text-start">
                            <small className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>
                              Campañas Activas
                            </small>
                            <h2 className="mb-0 fw-bold text-navy" style={{ fontSize: '2.5rem' }}>
                              {report.campañas.filter((c: any) => c.estado === 'activa').length}
                            </h2>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Detalle por campaña */}
              <div>
                <h4 className="text-navy fw-bold mb-4" style={{ fontSize: '1.4rem' }}>
                  <i className="bi bi-list-task me-2"></i>
                  Detalle por Campaña
                </h4>
                <div className="d-flex flex-column gap-4">
                  {report.campañas.map((campaign: any) => (
                    <Card key={campaign.campaignId} className="border-0 shadow">
                      <Card.Header className="bg-light border-0 p-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-2 fw-bold text-navy" style={{ fontSize: '1.3rem' }}>{campaign.titulo}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                              <i className="bi bi-calendar-range me-2"></i>
                              {formatDate(campaign.fechaInicio)} - {formatDate(campaign.fechaFin)}
                            </p>
                          </div>
                          <div className="d-flex gap-2 align-items-center">
                            <Badge 
                              bg={
                                campaign.estado === 'activa' ? 'success' :
                                campaign.estado === 'finalizada' ? 'danger' : 'secondary'
                              }
                              style={{ fontSize: '1rem', padding: '10px 20px' }}
                            >
                              {campaign.estado}
                            </Badge>
                            <Badge bg="primary" style={{ fontSize: '1rem', padding: '10px 20px' }}>
                              <i className="bi bi-box-arrow-in-right me-2"></i>
                              {campaign.totalVotos} votos
                            </Badge>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body className="p-4">
                        {campaign.candidatos && campaign.candidatos.length > 0 ? (
                          <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '1.05rem' }}>
                              <thead className="table-light">
                                <tr>
                                  <th style={{ width: '70px', fontSize: '1.1rem', padding: '15px' }} className="text-center">#</th>
                                  <th style={{ fontSize: '1.1rem', padding: '15px' }}>Candidato</th>
                                  <th className="text-center" style={{ width: '120px', fontSize: '1.1rem', padding: '15px' }}>Votos</th>
                                  <th style={{ width: '350px', fontSize: '1.1rem', padding: '15px' }}>Distribución</th>
                                  <th className="text-center" style={{ width: '120px', fontSize: '1.1rem', padding: '15px' }}>Porcentaje</th>
                                </tr>
                              </thead>
                              <tbody>
                                {campaign.candidatos.map((candidato: any, idx: number) => {
                                  const porcentaje = parseFloat(candidato.porcentaje);
                                  return (
                                    <tr key={idx}>
                                      <td className="text-center" style={{ padding: '15px' }}>
                                        {idx === 0 && candidato.votos > 0 ? (
                                          <i className="bi bi-trophy-fill text-warning" style={{ fontSize: '1.8rem' }}></i>
                                        ) : (
                                          <span className="fw-bold text-muted" style={{ fontSize: '1.2rem' }}>{idx + 1}</span>
                                        )}
                                      </td>
                                      <td style={{ padding: '15px' }}>
                                        <strong style={{ fontSize: '1.1rem' }}>{candidato.nombre}</strong>
                                      </td>
                                      <td className="text-center" style={{ padding: '15px' }}>
                                        <Badge bg="light" text="dark" className="fw-bold" style={{ fontSize: '1.1rem', padding: '10px 18px' }}>
                                          {candidato.votos}
                                        </Badge>
                                      </td>
                                      <td style={{ padding: '15px' }}>
                                        <ProgressBar 
                                          now={porcentaje} 
                                          style={{ height: '30px' }}
                                          className="shadow-sm"
                                        >
                                          <ProgressBar 
                                            now={porcentaje}
                                            variant={idx === 0 ? 'warning' : 'primary'}
                                            label={<span style={{ fontSize: '1rem' }}>{porcentaje.toFixed(1)}%</span>}
                                          />
                                        </ProgressBar>
                                      </td>
                                      <td className="text-center" style={{ padding: '15px' }}>
                                        <strong className="text-navy" style={{ fontSize: '1.2rem' }}>
                                          {candidato.porcentaje}%
                                        </strong>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted">
                            <i className="bi bi-inbox me-2" style={{ fontSize: '1.5rem' }}></i>
                            <span style={{ fontSize: '1.1rem' }}>No hay candidatos registrados</span>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light p-4">
          <Button 
            variant="success" 
            size="lg"
            onClick={handleDownloadReport}
            className="fw-bold"
            style={{ fontSize: '1.05rem', padding: '10px 25px' }}
          >
            <i className="bi bi-download me-2"></i>
            Descargar JSON
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => setShowReportModal(false)}
            style={{ fontSize: '1.05rem', padding: '10px 25px' }}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;