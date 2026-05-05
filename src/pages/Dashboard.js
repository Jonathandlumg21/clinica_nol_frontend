import { useEffect, useState } from 'react';
import api from '../services/api';

const styles = {
  page: { padding: '32px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  sub: { color: '#64748b', fontSize: '14px', margin: '0 0 32px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  card: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    borderTop: '4px solid #3b82f6',
  },
  cardValue: { fontSize: '36px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  cardLabel: { fontSize: '14px', color: '#64748b', margin: 0 },
  section: { background: '#ffffff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '12px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f8fafc' },
  badge: { background: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500' },
};

export default function Dashboard() {
  const [stats, setStats] = useState({ pacientes: 0, usuarios: 0, consultas: 0 });
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/pacientes'),
      api.get('/usuarios'),
      api.get('/consultas'),
    ]).then(([p, u, c]) => {
      setStats({
        pacientes: p.data.Count ?? p.data.length ?? 0,
        usuarios: u.data.Count ?? u.data.length ?? 0,
        consultas: c.data.Count ?? c.data.length ?? 0,
      });
      const lista = p.data.value ?? p.data;
      setPacientes(lista.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.page}><p style={{ color: '#64748b' }}>Cargando...</p></div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Dashboard</h1>
      <p style={styles.sub}>Resumen general del sistema</p>

      <div style={styles.grid}>
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

      <div style={styles.section}>
        <p style={styles.sectionTitle}>Últimos pacientes registrados</p>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Sexo</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Médico asignado</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>{p.nombre} {p.apellido}</td>
                <td style={styles.td}>{p.sexo}</td>
                <td style={styles.td}>{p.telefono}</td>
                <td style={styles.td}><span style={styles.badge}>{p.medico?.nombre}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
