// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
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
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <i className="bi bi-shield-lock-fill"></i>
        </div>
        
        <h2 className="auth-title">Iniciar Sesión</h2>
        <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="form-custom">
          <Form.Group className="mb-3">
            <Form.Label>Número de Colegiado</Form.Label>
            <Form.Control
              type="text"
              name="numeroColegiado"
              value={formData.numeroColegiado}
              onChange={handleChange}
              placeholder="Ej: 12345"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>DPI</Form.Label>
            <Form.Control
              type="text"
              name="dpi"
              value={formData.dpi}
              onChange={handleChange}
              placeholder="1234567890123"
              maxLength={13}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="navy"
            className="w-100 mb-3"
            disabled={loading}
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

          <div className="text-center">
            <p className="mb-0">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-navy fw-bold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;