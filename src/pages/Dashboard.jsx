import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getProyectos, getEventos } from '../services/api';
import Layout from '../components/Layout';

const COLORS_PIE = ['#00629B', '#0E7C73', '#C2367C', '#4F4FCB', '#F7941D'];

export default function Dashboard() {
  const [proyectos, setProyectos] = useState([]);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    getProyectos().then(setProyectos);
    getEventos().then(setEventos);
  }, []);

  const activos = proyectos.filter(p => p.estado === 'ACTIVO');
  const finalizados = proyectos.filter(p => p.estado === 'FINALIZADO');
  const eventosMes = eventos.filter(e => {
    const fecha = new Date(e.fecha);
    const now = new Date();
    return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
  });
  const participantes = proyectos.reduce((sum, p) => sum + Math.floor(p.presupuesto / 1000000), 0);

  const proyectosPorCapitulo = [
    { name: 'AESS', value: proyectos.filter(p => p.capitulo === 'AESS').length },
    { name: 'WIE', value: proyectos.filter(p => p.capitulo === 'WIE').length },
    { name: 'CS', value: proyectos.filter(p => p.capitulo === 'CS').length },
  ];

  const porEstado = [
    { name: 'Activo', value: activos.length },
    { name: 'Finalizado', value: finalizados.length },
    { name: 'Planeado', value: proyectos.filter(p => p.estado === 'PLANEADO').length },
  ];

  const avancePromedio = proyectos.length
    ? Math.round(proyectos.reduce((sum, p) => sum + (p.avance || 0), 0) / proyectos.length)
    : 0;

  const indicators = [
    { label: 'Proyectos Activos', value: activos.length, color: 'var(--ieee-blue)' },
    { label: 'Eventos del Mes', value: eventosMes.length, color: 'var(--unad-orange)' },
    { label: 'Participantes', value: participantes, color: 'var(--aess)' },
    { label: 'Proyectos Finalizados', value: finalizados.length, color: 'var(--cs)' },
  ];

  const avanceData = proyectos.map(p => ({
    name: p.nombre.length > 20 ? p.nombre.substring(0, 20) + '...' : p.nombre,
    avance: p.avance || 0,
    capitulo: p.capitulo,
  }));

  return (
    <Layout title="Dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Panel principal del IEEE UNAD Project Hub</p>
      </div>

      <div className="grid grid-4 indicators">
        {indicators.map(ind => (
          <div key={ind.label} className="card indicator-card">
            <span className="indicator-value" style={{ color: ind.color }}>{ind.value}</span>
            <span className="indicator-label">{ind.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-3 charts-section" style={{ marginTop: 24 }}>
        <div className="card chart-card">
          <h3>Proyectos por Capítulo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={proyectosPorCapitulo} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                {proyectosPorCapitulo.map((_, i) => <Cell key={i} fill={COLORS_PIE[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3>Estado de Proyectos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={porEstado} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                {porEstado.map((_, i) => <Cell key={i} fill={COLORS_PIE.slice(0, 3)[i] || COLORS_PIE[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3>Avance Promedio: {avancePromedio}%</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="avance" fill="var(--ieee-blue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Resumen de Proyectos</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Capítulo</th>
              <th>Estado</th>
              <th>Avance</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.slice(0, 5).map(p => (
              <tr key={p.id}>
                <td><strong>{p.nombre}</strong></td>
                <td><span className={`badge badge-${p.capitulo.toLowerCase()}`}>{p.capitulo}</span></td>
                <td><span className={`estado estado-${p.estado?.toLowerCase()}`}>{p.estado}</span></td>
                <td>
                  <div className="progress-bar-sm">
                    <div className="progress-fill-sm" style={{ width: `${p.avance}%` }} />
                  </div>
                  <span style={{ fontSize: 12, marginLeft: 8 }}>{p.avance}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .indicators { margin-bottom: 0; }
        .indicator-card {
          text-align: center;
          padding: 24px;
        }
        .indicator-value {
          display: block;
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 8px;
        }
        .indicator-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .charts-section { margin-top: 24; }
        .chart-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 16px;
          text-align: center;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .table th {
          text-align: left;
          padding: 10px 12px;
          border-bottom: 2px solid var(--border);
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 12px;
          text-transform: uppercase;
        }
        .table td {
          padding: 12px;
          border-bottom: 1px solid var(--border);
        }
        .table tbody tr:hover { background: var(--bg-primary); }
        .progress-bar-sm {
          display: inline-block;
          width: 80px;
          height: 6px;
          background: #E5E7EB;
          border-radius: 3px;
          vertical-align: middle;
        }
        .progress-fill-sm {
          height: 100%;
          background: var(--ieee-blue);
          border-radius: 3px;
        }
      `}</style>
    </Layout>
  );
}
