import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { TypeBadge } from '../components/ui/Badge';
import { PlusIcon, TrashIcon, PencilIcon, ClockIcon } from '../components/Icons';

const EXAM_TYPES = ['parcial', 'recuperatorio', 'final'];
const EMPTY_EXAM = { name: '', subjectId: '', date: '', time: '08:00', type: 'parcial', topics: '', preparationLevel: 0, notes: '', grade: null };

function CountdownBadge({ date }) {
  const days = Math.ceil((new Date(date) - new Date()) / 86400000);
  if (days < 0) return <span className="countdown-badge past">Realizado</span>;
  if (days === 0) return <span className="countdown-badge today">¡Hoy!</span>;
  if (days <= 3) return <span className="countdown-badge urgent">{days}d 🔥</span>;
  if (days <= 7) return <span className="countdown-badge soon">{days}d ⚡</span>;
  return <span className="countdown-badge normal">{days} días</span>;
}

function PrepBar({ level, onChange }) {
  return (
    <div className="prep-bar-wrap">
      <div className="prep-bar-track"><div className="prep-bar-fill" style={{ width: `${level}%`, background: level >= 70 ? '#4ade80' : level >= 40 ? '#fbbf24' : '#f87171' }} /></div>
      <span className="prep-bar-label">{level}% preparado</span>
      {onChange && <input type="range" min="0" max="100" value={level} onChange={e => onChange(Number(e.target.value))} className="prep-range" />}
    </div>
  );
}

function ExamCard({ exam, subject, onEdit, onDelete, onUpdatePrep }) {
  const upcoming = new Date(exam.date) >= new Date();
  return (
    <div className={`exam-card-v2 ${upcoming ? 'exam-upcoming' : 'exam-past'}`}>
      <div className="exam-card-header">
        <div>
          <div className="exam-badges-row"><TypeBadge type={exam.type} /><CountdownBadge date={exam.date} /></div>
          <h3 className="exam-name">{exam.name}</h3>
          <p className="exam-subject">{subject?.name || 'Sin materia'}</p>
        </div>
        <div className="exam-card-actions">
          <button className="icon-btn" onClick={() => onEdit(exam)}><PencilIcon size={15} /></button>
          <button className="icon-btn danger" onClick={() => onDelete(exam)}><TrashIcon size={15} /></button>
        </div>
      </div>

      <div className="exam-card-info">
        <span className="exam-info-row"><ClockIcon size={13} /> {exam.date}{exam.time ? ` a las ${exam.time}` : ''}</span>
        {exam.topics && <p className="exam-topics"><strong>Temario:</strong> {exam.topics}</p>}
        {exam.grade !== null && exam.grade !== undefined && (
          <div className={`exam-grade ${exam.grade >= 7 ? 'grade-promo' : exam.grade >= 4 ? 'grade-regular' : 'grade-low'}`}>
            Nota: <strong>{exam.grade}</strong> {exam.grade >= 7 ? '🎉 Promoción!' : exam.grade >= 4 ? '✓ Regular' : '✗ Aplazado'}
          </div>
        )}
      </div>

      {upcoming && (
        <PrepBar level={exam.preparationLevel || 0} onChange={lvl => onUpdatePrep(exam.id, lvl)} />
      )}
    </div>
  );
}

function ExamForm({ initial = EMPTY_EXAM, subjects, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_EXAM, ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = (e) => { e.preventDefault(); if (!form.name.trim()) return; onSave(form); };
  return (
    <form onSubmit={handleSubmit} className="form-v2">
      <div className="form-row-2">
        <label className="form-field"><span>Nombre *</span><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="2° Parcial" required /></label>
        <label className="form-field"><span>Tipo</span>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {EXAM_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </label>
      </div>
      <label className="form-field"><span>Materia</span>
        <select value={form.subjectId} onChange={e => set('subjectId', e.target.value)}>
          <option value="">Sin materia</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>
      <div className="form-row-2">
        <label className="form-field"><span>Fecha</span><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></label>
        <label className="form-field"><span>Hora</span><input type="time" value={form.time} onChange={e => set('time', e.target.value)} /></label>
      </div>
      <label className="form-field"><span>Temario</span><textarea rows={2} value={form.topics} onChange={e => set('topics', e.target.value)} placeholder="Temas que entran en el examen..." /></label>
      <label className="form-field"><span>Nivel de preparación: {form.preparationLevel}%</span>
        <input type="range" min="0" max="100" value={form.preparationLevel} onChange={e => set('preparationLevel', Number(e.target.value))} className="prep-range" />
      </label>
      <div className="form-row-2">
        <label className="form-field"><span>Nota obtenida (si ya rindiste)</span><input type="number" min="1" max="10" value={form.grade ?? ''} onChange={e => set('grade', e.target.value === '' ? null : Number(e.target.value))} placeholder="—" /></label>
        <div className="form-field" />
      </div>
      <label className="form-field"><span>Notas personales</span><textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} /></label>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar examen</button>
      </div>
    </form>
  );
}

export default function ExamenesPage() {
  const { exams, subjects, addExam, updateExam, deleteExam } = useAppData();
  const toast = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [filterType, setFilterType] = useState('todos');

  const today = new Date().toISOString().split('T')[0];
  const getSubject = (id) => subjects.find(s => s.id === id);

  const upcoming = exams.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = exams.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  const _filtered = filterType === 'todos' ? exams : exams.filter(e => e.type === filterType);

  const handleAdd = (data) => { addExam(data); setShowAdd(false); toast('Examen registrado ✓'); };
  const handleEdit = (data) => { updateExam(editing.id, data); setEditing(null); toast('Examen actualizado ✓'); };
  const handleDelete = () => { deleteExam(toDelete.id); toast('Examen eliminado'); };
  const handleUpdatePrep = (id, level) => updateExam(id, { preparationLevel: level });

  const nextExam = upcoming[0];
  const nextDays = nextExam ? Math.ceil((new Date(nextExam.date) - new Date()) / 86400000) : null;

  return (
    <div className="page-examenes">
      {/* Summary banner */}
      {nextExam && (
        <div className="exam-banner">
          <div className="exam-banner-left">
            <span className="exam-banner-label">Próximo examen</span>
            <h2 className="exam-banner-title">{nextExam.name} — {getSubject(nextExam.subjectId)?.name}</h2>
            <p className="exam-banner-date">{nextExam.date} a las {nextExam.time}</p>
          </div>
          <div className={`exam-banner-countdown ${nextDays <= 3 ? 'urgent' : ''}`}>
            <span className="exam-banner-days">{nextDays}</span>
            <span>días</span>
          </div>
        </div>
      )}

      <div className="page-topbar">
        <div className="filter-pills-row">
          {['todos', ...EXAM_TYPES].map(t => (
            <button key={t} className={`cal-filter-pill ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
              {t === 'todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><PlusIcon size={16} /> Registrar examen</button>
      </div>

      {exams.length === 0 ? (
        <EmptyState emoji="🎓" title="Sin exámenes" description="Registrá tus parciales, recuperatorios y finales para hacer seguimiento." action={<button className="btn-primary" onClick={() => setShowAdd(true)}>Agregar primer examen</button>} />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="exams-section">
              <h3 className="exams-section-title">📅 Próximos</h3>
              <div className="exams-grid">
                {upcoming.filter(e => filterType === 'todos' || e.type === filterType).map(e => (
                  <ExamCard key={e.id} exam={e} subject={getSubject(e.subjectId)} onEdit={setEditing} onDelete={setToDelete} onUpdatePrep={handleUpdatePrep} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div className="exams-section">
              <h3 className="exams-section-title">📋 Realizados</h3>
              <div className="exams-grid">
                {past.filter(e => filterType === 'todos' || e.type === filterType).map(e => (
                  <ExamCard key={e.id} exam={e} subject={getSubject(e.subjectId)} onEdit={setEditing} onDelete={setToDelete} onUpdatePrep={handleUpdatePrep} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Registrar examen" size="lg">
        <ExamForm subjects={subjects} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Editar examen" size="lg">
        {editing && <ExamForm initial={editing} subjects={subjects} onSave={handleEdit} onCancel={() => setEditing(null)} />}
      </Modal>
      <ConfirmDialog isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={handleDelete}
        title="Eliminar examen" message={`¿Eliminar "${toDelete?.name}"?`} />
    </div>
  );
}
