import { useEffect, useState } from 'react';
import api from '../services/api';

const styles = {
  page: { padding: '32px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  sub: { color: '#64748b', fontSize: '14px', margin: '0 0 32px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  card: {
    background: '#ffffff', borderRadius: '10px', padding: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #3b82f6',
  },
  cardValue: { fontSize: '36px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  cardLabel: { fontSize: '14px', color: '#64748b', margin: 0 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  section: { background: '#ffffff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px' },
  sectionSub: { fontSize: '13px', color: '#94a3b8', margin: '0 0 20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '12px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f8fafc' },
  badge: { background: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500' },
};

function calcularSemana(consultas) {
  const hoy = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(hoy);
    dia.setDate(hoy.getDate() - (6 - i));
    const fechaStr = dia.toISOString().split('T')[0];
    const count = consultas.filter(c => c.fecha && c.fecha.split('T')[0] === fechaStr).length;
    return {
      label: dia.toLocaleDateString('es-DO', { weekday: 'short' }),
      fecha: dia.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit' }),
      count,
      esHoy: i === 6,
    };
  });
}

function GraficaSemana({ datos }) {
  const maxVal = Math.max(...datos.map(d => d.count), 1);
  const W = 560, H = 180, padL = 32, padB = 48, padT = 24, padR = 12;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const slotW = chartW / 7;
  const barW = slotW * 0.52;
  const yLines = [0, Math.round(maxVal / 2), maxVal];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      {/* Líneas guía horizontales */}
      {yLines.map(v => {
        const y = padT + chartH - (v / maxVal) * chartH;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
          </g>
        );
      })}

      {/* Barras */}
      {datos.map((d, i) => {
        const barH = Math.max((d.count / maxVal) * chartH, d.count > 0 ? 4 : 0);
        const x = padL + i * slotW + (slotW - barW) / 2;
        const y = padT + chartH - barH;
        const color = d.esHoy ? '#1e3a5f' : '#93c5fd';
        const centerX = x + barW / 2;

        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={color} rx="4" />
            {d.count > 0 && (
              <text x={centerX} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill={d.esHoy ? '#1e3a5f' : '#3b82f6'}>
                {d.count}
              </text>
            )}
            <text x={centerX} y={padT + chartH + 16} textAnchor="middle" fontSize="11" fontWeight={d.esHoy ? '700' : '400'} fill={d.esHoy ? '#1e293b' : '#64748b'}>
              {d.label}
            </text>
            <text x={centerX} y={padT + chartH + 30} textAnchor="middle" fontSize="10" fill="#94a3b8">
              {d.fecha}
            </text>
          </g>
        );
      })}

      {/* Eje X */}
      <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ pacientes: 0, usuarios: 0, consultas: 0 });
  const [pacientes, setPacientes] = useState([]);
  const [semana, setSemana] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/pacientes'),
      api.get('/usuarios'),
      api.get('/consultas'),
    ]).then(([p, u, c]) => {
      const listaConsultas = c.data.value ?? c.data;
      setStats({
        pacientes: p.data.Count ?? p.data.length ?? 0,
        usuarios: u.data.Count ?? u.data.length ?? 0,
        consultas: listaConsultas.length,
      });
      const lista = p.data.value ?? p.data;
      setPacientes(lista.slice(0, 5));
      setSemana(calcularSemana(listaConsultas));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-pad"><p style={{ color: '#64748b' }}>Cargando...</p></div>;

  return (
    <div className="page-pad">
      <h1 style={styles.heading}>Dashboard</h1>
      <p style={styles.sub}>Resumen general del sistema</p>

      <div className="dash-grid">
        <div style={styles.card}>
          <p style={styles.cardValue}>{stats.pacientes}</p>
          <p style={styles.cardLabel}>Pacientes registrados</p>
        </div>
        <div style={{ ...styles.card, borderTopColor: '#10b981' }}>
          <p style={styles.cardValue}>{stats.usuarios}</p>
          <p style={styles.cardLabel}>Usuarios activos</p>
        </div>
        <div style={{ ...styles.card, borderTopColor: '#f59e0b' }}>
          <p style={styles.cardValue}>{stats.consultas}</p>
          <p style={styles.cardLabel}>Consultas realizadas</p>
        </div>
      </div>

      <div className="dash-row2">
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Consultas por día</p>
          <p style={styles.sectionSub}>Últimos 7 días — hoy en azul oscuro</p>
          <GraficaSemana datos={semana} />
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>Últimos pacientes registrados</p>
          <p style={styles.sectionSub}>&nbsp;</p>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Sexo</th>
                <th style={styles.th}>Médico</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td style={styles.td}>{p.nombre} {p.apellido}</td>
                  <td style={styles.td}>{p.sexo}</td>
                  <td style={styles.td}><span style={styles.badge}>{p.medico?.nombre}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
