// src/components/VotingChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, Badge, ProgressBar } from 'react-bootstrap';
import type { CampaignStats } from '../types';

interface VotingChartProps {
  data: CampaignStats[];
  title?: string;
}

const COLORS = ['#1e3a5f', '#f4d03f', '#28a745', '#dc3545', '#17a2b8', '#6c757d', '#ffc107', '#e83e8c'];

const VotingChart: React.FC<VotingChartProps> = ({ data, title = 'Resultados de Votación' }) => {
  const chartData = data.map((stat) => ({
    nombre: stat.nombre,
    votos: stat.votos,
    porcentaje: parseFloat(stat.porcentaje),
  }));

  const totalVotos = data.reduce((sum, stat) => sum + stat.votos, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded shadow-sm p-3">
          <p className="fw-bold text-navy mb-2">{payload[0].payload.nombre}</p>
          <p className="mb-1">
            <i className="bi bi-bar-chart-fill text-primary me-2"></i>
            <strong>{payload[0].value}</strong> votos
          </p>
          <p className="mb-0">
            <i className="bi bi-percent text-success me-2"></i>
            <strong>{payload[0].payload.porcentaje.toFixed(1)}%</strong> del total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="chart-container shadow-sm border-0">
      <Card.Body className="p-4">
        {/* Header con título y total de votos */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h4 className="text-navy fw-bold mb-1">
              <i className="bi bi-graph-up me-2"></i>
              {title}
            </h4>
            <p className="text-muted mb-0 small">
              Distribución de votos por candidato
            </p>
          </div>
          <div className="text-end">
            <div className="d-flex align-items-center gap-2 bg-light rounded px-3 py-2">
              <i className="bi bi-people-fill text-primary fs-4"></i>
              <div>
                <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>TOTAL VOTOS</small>
                <strong className="text-navy fs-5">{totalVotos}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis 
                dataKey="nombre" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fill: '#6c757d', fontSize: 12 }}
                stroke="#dee2e6"
              />
              <YAxis 
                tick={{ fill: '#6c757d', fontSize: 12 }}
                stroke="#dee2e6"
                label={{ 
                  value: 'Número de Votos', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#6c757d', fontSize: 12 }
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 58, 95, 0.1)' }} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar 
                dataKey="votos" 
                name="Votos"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              >
                {chartData.map((_item, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de resultados mejorada */}
        <div className="mt-4">
          <h5 className="text-navy fw-bold mb-3">
            <i className="bi bi-table me-2"></i>
            Detalle de Resultados
          </h5>
          
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '50px' }} className="text-center">#</th>
                  <th>Candidato</th>
                  <th className="text-center" style={{ width: '100px' }}>Votos</th>
                  <th style={{ width: '300px' }}>Distribución</th>
                  <th className="text-center" style={{ width: '100px' }}>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {data.map((stat, index) => (
                  <tr key={stat.candidateId}>
                    {/* Posición */}
                    <td className="text-center">
                      {index === 0 ? (
                        <Badge bg="warning" className="px-2 py-2">
                          <i className="bi bi-trophy-fill"></i>
                        </Badge>
                      ) : (
                        <span className="text-muted fw-bold">{index + 1}</span>
                      )}
                    </td>
                    
                    {/* Nombre del candidato */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="badge d-inline-block"
                          style={{ 
                            backgroundColor: COLORS[index % COLORS.length],
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%'
                          }}
                        ></span>
                        <span className="fw-semibold">{stat.nombre}</span>
                      </div>
                    </td>
                    
                    {/* Votos */}
                    <td className="text-center">
                      <Badge 
                        bg="light" 
                        text="dark" 
                        className="px-3 py-2 fw-bold"
                        style={{ fontSize: '0.95rem' }}
                      >
                        {stat.votos}
                      </Badge>
                    </td>
                    
                    {/* Barra de progreso */}
                    <td>
                      <ProgressBar 
                        now={parseFloat(stat.porcentaje)} 
                        style={{ height: '25px' }}
                        className="shadow-sm"
                      >
                        <ProgressBar 
                          now={parseFloat(stat.porcentaje)}
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                      </ProgressBar>
                    </td>
                    
                    {/* Porcentaje */}
                    <td className="text-center">
                      <span className="fw-bold text-navy fs-6">
                        {stat.porcentaje}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Estadísticas adicionales */}
          {data.length > 0 && (
            <div className="row g-3 mt-3 pt-3 border-top">
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <i className="bi bi-trophy-fill text-warning fs-3"></i>
                  <div>
                    <small className="text-muted d-block">Líder</small>
                    <strong className="text-navy">{data[0].nombre}</strong>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <i className="bi bi-bar-chart-fill text-primary fs-3"></i>
                  <div>
                    <small className="text-muted d-block">Mayor votación</small>
                    <strong className="text-navy">{data[0].votos} votos</strong>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <i className="bi bi-people-fill text-success fs-3"></i>
                  <div>
                    <small className="text-muted d-block">Participación</small>
                    <strong className="text-navy">{totalVotos} personas</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default VotingChart;