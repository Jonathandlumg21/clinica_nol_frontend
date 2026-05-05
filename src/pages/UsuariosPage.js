import { useEffect, useState } from 'react';
import api from '../services/api';

const rolColor = {
  admin:      { bg: '#fef3c7', text: '#92400e' },
  medico:     { bg: '#dbeafe', text: '#1d4ed8' },
  secretaria: { bg: '#f0fdf4', text: '#166534' },
};
const avatarIcon = { admin: '★', medico: '✚', secretaria: '◎' };

const s = {
  page: { padding: '32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  sub: { color: '#64748b', fontSize: '14px', margin: 0 },
  btnPrimary: { background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' },
  avatar: rol => ({
    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', fontWeight: '700',
    background: rolColor[rol]?.bg ?? '#f1f5f9',
    color: rolColor[rol]?.text ?? '#475569',
  }),
  cardName: { fontSize: '15px', fontWeight: '600', color: '#1e293b', margin: '0 0 2px' },
  cardEmail: { fontSize: '13px', color: '#64748b', margin: 0 },
  cardFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' },
  badge: rol => ({
    display: 'inline-block', padding: '3px 10px', borderRadius: '999px',
    fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
    background: rolColor[rol]?.bg ?? '#f1f5f9',
    color: rolColor[rol]?.text ?? '#475569',
  }),
  inactiveBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: '#f1f5f9', color: '#94a3b8' },
  cardActions: { display: 'flex', gap: '8px' },
  btnEdit: { background: 'transparent', border: '1px solid #d1d5db', color: '#475569', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' },
  btnDelete: { background: 'transparent', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' },
  // Modal compartido
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' },
  modal: { background: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  hint: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', cursor: 'pointer' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  btnCancel: { padding: '9px 20px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500' },
  btnSave: { padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#1e3a5f', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  btnDanger: { padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  error: { color: '#ef4444', fontSize: '13px', marginBottom: '14px', background: '#fef2f2', padding: '8px 12px', borderRadius: '6px' },
  // Modal confirmar eliminación
  confirmModal: { background: '#fff', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', textAlign: 'center' },
  confirmIcon: { fontSize: '36px', marginBottom: '12px' },
  confirmTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px' },
  confirmSub: { fontSize: '13px', color: '#64748b', margin: '0 0 24px' },
};

const emptyForm = { nombre: '', email: '', password: '', rol: 'secretaria', activo: true };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsuarios = () =>
    api.get('/usuarios').then(res => setUsuarios(res.data.value ?? res.data));

  useEffect(() => {
    fetchUsuarios().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditTarget(u);
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol, activo: u.activo });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setFormError(''); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editTarget) {
        const body = { nombre: form.nombre, email: form.email, rol: form.rol, activo: form.activo };
        if (form.password) body.password = form.password;
        await api.put(`/usuarios/${editTarget.id}`, body);
      } else {
        await api.post('/usuarios', { nombre: form.nombre, email: form.email, password: form.password, rol: form.rol });
      }
      await fetchUsuarios();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Error al guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/usuarios/${confirmDelete.id}`);
      await fetchUsuarios();
      setConfirmDelete(null);
    } catch (err) {
      alert(err.response?.data?.error ?? 'Error al eliminar el usuario.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div style={s.page}><p style={{ color: '#64748b' }}>Cargando usuarios...</p></div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.heading}>Usuarios</h1>
          <p style={s.sub}>{usuarios.length} usuarios en el sistema</p>
        </div>
        <button style={s.btnPrimary} onClick={openCreate}>+ Nuevo usuario</button>
      </div>

      <div style={s.grid}>
        {usuarios.map(u => (
          <div key={u.id} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.avatar(u.rol)}>{avatarIcon[u.rol] ?? '?'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={s.cardName}>{u.nombre}</p>
                <p style={s.cardEmail}>{u.email}</p>
              </div>
            </div>
            <div style={s.cardFooter}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={s.badge(u.rol)}>{u.rol}</span>
                {!u.activo && <span style={s.inactiveBadge}>inactivo</span>}
              </div>
              <div style={s.cardActions}>
                <button style={s.btnEdit} onClick={() => openEdit(u)}>Editar</button>
                <button style={s.btnDelete} onClick={() => setConfirmDelete(u)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal crear / editar */}
      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <p style={s.modalTitle}>{editTarget ? 'Editar usuario' : 'Nuevo usuario'}</p>

            {formError && <div style={s.error}>{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div style={s.field}>
                <label style={s.label}>Nombre completo</label>
                <input style={s.input} name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej. Dr. Juan Pérez" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Correo electrónico</label>
                <input style={s.input} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="correo@clinicanol.com" />
              </div>
              <div style={s.field}>
                <label style={s.label}>{editTarget ? 'Nueva contraseña' : 'Contraseña'}</label>
                <input style={s.input} type="password" name="password" value={form.password} onChange={handleChange} required={!editTarget} placeholder={editTarget ? 'Dejar en blanco para no cambiar' : '••••••••'} />
                {editTarget && <p style={s.hint}>Dejar en blanco para mantener la contraseña actual.</p>}
              </div>
              <div style={s.field}>
                <label style={s.label}>Rol</label>
                <select style={s.select} name="rol" value={form.rol} onChange={handleChange}>
                  <option value="admin">Administrador</option>
                  <option value="medico">Médico</option>
                  <option value="secretaria">Secretaria</option>
                </select>
              </div>
              {editTarget && (
                <div style={s.field}>
                  <label style={s.checkRow}>
                    <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
                    Usuario activo
                  </label>
                </div>
              )}
              <div style={s.modalFooter}>
                <button type="button" style={s.btnCancel} onClick={closeModal}>Cancelar</button>
                <button type="submit" style={s.btnSave} disabled={saving}>
                  {saving ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDelete && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div style={s.confirmModal}>
            <p style={s.confirmIcon}>⚠</p>
            <p style={s.confirmTitle}>¿Eliminar usuario?</p>
            <p style={s.confirmSub}>
              Estás a punto de eliminar a <strong>{confirmDelete.nombre}</strong>. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={s.btnCancel} onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button style={s.btnDanger} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
