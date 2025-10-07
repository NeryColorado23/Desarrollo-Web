// src/pages/AdminDashboard.tsx (VERSIÓN COMPLETA)
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
  Badge
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
      <div className="spinner-custom">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="dashboard-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h1>
              <i className="bi bi-gear-fill me-3"></i>
              Panel de Administración
            </h1>
            <p className="mb-0 mt-2">Gestión de campañas y votaciones</p>
          </Col>
          <Col xs="auto">
            <Button variant="success" onClick={handleGenerateReport}>
              <i className="bi bi-file-earmark-bar-graph me-2"></i>
              Generar Reporte
            </Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Row>
        <Col lg={5}>
          <Card className="card-custom mb-4">
            <Card.Header className="bg-navy text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-trophy me-2"></i>
                Campañas ({campaigns.length})
              </h5>
              <Button size="sm" variant="yellow" onClick={openCreateCampaignModal}>
                <i className="bi bi-plus-lg me-1"></i>
                Nueva
              </Button>
            </Card.Header>
            <Card.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {campaigns.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox display-4 text-muted"></i>
                  <p className="text-muted mt-2">No hay campañas creadas</p>
                </div>
              ) : (
                <div className="list-group">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign._id}
                      className={`list-group-item list-group-item-action ${
                        selectedCampaign?._id === campaign._id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedCampaign(campaign)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{campaign.titulo}</h6>
                          <small>{campaign.descripcion.substring(0, 60)}...</small>
                          <div className="mt-2">
                            {campaign.estado === 'activa' && (
                              <Badge bg="success" className="me-1">Activa</Badge>
                            )}
                            {campaign.estado === 'finalizada' && (
                              <Badge bg="danger" className="me-1">Finalizada</Badge>
                            )}
                            {campaign.estado === 'inactiva' && (
                              <Badge bg="secondary" className="me-1">Inactiva</Badge>
                            )}
                            {campaign.habilitadaVotacion && (
                              <Badge bg="primary">Votación ON</Badge>
                            )}
                          </div>
                        </div>
                        <div className="ms-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditCampaignModal(campaign);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant={campaign.habilitadaVotacion ? 'warning' : 'success'}
                            className="me-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVoting(campaign._id);
                            }}
                          >
                            <i className={`bi bi-${campaign.habilitadaVotacion ? 'pause' : 'play'}-fill`}></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCampaign(campaign._id);
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          {selectedCampaign ? (
            <Card className="card-custom">
              <Card.Header className="bg-navy text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  Candidatos - {selectedCampaign.titulo}
                </h5>
                <Button size="sm" variant="yellow" onClick={openCreateCandidateModal}>
                  <i className="bi bi-plus-lg me-1"></i>
                  Agregar
                </Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {candidates.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-person-x display-4 text-muted"></i>
                    <p className="text-muted mt-2">No hay candidatos en esta campaña</p>
                  </div>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th className="text-center">Votos</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate, index) => (
                        <tr key={candidate._id}>
                          <td>{index + 1}</td>
                          <td><strong>{candidate.nombre}</strong></td>
                          <td>{candidate.descripcion.substring(0, 50)}...</td>
                          <td className="text-center">
                            <Badge bg="primary">{candidate.votos}</Badge>
                          </td>
                          <td className="text-center">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-1"
                              onClick={() => openEditCandidateModal(candidate)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDeleteCandidate(candidate._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card className="card-custom">
              <Card.Body className="text-center py-5">
                <i className="bi bi-arrow-left display-1 text-muted"></i>
                <h4 className="text-muted mt-3">Selecciona una campaña</h4>
                <p className="text-muted">Selecciona una campaña de la izquierda para ver y gestionar sus candidatos</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Modal de Campaña */}
      <Modal show={showCampaignModal} onHide={() => setShowCampaignModal(false)} size="lg">
        <Modal.Header closeButton className="bg-navy text-white">
          <Modal.Title>
            {editingCampaign ? 'Editar Campaña' : 'Nueva Campaña'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título de la Campaña</Form.Label>
              <Form.Control
                type="text"
                value={campaignForm.titulo}
                onChange={(e) => setCampaignForm({ ...campaignForm, titulo: e.target.value })}
                placeholder="Ej: Elecciones Junta Directiva 2025"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={campaignForm.descripcion}
                onChange={(e) => setCampaignForm({ ...campaignForm, descripcion: e.target.value })}
                placeholder="Describe la campaña..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad de Votos por Usuario</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={campaignForm.cantidadVotosPorUsuario}
                onChange={(e) => setCampaignForm({ ...campaignForm, cantidadVotosPorUsuario: parseInt(e.target.value) })}
                required
              />
              <Form.Text className="text-muted">
                Número de votos que cada usuario puede emitir en esta campaña
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={campaignForm.fechaInicio}
                    onChange={(e) => setCampaignForm({ ...campaignForm, fechaInicio: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={campaignForm.fechaFin}
                    onChange={(e) => setCampaignForm({ ...campaignForm, fechaFin: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCampaignModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="navy"
            onClick={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
          >
            {editingCampaign ? 'Actualizar' : 'Crear'} Campaña
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Candidato */}
      <Modal show={showCandidateModal} onHide={() => setShowCandidateModal(false)}>
        <Modal.Header closeButton className="bg-navy text-white">
          <Modal.Title>
            {editingCandidate ? 'Editar Candidato' : 'Nuevo Candidato'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Candidato</Form.Label>
              <Form.Control
                type="text"
                value={candidateForm.nombre}
                onChange={(e) => setCandidateForm({ ...candidateForm, nombre: e.target.value })}
                placeholder="Ej: Ing. Juan Pérez"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={candidateForm.descripcion}
                onChange={(e) => setCandidateForm({ ...candidateForm, descripcion: e.target.value })}
                placeholder="Experiencia, propuestas, etc..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de Foto (Opcional)</Form.Label>
              <Form.Control
                type="url"
                value={candidateForm.fotoUrl}
                onChange={(e) => setCandidateForm({ ...candidateForm, fotoUrl: e.target.value })}
                placeholder="https://ejemplo.com/foto.jpg"
              />
              <Form.Text className="text-muted">
                Si no se proporciona, se usarán las iniciales del nombre
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCandidateModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="navy"
            onClick={editingCandidate ? handleUpdateCandidate : handleCreateCandidate}
          >
            {editingCandidate ? 'Actualizar' : 'Agregar'} Candidato
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Reporte */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton className="bg-navy text-white">
          <Modal.Title>
            <i className="bi bi-file-earmark-bar-graph me-2"></i>
            Reporte General de Votaciones
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {report && (
            <>
              <div className="mb-4">
                <Row>
                  <Col md={4}>
                    <div className="stat-card yellow">
                      <div className="stat-number">{report.totalVotosGeneral}</div>
                      <div className="stat-label">Total de Votos</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="stat-card">
                      <div className="stat-number">{report.totalCampañas}</div>
                      <div className="stat-label">Total Campañas</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="stat-card success">
                      <div className="stat-number">
                        {report.campañas.filter((c: any) => c.estado === 'activa').length}
                      </div>
                      <div className="stat-label">Campañas Activas</div>
                    </div>
                  </Col>
                </Row>
              </div>

              <h5 className="text-navy mb-3">Detalle por Campaña</h5>
              {report.campañas.map((campaign: any) => (
                <Card key={campaign.campaignId} className="mb-3">
                  <Card.Header className="bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{campaign.titulo}</strong>
                      <Badge bg={
                        campaign.estado === 'activa' ? 'success' :
                        campaign.estado === 'finalizada' ? 'danger' : 'secondary'
                      }>
                        {campaign.estado}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted small mb-2">
                      {formatDate(campaign.fechaInicio)} - {formatDate(campaign.fechaFin)}
                    </p>
                    <div className="mb-3">
                      <strong>Total de votos: </strong>
                      <Badge bg="primary">{campaign.totalVotos}</Badge>
                    </div>
                    <Table size="sm" bordered>
                      <thead>
                        <tr>
                          <th>Candidato</th>
                          <th className="text-center">Votos</th>
                          <th className="text-center">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaign.candidatos.map((candidato: any, idx: number) => (
                          <tr key={idx}>
                            <td>{candidato.nombre}</td>
                            <td className="text-center">{candidato.votos}</td>
                            <td className="text-center">
                              <strong>{candidato.porcentaje}%</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleDownloadReport}>
            <i className="bi bi-download me-2"></i>
            Descargar JSON
          </Button>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;