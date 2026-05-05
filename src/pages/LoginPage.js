import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const s = {
  page: {
    minHeight: '100vh', background: '#f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    background: '#ffffff', borderRadius: '12px',
    padding: '40px', width: '100%', maxWidth: '400px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  },
  logo: {
    textAlign: 'center', marginBottom: '32px',
  },
  brandTitle: { fontSize: '22px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 4px' },
  brandSub: { fontSize: '13px', color: '#64748b', margin: 0 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: {
    width: '100%', padding: '10px 14px', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '14px', color: '#1e293b',
    outline: 'none', transition: 'border 0.15s',
    boxSizing: 'border-box',
  },
  field: { marginBottom: '18px' },
  btn: {
    width: '100%', padding: '12px', background: '#1e3a5f', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px', transition: 'background 0.15s',
  },
  error: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '18px',
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error ?? 'Error al iniciar sesión';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <p style={s.brandTitle}>Clínica Nol</p>
          <p style={s.brandSub}>Ingresa tus credenciales para continuar</p>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Correo electrónico</label>
            <input
              style={s.input}
              type="email"
              placeholder="correo@clinicanol.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Contraseña</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
