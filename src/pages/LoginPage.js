import { useState, useEffect } from 'react';
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

const MAX_INTENTOS = 5;
const BLOQUEO_MS = 30_000;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [bloqueadoHasta, setBloqueadoHasta] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [ahora, setAhora] = useState(Date.now());
  useEffect(() => {
    if (!bloqueadoHasta) return;
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, [bloqueadoHasta]);

  const segundosRestantes = bloqueadoHasta
    ? Math.max(0, Math.ceil((bloqueadoHasta - ahora) / 1000))
    : 0;
  const estaBloqueado = segundosRestantes > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (estaBloqueado) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setIntentos(0);
      setBloqueadoHasta(null);
      login(data);
      navigate('/');
    } catch (err) {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);
      if (nuevosIntentos >= MAX_INTENTOS) {
        setBloqueadoHasta(Date.now() + BLOQUEO_MS);
        setIntentos(0);
        setError(`Demasiados intentos fallidos. Espera 30 segundos.`);
      } else {
        const msg = err.response?.data?.error ?? 'Error al iniciar sesión';
        setError(`${msg} (intento ${nuevosIntentos} de ${MAX_INTENTOS})`);
      }
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
          <button
            style={{ ...s.btn, ...(estaBloqueado ? { background: '#94a3b8', cursor: 'not-allowed' } : {}) }}
            type="submit"
            disabled={loading || estaBloqueado}
          >
            {loading ? 'Ingresando...' : estaBloqueado ? `Bloqueado (${segundosRestantes}s)` : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
