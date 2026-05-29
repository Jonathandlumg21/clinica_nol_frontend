import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  sidebar: {
    width: '220px', minHeight: '100vh', background: '#1e3a5f',
    display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0,
  },
  brand: { padding: '24px 20px', borderBottom: '1px solid #2d5080' },
  brandTitle: { color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: 0 },
  brandSub: { color: '#7ba3c8', fontSize: '12px', margin: '2px 0 0 0' },
  nav: { padding: '16px 0', flex: 1 },
  navLabel: {
    color: '#7ba3c8', fontSize: '11px', fontWeight: '600',
    letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 20px 4px', margin: 0,
  },
  link: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px',
    color: '#b8d0e8', textDecoration: 'none', fontSize: '14px',
    borderLeft: '3px solid transparent',
  },
  linkActive: { background: '#2d5080', color: '#ffffff', borderLeft: '3px solid #3b82f6' },
  footer: { padding: '16px 20px', borderTop: '1px solid #2d5080' },
  userBox: { marginBottom: '12px' },
  userName: { color: '#fff', fontSize: '13px', fontWeight: '600', margin: '0 0 2px' },
  userRol: { color: '#7ba3c8', fontSize: '11px', margin: 0, textTransform: 'capitalize' },
  btnLogout: {
    width: '100%', padding: '8px', background: 'transparent', border: '1px solid #2d5080',
    color: '#7ba3c8', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
  },
};

const allLinks = [
  { to: '/', label: 'Dashboard', icon: '◈' },
  { to: '/pacientes', label: 'Pacientes', icon: '♥' },
  { to: '/consultas', label: 'Consultas', icon: '✚' },
  { to: '/usuarios', label: 'Usuarios', icon: '◎', soloAdmin: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const esAdmin = user?.rol === 'admin';
  const links = allLinks.filter(l => !l.soloAdmin || esAdmin);

  return (
    <aside style={s.sidebar}>
      <div style={s.brand}>
        <p style={s.brandTitle}>Clínica Nol</p>
        <p style={s.brandSub}>Sistema de gestión</p>
      </div>

      <nav style={s.nav}>
        <p style={s.navLabel}>Menú</p>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div style={s.footer}>
          <div style={s.userBox}>
            <p style={s.userName}>{user.nombre ?? user.name ?? 'Usuario'}</p>
            <p style={s.userRol}>{user.rol ?? user.role ?? ''}</p>
          </div>
          <button style={s.btnLogout} onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </aside>
  );
}
