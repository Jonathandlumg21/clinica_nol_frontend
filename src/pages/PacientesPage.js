import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const s = {
  page: { padding: '32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  sub: { color: '#64748b', fontSize: '14px', margin: 0 },
  btnPrimary: {
    background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse', background: '#ffffff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600', padding: '14px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f1f5f9' },
  badge: (sexo) => ({
    background: sexo === 'Femenino' ? '#fce7f3' : '#dbeafe',
    color: sexo === 'Femenino' ? '#9d174d' : '#1d4ed8',
    padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
  }),
  badgeMedico: { background: '#f0fdf4', color: '#166534', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500' },
  btnHistorial: { background: 'transparent', border: '1px solid #d1d5db', color: '#475569', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' },
  btnEditar: { background: 'transparent', border: '1px solid #93c5fd', color: '#2563eb', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' },
  actions: { display: 'flex', gap: '8px', alignItems: 'center' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', background: '#fff', padding: '14px 20px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  searchInput: { flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  searchCount: { fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' },
  emptySearch: { textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px', background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  // Modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modal: {
    background: '#fff', borderRadius: '12px', padding: '32px',
    width: '100%', maxWidth: '500px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: {
    width: '100%', padding: '9px 12px', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '9px 12px', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '14px', background: '#fff', boxSizing: 'border-box',
  },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
  btnCancel: {
    padding: '9px 20px', borderRadius: '8px', border: '1px solid #d1d5db',
    background: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500',
  },
  btnSave: {
    padding: '9px 20px', borderRadius: '8px', border: 'none',
    background: '#1e3a5f', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  error: { color: '#ef4444', fontSize: '13px', marginBottom: '12px' },
  toast: {
    position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
    background: '#166534', color: '#fff', padding: '12px 24px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '500', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    zIndex: 200, whiteSpace: 'nowrap',
  },
};

const emptyForm = {
  nombre: '', apellido: '', fecha_nacimiento: '', sexo: 'Masculino',
  telefono: '', direccion: '', id_medico: '',
};

function calcEdad(fechaNac) {
  const hoy = new Date();
  const nac = new Date(fechaNac);
  let edad = hoy.getFullYear() - nac.getFullYear();
  if (hoy < new Date(hoy.getFullYear(), nac.getMonth(), nac.getDate())) edad--;
  return edad;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [formError, setFormError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchPacientes = () =>
    api.get('/pacientes').then(res => setPacientes(res.data.value ?? res.data));

  useEffect(() => {
    Promise.all([
      fetchPacientes(),
      api.get('/usuarios').then(res => {
        const todos = res.data.value ?? res.data;
        setMedicos(todos.filter(u => u.rol === 'medico'));
      }),
    ])
      .catch(() => setLoadError('No se pudo cargar la información.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = { ...form, id_medico: Number(form.id_medico) };
      if (editingId) {
        await api.put(`/pacientes/${editingId}`, payload);
      } else {
        await api.post('/pacientes', payload);
      }
      await fetchPacientes();
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      showToast(editingId ? 'Paciente actualizado correctamente' : 'Paciente guardado correctamente');
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Error al guardar el paciente.');
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => { setForm(emptyForm); setEditingId(null); setFormError(''); setShowModal(true); };
  const openEdit = (p) => {
    const fechaISO = p.fecha_nacimiento ? p.fecha_nacimiento.split('T')[0] : '';
    setForm({
      nombre: p.nombre ?? '',
      apellido: p.apellido ?? '',
      fecha_nacimiento: fechaISO,
      sexo: p.sexo ?? 'Masculino',
      telefono: p.telefono ?? '',
      direccion: p.direccion ?? '',
      id_medico: p.id_medico ? String(p.id_medico) : '',
    });
    setEditingId(p.id);
    setFormError('');
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); setFormError(''); };

  if (loading) return <div style={s.page}><p style={{ color: '#64748b' }}>Cargando pacientes...</p></div>;
  if (loadError) return <div style={s.page}><p style={{ color: '#ef4444' }}>{loadError}</p></div>;

  const q = busqueda.toLowerCase().trim();
  const pacientesFiltrados = q
    ? pacientes.filter(p =>
        `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
        (p.telefono ?? '').toLowerCase().includes(q) ||
        (p.direccion ?? '').toLowerCase().includes(q) ||
        (p.medico?.nombre ?? '').toLowerCase().includes(q)
      )
    : pacientes;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.heading}>Pacientes</h1>
          <p style={s.sub}>{pacientes.length} pacientes registrados</p>
        </div>
        <button style={s.btnPrimary} onClick={openModal}>+ Nuevo paciente</button>
      </div>

      <div style={s.searchBar}>
        <input
          style={s.searchInput}
          placeholder="Buscar por nombre, teléfono, dirección o médico..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          autoComplete="off"
        />
        {busqueda && (
          <span style={s.searchCount}>
            {pacientesFiltrados.length} resultado{pacientesFiltrados.length !== 1 ? 's' : ''}
          </span>
        )}
        {busqueda && (
          <button style={s.btnHistorial} onClick={() => setBusqueda('')}>✕ Limpiar</button>
        )}
      </div>

      {pacientesFiltrados.length === 0 && (
        <div style={s.emptySearch}>
          No se encontraron pacientes para &quot;<strong>{busqueda}</strong>&quot;
        </div>
      )}

      {pacientesFiltrados.length > 0 && (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Edad</th>
              <th style={s.th}>Sexo</th>
              <th style={s.th}>Teléfono</th>
              <th style={s.th}>Dirección</th>
              <th style={s.th}>Médico asignado</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.map(p => (
              <tr key={p.id}>
                <td style={{ ...s.td, color: '#94a3b8', fontWeight: '500' }}>{p.id}</td>
                <td style={{ ...s.td, fontWeight: '600', color: '#1e293b' }}>{p.nombre} {p.apellido}</td>
                <td style={s.td}>{calcEdad(p.fecha_nacimiento)} años</td>
                <td style={s.td}><span style={s.badge(p.sexo)}>{p.sexo}</span></td>
                <td style={s.td}>{p.telefono}</td>
                <td style={s.td}>{p.direccion}</td>
                <td style={s.td}><span style={s.badgeMedico}>{p.medico?.nombre}</span></td>
                <td style={s.td}>
                  <div style={s.actions}>
                    <button style={s.btnEditar} onClick={() => openEdit(p)}>Editar</button>
                    <button
                      style={s.btnHistorial}
                      onClick={() => navigate(`/consultas?paciente=${p.id}&nombre=${encodeURIComponent(p.nombre + ' ' + p.apellido)}`)}
                    >
                      Ver historial
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <p style={s.modalTitle}>{editingId ? 'Editar paciente' : 'Nuevo paciente'}</p>

            {formError && <p style={s.error}>{formError}</p>}

            <form onSubmit={handleSubmit}>
              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Nombre</label>
                  <input style={s.input} name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej. Carlos" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Apellido</label>
                  <input style={s.input} name="apellido" value={form.apellido} onChange={handleChange} required placeholder="Ej. Mendoza" />
                </div>
              </div>

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Fecha de nacimiento</label>
                  <input style={s.input} type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Sexo</label>
                  <select style={s.select} name="sexo" value={form.sexo} onChange={handleChange}>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
              </div>

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Teléfono</label>
                  <input style={s.input} name="telefono" value={form.telefono} onChange={handleChange} placeholder="809-000-0000" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Médico asignado</label>
                  <select style={s.select} name="id_medico" value={form.id_medico} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {medicos.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={s.field}>
                <label style={s.label}>Dirección</label>
                <input style={s.input} name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, número, sector" />
              </div>

              <div style={s.modalFooter}>
                <button type="button" style={s.btnCancel} onClick={closeModal}>Cancelar</button>
                <button type="submit" style={s.btnSave} disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Guardar paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div style={s.toast}>✓ {toast}</div>}
    </div>
  );
}
