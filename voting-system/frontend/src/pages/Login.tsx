// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, InputGroup, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import type { LoginCredentials } from '../types';
import { handleAPIError } from '../utils/helpers';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    numeroColegiado: '',
    dpi: '',
    fechaNacimiento: '',
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.numeroColegiado || !formData.dpi || !formData.fechaNacimiento || !formData.contraseña) {
      setError('Todos los campos son requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      login(response.token, response.user);
      navigate('/');
    } catch (err: any) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in shadow-lg">
        {/* Logo mejorado */}
        <div 
          className="auth-logo shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #f4d03f 0%, #f0c419 100%)'
          }}
        >
          <i className="bi bi-shield-lock-fill"></i>
        </div>
        
        {/* Título y subtítulo */}
        <h2 className="auth-title mb-2">Bienvenido de Nuevo</h2>
        <p className="auth-subtitle mb-4">Ingresa tus credenciales para continuar</p>

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
          {/* Número de Colegiado */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="bi bi-person-badge me-2 text-navy"></i>
              Número de Colegiado
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light">
                <i className="bi bi-hash text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="numeroColegiado"
                value={formData.numeroColegiado}
                onChange={handleChange}
                placeholder="Ej: 12345"
                className="form-control-lg"
                required
              />
            </InputGroup>
            <Form.Text className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Tu número de colegiado único
            </Form.Text>
          </Form.Group>

          {/* DPI */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="bi bi-card-text me-2 text-navy"></i>
              DPI (Documento Personal de Identificación)
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light">
                <i className="bi bi-credit-card text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="dpi"
                value={formData.dpi}
                onChange={handleChange}
                placeholder="1234567890123"
                maxLength={13}
                className="form-control-lg"
                required
              />
            </InputGroup>
            <Form.Text className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              13 dígitos sin espacios ni guiones
            </Form.Text>
          </Form.Group>

          {/* Fecha de Nacimiento */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="bi bi-calendar-event me-2 text-navy"></i>
              Fecha de Nacimiento
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light">
                <i className="bi bi-calendar3 text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="form-control-lg"
                required
              />
            </InputGroup>
          </Form.Group>

          {/* Contraseña */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-lock-fill me-2 text-navy"></i>
              Contraseña
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light">
                <i className="bi bi-key text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="form-control-lg"
                required
              />
              <Button 
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ borderLeft: 'none' }}
              >
                <i className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}></i>
              </Button>
            </InputGroup>
          </Form.Group>

          {/* Botón de envío */}
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
                Iniciando sesión...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
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
              ¿No tienes cuenta?
            </span>
          </div>

          {/* Botón de registro */}
          <Button
            variant="outline-navy"
            size="lg"
            className="w-100 py-3 fw-bold"
            onClick={() => navigate('/register')}
            disabled={loading}
            style={{ fontSize: '1.1rem' }}
          >
            <i className="bi bi-person-plus-fill me-2"></i>
            Crear Cuenta Nueva
          </Button>
        </Form>

        {/* Footer informativo */}
        <Card className="mt-4 border-0 bg-light">
          <Card.Body className="p-3">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-shield-check text-success fs-5 mt-1"></i>
              <div>
                <small className="text-muted d-block">
                  <strong className="text-navy">Sistema Seguro:</strong> Tus credenciales están protegidas con encriptación de nivel bancario.
                </small>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;