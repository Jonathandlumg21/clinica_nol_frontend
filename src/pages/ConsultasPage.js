import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  td: { padding: '14px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' },
  badge: { background: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500' },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '80px 40px', background: '#ffffff', borderRadius: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', color: '#94a3b8', gap: '8px',
  },
  filterWrap: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', background: '#fff', padding: '14px 20px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  filterLabel: { fontSize: '13px', fontWeight: '600', color: '#374151', whiteSpace: 'nowrap' },
  filterSelect: { padding: '7px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#fff', minWidth: '220px' },
  btnClear: { padding: '7px 14px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff', fontSize: '13px', cursor: 'pointer', color: '#475569' },
  patientBanner: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  patientBannerText: { fontSize: '14px', color: '#1d4ed8', fontWeight: '500', margin: 0 },
  // Modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    padding: '20px',
  },
  modal: {
    background: '#fff', borderRadius: '12px', padding: '32px',
    width: '100%', maxWidth: '580px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    maxHeight: '90vh', overflowY: 'auto',
  },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px' },
  modalSub: { fontSize: '13px', color: '#64748b', margin: '0 0 24px' },
  sectionLabel: { fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' },
  field: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' },
  labelOpt: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' },
  btnCancel: { padding: '9px 20px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500' },
  btnSave: { padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#1e3a5f', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  error: { color: '#ef4444', fontSize: '13px', marginBottom: '12px', background: '#fef2f2', padding: '8px 12px', borderRadius: '6px' },
  vitals: { display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b', flexWrap: 'wrap', marginTop: '4px' },
  vitalItem: { background: '#f8fafc', padding: '2px 8px', borderRadius: '4px' },
  btnVer: { background: 'transparent', border: '1px solid #d1d5db', color: '#475569', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' },
  // Modal detalle
  detailModal: { background: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '520px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  detailTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  detailFecha: { fontSize: '13px', color: '#64748b', margin: 0 },
  btnClose: { background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: '0 4px' },
  detailSection: { marginBottom: '20px' },
  detailSectionTitle: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  detailItemLabel: { fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' },
  detailItemValue: { fontSize: '14px', color: '#1e293b', fontWeight: '500' },
  diagBox: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', fontSize: '14px', color: '#334155', lineHeight: '1.6', minHeight: '60px', whiteSpace: 'pre-wrap' },
  diagEmpty: { background: '#f8fafc', border: '1px dashed #d1d5db', borderRadius: '8px', padding: '14px 16px', fontSize: '14px', color: '#94a3b8', textAlign: 'center' },
  vitalsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  vitalCard: { background: '#f8fafc', borderRadius: '8px', padding: '12px', textAlign: 'center' },
  vitalCardValue: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px' },
  vitalCardLabel: { fontSize: '11px', color: '#64748b', margin: 0 },
};

const emptyForm = {
  id_paciente: '', id_medico: '',
  fecha: new Date().toISOString().split('T')[0],
  motivo: '', notas: '',
  peso_kg: '', presion: '', temperatura: '',
};

export default function ConsultasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [consultaDetalle, setConsultaDetalle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const pacienteIdFiltro = searchParams.get('paciente') ?? '';
  const pacienteNombreFiltro = searchParams.get('nombre') ?? '';

  const fetchConsultas = (idPaciente = '') => {
    const url = idPaciente ? `/consultas?paciente=${idPaciente}` : '/consultas';
    return api.get(url).then(res => setConsultas(res.data.value ?? res.data));
  };

  useEffect(() => {
    Promise.all([
      fetchConsultas(pacienteIdFiltro),
      api.get('/pacientes').then(res => setPacientes(res.data.value ?? res.data)),
      api.get('/usuarios').then(res => {
        const todos = res.data.value ?? res.data;
        setMedicos(todos.filter(u => u.rol === 'medico'));
      }),
    ]).finally(() => setLoading(false));
  }, [pacienteIdFiltro]);

  const handleFiltroChange = (e) => {
    const id = e.target.value;
    if (!id) { setSearchParams({}); return; }
    const p = pacientes.find(p => String(p.id) === id);
    const nombre = p ? `${p.nombre} ${p.apellido}` : '';
    setSearchParams({ paciente: id, nombre });
  };

  const limpiarFiltro = () => setSearchParams({});

  const pacienteMap = Object.fromEntries(pacientes.map(p => [p.id, `${p.nombre} ${p.apellido}`]));

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await api.post('/consultas', {
        id_paciente:  Number(form.id_paciente),
        id_medico:    form.id_medico    ? Number(form.id_medico)    : undefined,
        fecha:        form.fecha        || undefined,
        motivo:       form.motivo       || undefined,
        notas:        form.notas        || undefined,
        peso_kg:      form.peso_kg      ? Number(form.peso_kg)      : undefined,
        presion:      form.presion      || undefined,
        temperatura:  form.temperatura  ? Number(form.temperatura)  : undefined,
      });
      await fetchConsultas(pacienteIdFiltro);
      setShowModal(false);
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Error al guardar la consulta.');
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => { setForm(emptyForm); setFormError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setFormError(''); };

  if (loading) return <div style={s.page}><p style={{ color: '#64748b' }}>Cargando consultas...</p></div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.heading}>Consultas</h1>
          <p style={s.sub}>{consultas.length} consulta{consultas.length !== 1 ? 's' : ''} registrada{consultas.length !== 1 ? 's' : ''}</p>
        </div>
        <button style={s.btnPrimary} onClick={openModal}>+ Nueva consulta</button>
      </div>

      <div style={s.filterWrap}>
        <span style={s.filterLabel}>Filtrar por paciente:</span>
        <select style={s.filterSelect} value={pacienteIdFiltro} onChange={handleFiltroChange}>
          <option value="">Todos los pacientes</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
          ))}
        </select>
        {pacienteIdFiltro && (
          <button style={s.btnClear} onClick={limpiarFiltro}>✕ Limpiar</button>
        )}
      </div>

      {pacienteIdFiltro && pacienteNombreFiltro && (
        <div style={s.patientBanner}>
          <p style={s.patientBannerText}>
            Mostrando historial de: <strong>{pacienteNombreFiltro}</strong>
          </p>
          <button style={s.btnClear} onClick={limpiarFiltro}>Ver todos</button>
        </div>
      )}

      {consultas.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: '40px' }}>✚</span>
          <p style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>No hay consultas registradas</p>
          <p style={{ fontSize: '14px', margin: 0 }}>Presiona "Nueva consulta" para agregar la primera.</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Paciente</th>
              <th style={s.th}>Médico</th>
              <th style={s.th}>Fecha</th>
              <th style={s.th}>Motivo</th>
              <th style={s.th}>Diagnóstico</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {consultas.map(c => (
              <tr key={c.id}>
                <td style={{ ...s.td, color: '#94a3b8', fontWeight: '500' }}>{c.id}</td>
                <td style={{ ...s.td, fontWeight: '600', color: '#1e293b' }}>
                  {pacienteMap[c.id_paciente] ?? `Paciente #${c.id_paciente}`}
                </td>
                <td style={s.td}>
                  {c.medico ? <span style={s.badge}>{c.medico.nombre}</span> : '—'}
                </td>
                <td style={s.td}>{new Date(c.fecha).toLocaleDateString('es-DO')}</td>
                <td style={s.td}>{c.motivo ?? '—'}</td>
                <td style={{ ...s.td, maxWidth: '220px' }}>
                  {c.notas
                    ? <span style={{ color: '#334155', fontSize: '13px' }}>{c.notas.length > 60 ? c.notas.slice(0, 60) + '...' : c.notas}</span>
                    : <span style={{ color: '#94a3b8', fontSize: '13px' }}>Sin diagnóstico</span>
                  }
                </td>
                <td style={s.td}>
                  <button style={s.btnVer} onClick={() => setConsultaDetalle(c)}>Ver detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <p style={s.modalTitle}>Nueva consulta</p>
            <p style={s.modalSub}>Registra los datos de la consulta médica</p>

            {formError && <p style={s.error}>{formError}</p>}

            <form onSubmit={handleSubmit}>
              <p style={s.sectionLabel}>Datos generales</p>
              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Paciente *</label>
                  <select style={s.select} name="id_paciente" value={form.id_paciente} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                    ))}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Médico</label>
                  <select style={s.select} name="id_medico" value={form.id_medico} onChange={handleChange}>
                    <option value="">Seleccionar...</option>
                    {medicos.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Fecha</label>
                  <input style={s.input} type="date" name="fecha" value={form.fecha} onChange={handleChange} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Motivo de consulta</label>
                  <input style={s.input} name="motivo" value={form.motivo} onChange={handleChange} placeholder="Ej. Dolor de cabeza" />
                </div>
              </div>

              <div style={{ ...s.field, marginBottom: '20px' }}>
                <label style={s.label}>Notas / Diagnóstico</label>
                <textarea style={s.textarea} name="notas" value={form.notas} onChange={handleChange} placeholder="Observaciones, diagnóstico, tratamiento..." />
              </div>

              <p style={s.sectionLabel}>Signos vitales <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(opcional)</span></p>
              <div style={s.grid3}>
                <div style={s.field}>
                  <label style={s.labelOpt}>Peso (kg)</label>
                  <input style={s.input} type="number" step="0.1" name="peso_kg" value={form.peso_kg} onChange={handleChange} placeholder="70.5" />
                </div>
                <div style={s.field}>
                  <label style={s.labelOpt}>Presión arterial</label>
                  <input style={s.input} name="presion" value={form.presion} onChange={handleChange} placeholder="120/80" />
                </div>
                <div style={s.field}>
                  <label style={s.labelOpt}>Temperatura (°C)</label>
                  <input style={s.input} type="number" step="0.1" name="temperatura" value={form.temperatura} onChange={handleChange} placeholder="37.0" />
                </div>
              </div>

              <div style={s.modalFooter}>
                <button type="button" style={s.btnCancel} onClick={closeModal}>Cancelar</button>
                <button type="submit" style={s.btnSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar consulta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {consultaDetalle && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setConsultaDetalle(null)}>
          <div style={s.detailModal}>
            <div style={s.detailHeader}>
              <div>
                <p style={s.detailTitle}>Detalle de consulta #{consultaDetalle.id}</p>
                <p style={s.detailFecha}>{new Date(consultaDetalle.fecha).toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button style={s.btnClose} onClick={() => setConsultaDetalle(null)}>✕</button>
            </div>

            <div style={s.detailSection}>
              <p style={s.detailSectionTitle}>Información general</p>
              <div style={s.detailGrid}>
                <div style={s.detailItem}>
                  <span style={s.detailItemLabel}>Paciente</span>
                  <span style={s.detailItemValue}>{pacienteMap[consultaDetalle.id_paciente] ?? `#${consultaDetalle.id_paciente}`}</span>
                </div>
                <div style={s.detailItem}>
                  <span style={s.detailItemLabel}>Médico</span>
                  <span style={s.detailItemValue}>{consultaDetalle.medico?.nombre ?? '—'}</span>
                </div>
                <div style={s.detailItem}>
                  <span style={s.detailItemLabel}>Motivo</span>
                  <span style={s.detailItemValue}>{consultaDetalle.motivo ?? '—'}</span>
                </div>
              </div>
            </div>

            <div style={s.detailSection}>
              <p style={s.detailSectionTitle}>Diagnóstico / Notas</p>
              {consultaDetalle.notas
                ? <div style={s.diagBox}>{consultaDetalle.notas}</div>
                : <div style={s.diagEmpty}>Sin diagnóstico registrado</div>
              }
            </div>

            {(consultaDetalle.peso_kg || consultaDetalle.presion || consultaDetalle.temperatura) && (
              <div style={s.detailSection}>
                <p style={s.detailSectionTitle}>Signos vitales</p>
                <div style={s.vitalsGrid}>
                  {consultaDetalle.peso_kg && (
                    <div style={s.vitalCard}>
                      <p style={s.vitalCardValue}>{consultaDetalle.peso_kg} kg</p>
                      <p style={s.vitalCardLabel}>Peso</p>
                    </div>
                  )}
                  {consultaDetalle.presion && (
                    <div style={s.vitalCard}>
                      <p style={s.vitalCardValue}>{consultaDetalle.presion}</p>
                      <p style={s.vitalCardLabel}>Presión arterial</p>
                    </div>
                  )}
                  {consultaDetalle.temperatura && (
                    <div style={s.vitalCard}>
                      <p style={s.vitalCardValue}>{consultaDetalle.temperatura}°C</p>
                      <p style={s.vitalCardLabel}>Temperatura</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
