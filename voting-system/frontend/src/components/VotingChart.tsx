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
import type { CampaignStats } from '../types';

interface VotingChartProps {
  data: CampaignStats[];
  title?: string;
}

const COLORS = ['#1e3a5f', '#f4d03f', '#28a745', '#dc3545', '#17a2b8', '#6c757d'];

const VotingChart: React.FC<VotingChartProps> = ({ data, title = 'Resultados de Votación' }) => {
  const chartData = data.map((stat) => ({
    nombre: stat.nombre,
    votos: stat.votos,
    porcentaje: parseFloat(stat.porcentaje),
  }));

  return (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="nombre" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'votos') return [value, 'Votos'];
              return [value + '%', 'Porcentaje'];
            }}
          />
          <Legend />
          <Bar dataKey="votos" fill="#1e3a5f" name="Votos">
            {chartData.map((_item, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Candidato</th>
              <th className="text-center">Votos</th>
              <th className="text-center">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stat, index) => (
              <tr key={stat.candidateId}>
                <td>
                  <span
                    className="badge me-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {index + 1}
                  </span>
                  {stat.nombre}
                </td>
                <td className="text-center">
                  <strong>{stat.votos}</strong>
                </td>
                <td className="text-center">
                  <strong>{stat.porcentaje}%</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VotingChart;