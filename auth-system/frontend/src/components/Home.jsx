// src/components/Home.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { usuario, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                  {usuario?.nombre?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <h1 className="display-4 fw-bold mb-3">
                ¡Bienvenido, {usuario?.nombre}!
              </h1>
              
              <p className="lead text-muted mb-4">
                Has iniciado sesión exitosamente
              </p>

              <div className="card bg-light border-0 mt-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Información de tu perfil</h5>
                  <div className="row text-start">
                    <div className="col-md-6 mb-3">
                      <p className="mb-1 text-muted small">Nombre</p>
                      <p className="fw-bold">{usuario?.nombre}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p className="mb-1 text-muted small">DPI</p>
                      <p className="fw-bold">{usuario?.dpi}</p>
                    </div>
                    <div className="col-md-12">
                      <p className="mb-1 text-muted small">Email</p>
                      <p className="fw-bold">{usuario?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;