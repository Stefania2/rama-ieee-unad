import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { getProyectos } from '../services/api';
import Layout from '../components/Layout';

const COLORS = ['#00629B', '#0E7C73', '#C2367C', '#4F4FCB', '#F7941D'];

export default function Estadisticas() {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => { getProyectos().then(setProyectos); }, []);

  const porCapitulo = [
    { name: 'AESS', value: proyectos.filter(p => p.capitulo === 'AESS').length },
    { name: 'WIE', value: proyectos.filter(p => p.capitulo === 'WIE').length },
    { name: 'CS', value: proyectos.filter(p => p.capitulo === 'CS').length },
  ];

  const porEstado = [
    { name: 'Activo', value: proyectos.filter(p => p.estado === 'ACTIVO').length },
    { name: 'Finalizado', value: proyectos.filter(p => p.estado === 'FINALIZADO').length },
    { name: 'Planeado', value: proyectos.filter(p => p.estado === 'PLANEADO').length },
  ];

  const presupuestoData = proyectos.map(p => ({
    name: p.nombre.length > 18 ? p.nombre.substring(0, 18) + '...' : p.nombre,
    presupuesto: p.presupuesto / 1000000,
    capitulo: p.capitulo,
  }));

  const avgByCapitulo = [
    { name: 'AESS', avance: Math.round(proyectos.filter(p => p.capitulo === 'AESS').reduce((s, p) => s + (p.avance || 0), 0) / Math.max(proyectos.filter(p => p.capitulo === 'AESS').length, 1)) },
    { name: 'WIE', avance: Math.round(proyectos.filter(p => p.capitulo === 'WIE').reduce((s, p) => s + (p.avance || 0), 0) / Math.max(proyectos.filter(p => p.capitulo === 'WIE').length, 1)) },
    { name: 'CS', avance: Math.round(proyectos.filter(p => p.capitulo === 'CS').reduce((s, p) => s + (p.avance || 0), 0) / Math.max(proyectos.filter(p => p.capitulo === 'CS').length, 1)) },
  ];

  const formatCurrency = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n * 1000000);

  const presupuestoTotal = proyectos.reduce((s, p) => s + p.presupuesto, 0);
  const avanceGeneral = proyectos.length ? Math.round(proyectos.reduce((s, p) => s + (p.avance || 0), 0) / proyectos.length) : 0;

  return (
    <Layout title="Estadísticas">
      <div className="page-header">
        <h1>Estadísticas</h1>
        <p>Métricas y análisis de proyectos</p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="card stat-summary" style={{ background: 'var(--ieee-blue)', color: 'white' }}>
          <span className="stat-number">{proyectos.length}</span>
          <span className="stat-label">Total Proyectos</span>
        </div>
        <div className="card stat-summary" style={{ background: 'var(--aess)', color: 'white' }}>
          <span className="stat-number">{avanceGeneral}%</span>
          <span className="stat-label">Avance General</span>
        </div>
        <div className="card stat-summary" style={{ background: 'var(--unad-orange)', color: 'white' }}>
          <span className="stat-number">{formatCurrency(presupuestoTotal)}</span>
          <span className="stat-label">Presupuesto Total</span>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card chart-card">
          <h3>Proyectos por Capítulo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={porCapitulo} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {porCapitulo.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3>Estado de Proyectos</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={porEstado} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {porEstado.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card chart-card">
          <h3>Avance Promedio por Capítulo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={avgByCapitulo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="avance" radius={[4, 4, 0, 0]}>
                {avgByCapitulo.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3>Presupuesto por Proyecto (Millones COP)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={presupuestoData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="presupuesto" fill="var(--ieee-blue)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .stat-summary {
          text-align: center;
          padding: 28px 20px;
        }
        .stat-number {
          display: block;
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 13px;
          font-weight: 500;
          opacity: 0.9;
        }
        .chart-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 16px;
          text-align: center;
        }
      `}</style>
    </Layout>
  );
}
