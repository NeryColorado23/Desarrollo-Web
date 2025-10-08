// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, InputGroup, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { authAPI } from '../services/api';
import type { RegisterData } from '../types';
import { validateDPI, validateEmail, validateAge, handleAPIError } from '../utils/helpers';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    numeroColegiado: '',
    nombreCompleto: '',
    correoElectronico: '',
    dpi: '',
    fechaNacimiento: '',
    contraseña: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.numeroColegiado || !formData.nombreCompleto || !formData.correoElectronico || 
        !formData.dpi || !formData.fechaNacimiento || !formData.contraseña) {
      setError('Todos los campos son requeridos');
      return false;
    }

    if (!validateEmail(formData.correoElectronico)) {
      setError('El correo electrónico no es válido');
      return false;
    }

    if (!validateDPI(formData.dpi)) {
      setError('El DPI debe contener exactamente 13 dígitos');
      return false;
    }

    if (!validateAge(formData.fechaNacimiento)) {
      setError('Debes ser mayor de 18 años para registrarte');
      return false;
    }

    if (formData.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.contraseña !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await authAPI.register(formData);
      navigate('/login', { 
        state: { 
          message: '¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.' 
        } 
      });
    } catch (err: any) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  // Calcular fuerza de contraseña
  const getPasswordStrength = (): { strength: number; label: string; variant: string } => {
    const password = formData.contraseña;
    let strength = 0;
    
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    let label = 'Muy débil';
    let variant = 'danger';
    
    if (strength >= 25 && strength < 50) {
      label = 'Débil';
      variant = 'warning';
    } else if (strength >= 50 && strength < 75) {
      label = 'Media';
      variant = 'info';
    } else if (strength >= 75) {
      label = 'Fuerte';
      variant = 'success';
    }
    
    return { strength, label, variant };
  };

  const passwordStrength = getPasswordStrength();

  // Calcular progreso del formulario
  const formProgress = (): number => {
    const fields = [
      formData.numeroColegiado,
      formData.nombreCompleto,
      formData.correoElectronico,
      formData.dpi,
      formData.fechaNacimiento,
      formData.contraseña,
      confirmPassword
    ];
    const completed = fields.filter(field => field !== '').length;
    return (completed / fields.length) * 100;
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in shadow-lg" style={{ maxWidth: '650px' }}>
        {/* Logo mejorado */}
        <div 
          className="auth-logo shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #f4d03f 0%, #f0c419 100%)'
          }}
        >
          <i className="bi bi-person-plus-fill"></i>
        </div>
        
        {/* Título y subtítulo */}
        <h2 className="auth-title mb-2">Crear Cuenta Nueva</h2>
        <p className="auth-subtitle mb-3">Regístrate para participar en las votaciones del CIG</p>

        {/* Progreso del formulario */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted fw-semibold">Progreso del registro</small>
            <small className="text-navy fw-bold">{Math.round(formProgress())}%</small>
          </div>
          <ProgressBar 
            now={formProgress()} 
            variant="success"
            style={{ height: '8px' }}
          />
        </div>

        {/* Alerta de error mejorada */}
        {error && (
          <Alert variant="danger" className="mb-4 shadow-sm" dismissible onClose={() => setError('')}>
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          </Alert>
        )}

        {/* Formulario */}
        <Form onSubmit={handleSubmit} className="form-custom">
          {/* Información Personal */}
          <Card className="mb-4 border-0 bg-light">
            <Card.Body className="p-3">
              <h6 className="text-navy fw-bold mb-3">
                <i className="bi bi-person-circle me-2"></i>
                Información Personal
              </h6>

              <Row>
                {/* Número de Colegiado */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <i className="bi bi-person-badge me-1 text-navy"></i>
                      Número de Colegiado
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-hash text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="numeroColegiado"
                        value={formData.numeroColegiado}
                        onChange={handleChange}
                        placeholder="Ej: 12345"
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                {/* Nombre Completo */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <i className="bi bi-person-fill me-1 text-navy"></i>
                      Nombre Completo
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-person text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        placeholder="Juan Pérez García"
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              {/* Correo Electrónico */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">
                  <i className="bi bi-envelope-fill me-1 text-navy"></i>
                  Correo Electrónico
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <i className="bi bi-at text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="correoElectronico"
                    value={formData.correoElectronico}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Row>
                {/* DPI */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <i className="bi bi-card-text me-1 text-navy"></i>
                      DPI (13 dígitos)
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-credit-card text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="dpi"
                        value={formData.dpi}
                        onChange={handleChange}
                        placeholder="1234567890123"
                        maxLength={13}
                        required
                      />
                    </InputGroup>
                    <Form.Text className="text-muted small">
                      <i className="bi bi-info-circle me-1"></i>
                      Sin espacios ni guiones
                    </Form.Text>
                  </Form.Group>
                </Col>

                {/* Fecha de Nacimiento */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <i className="bi bi-calendar-event me-1 text-navy"></i>
                      Fecha de Nacimiento
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-calendar3 text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                    <Form.Text className="text-muted small">
                      <i className="bi bi-info-circle me-1"></i>
                      Debes ser mayor de 18 años
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Seguridad */}
          <Card className="mb-4 border-0 bg-light">
            <Card.Body className="p-3">
              <h6 className="text-navy fw-bold mb-3">
                <i className="bi bi-shield-lock me-2"></i>
                Seguridad de la Cuenta
              </h6>

              {/* Contraseña */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">
                  <i className="bi bi-lock-fill me-1 text-navy"></i>
                  Contraseña
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <i className="bi bi-key text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}></i>
                  </Button>
                </InputGroup>
                
                {/* Indicador de fuerza de contraseña */}
                {formData.contraseña && (
                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Fuerza de la contraseña:</small>
                      <small className={`fw-bold text-${passwordStrength.variant}`}>
                        {passwordStrength.label}
                      </small>
                    </div>
                    <ProgressBar 
                      now={passwordStrength.strength} 
                      variant={passwordStrength.variant}
                      style={{ height: '6px' }}
                    />
                  </div>
                )}
              </Form.Group>

              {/* Confirmar Contraseña */}
              <Form.Group className="mb-0">
                <Form.Label className="fw-semibold small">
                  <i className="bi bi-shield-check me-1 text-navy"></i>
                  Confirmar Contraseña
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <i className="bi bi-shield-lock text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}-fill`}></i>
                  </Button>
                </InputGroup>
                
                {/* Indicador de coincidencia */}
                {confirmPassword && (
                  <Form.Text className={formData.contraseña === confirmPassword ? 'text-success' : 'text-danger'}>
                    <i className={`bi bi-${formData.contraseña === confirmPassword ? 'check' : 'x'}-circle-fill me-1`}></i>
                    {formData.contraseña === confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                  </Form.Text>
                )}
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Botón de registro */}
          <Button
            type="submit"
            variant="navy"
            size="lg"
            className="w-100 mb-3 py-3 fw-bold shadow-sm"
            disabled={loading}
            style={{ fontSize: '1.1rem' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creando tu cuenta...
              </>
            ) : (
              <>
                <i className="bi bi-person-check-fill me-2"></i>
                Crear Mi Cuenta
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="position-relative my-4">
            <hr className="text-muted" />
            <span 
              className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted"
              style={{ fontSize: '0.9rem' }}
            >
              ¿Ya tienes cuenta?
            </span>
          </div>

          {/* Botón de login */}
          <Button
            variant="outline-navy"
            size="lg"
            className="w-100 py-3 fw-bold"
            onClick={() => navigate('/login')}
            disabled={loading}
            style={{ fontSize: '1.1rem' }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Iniciar Sesión
          </Button>
        </Form>

        {/* Footer informativo */}
        <Card className="mt-4 border-0 bg-light">
          <Card.Body className="p-3">
            <Row className="g-3">
              <Col xs={12}>
                <div className="d-flex align-items-start gap-2">
                  <i className="bi bi-shield-check text-success fs-5 mt-1"></i>
                  <div>
                    <small className="text-muted">
                      <strong className="text-navy">Datos Protegidos:</strong> Tu información personal está cifrada y protegida según estándares internacionales de seguridad.
                    </small>
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                <div className="d-flex align-items-start gap-2">
                  <i className="bi bi-info-circle text-primary fs-5 mt-1"></i>
                  <div>
                    <small className="text-muted">
                      <strong className="text-navy">Verificación:</strong> Tu cuenta será verificada automáticamente con la información del Colegio de Ingenieros.
                    </small>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Register;