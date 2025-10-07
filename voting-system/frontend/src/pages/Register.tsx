// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
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
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
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
          <i className="bi bi-person-plus-fill"></i>
        </div>
        
        <h2 className="auth-title">Crear Cuenta Nueva</h2>
        <p className="auth-subtitle">Regístrate para participar en las votaciones</p>

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
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              placeholder="Juan Pérez García"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="correoElectronico"
              value={formData.correoElectronico}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>DPI (13 dígitos)</Form.Label>
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
            <Form.Text className="text-muted">
              Debes ser mayor de 18 años
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
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
                Registrando...
              </>
            ) : (
              <>
                <i className="bi bi-person-check me-2"></i>
                Registrarse
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="mb-0">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-navy fw-bold">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;