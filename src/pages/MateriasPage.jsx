import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { getSubjectAcademicEvaluation } from '../utils/academicEvaluation';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { PlusIcon, TrashIcon, PencilIcon, ClockIcon, MapPinIcon } from '../components/Icons';

const COLORS = ['lavender', 'mint', 'yellow', 'peach', 'sky'];
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const EMPTY_FORM = { name: '', code: '', day: 'Lunes', time: '08:00 - 12:00 hs', classroom: '', professor: '', commission: '', color: 'lavender', description: '' };

function SubjectCard({ subject, onEdit, onDelete }) {
  const ev = getSubjectAcademicEvaluation(subject);
  return (
    <div className={`subject-card-v2 color-${subject.color}`}>
      <div className="subj-card-header">
        <div className="subj-color-dot" style={{ background: `var(--color-${subject.color})` }}></div>
        <div className="subj-meta">
          <span className="subj-code">{subject.code || '—'} · {subject.commission ? `Com. ${subject.commission}` : 'Sin comisión'}</span>
          <h3 className="subj-name">{subject.name}</h3>
          <p className="subj-prof">Prof: {subject.professor || 'No asignado'}</p>
        </div>
        <div className="subj-actions-row">
          <button className="icon-btn" onClick={() => onEdit(subject)} title="Editar"><PencilIcon size={15} /></button>
          <button className="icon-btn danger" onClick={() => onDelete(subject)} title="Eliminar"><TrashIcon size={15} /></button>
        </div>
      </div>

      <div className="subj-schedule-row">
        <ClockIcon size={13} /><span>{subject.day} · {subject.time}</span>
        {subject.classroom && <><MapPinIcon size={13} /><span>{subject.classroom}</span></>}
      </div>

      <div className="subj-grades-row">
        {[['1°P', subject.p1], ['2°P', subject.p2], ['Recup1', subject.recup1], ['Recup2', subject.recup2], ['TP', subject.tp], ['Final', subject.finalExam]].map(([lbl, val]) => (
          val !== null && val !== undefined ? (
            <span key={lbl} className={`grade-chip ${val >= 7 ? 'grade-promo' : val >= 4 ? 'grade-regular' : 'grade-low'}`}>
              {lbl}: {val}
            </span>
          ) : null
        ))}
      </div>

      <div className="subj-card-footer">
        <span className={`eval-pill-badge ${ev.badgeClass}`}>{ev.pillText}</span>
        <span className="subj-hint-text">{ev.hint || ''}</span>
      </div>
    </div>
  );
}

function SubjectForm({ initial = EMPTY_FORM, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => { e.preventDefault(); if (!form.name.trim()) return; onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="form-v2">
      <div className="form-row-2">
        <label className="form-field"><span>Nombre *</span><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Análisis Matemático II" required /></label>
        <label className="form-field"><span>Código</span><input value={form.code} onChange={e => set('code', e.target.value)} placeholder="MAT-204" /></label>
      </div>
      <div className="form-row-2">
        <label className="form-field"><span>Profesor</span><input value={form.professor} onChange={e => set('professor', e.target.value)} placeholder="Dr. Alejandro Gómez" /></label>
        <label className="form-field"><span>Comisión</span><input value={form.commission} onChange={e => set('commission', e.target.value)} placeholder="02" /></label>
      </div>
      <div className="form-row-2">
        <label className="form-field"><span>Día</span>
          <select value={form.day} onChange={e => set('day', e.target.value)}>
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="form-field"><span>Horario</span><input value={form.time} onChange={e => set('time', e.target.value)} placeholder="08:00 - 12:00 hs" /></label>
      </div>
      <div className="form-row-2">
        <label className="form-field"><span>Aula</span><input value={form.classroom} onChange={e => set('classroom', e.target.value)} placeholder="Aula 302" /></label>
        <label className="form-field"><span>Color</span>
          <div className="color-picker-row">
            {COLORS.map(c => (
              <button type="button" key={c} onClick={() => set('color', c)}
                className={`color-dot-pick color-${c} ${form.color === c ? 'selected' : ''}`} />
            ))}
          </div>
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar materia</button>
      </div>
    </form>
  );
}

export default function MateriasPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAppData();
  const toast = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [gradeEdit, setGradeEdit] = useState(null);

  const handleAdd = (data) => { addSubject(data); setShowAdd(false); toast('Materia agregada ✓'); };
  const handleEdit = (data) => { updateSubject(editing.id, data); setEditing(null); toast('Materia actualizada ✓'); };
  const handleDelete = () => { deleteSubject(toDelete.id); toast('Materia eliminada'); };

  const handleGradeChange = (field, val) => {
    const num = val === '' ? null : Math.min(10, Math.max(1, Number(val)));
    setGradeEdit(g => ({ ...g, [field]: num }));
  };
  const handleGradeSave = () => { updateSubject(gradeEdit.id, gradeEdit); setGradeEdit(null); toast('Notas actualizadas ✓'); };

  return (
    <div className="page-materias">
      <div className="page-topbar">
        <p className="page-count">{subjects.length} materia{subjects.length !== 1 ? 's' : ''} cursando</p>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <PlusIcon size={16} /> Agregar materia
        </button>
      </div>

      {subjects.length === 0 ? (
        <EmptyState emoji="📖" title="Sin materias" description="Agregá tus materias para organizar tu cursada." action={<button className="btn-primary" onClick={() => setShowAdd(true)}>Agregar primera materia</button>} />
      ) : (
        <div className="subjects-grid-v2">
          {subjects.map(s => (
            <div key={s.id}>
              <SubjectCard
                subject={s}
                onEdit={(sub) => setEditing(sub)}
                onDelete={(sub) => setToDelete(sub)}
              />
              <button className="btn-grades-edit" onClick={() => setGradeEdit({ ...s })}>✏️ Editar notas</button>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Agregar materia" size="lg">
        <SubjectForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Editar materia" size="lg">
        {editing && <SubjectForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} />}
      </Modal>

      {/* Grade edit modal */}
      <Modal isOpen={!!gradeEdit} onClose={() => setGradeEdit(null)} title={`Notas — ${gradeEdit?.name}`} size="md">
        {gradeEdit && (
          <div className="grade-edit-grid">
            <p className="grade-rule-note">⚠️ En la universidad NO se promedia. Necesitás ≥7 en cada examen por separado para promocionar.</p>
            {[['p1','1° Parcial'],['p2','2° Parcial'],['recup1','Recup. 1°P'],['recup2','Recup. 2°P'],['tp','TP'],['finalExam','Examen Final']].map(([field, label]) => (
              <label key={field} className="form-field">
                <span>{label}</span>
                <input type="number" min="1" max="10" value={gradeEdit[field] ?? ''} onChange={e => handleGradeChange(field, e.target.value)} placeholder="—" />
              </label>
            ))}
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setGradeEdit(null)}>Cancelar</button>
              <button className="btn-primary" onClick={handleGradeSave}>Guardar notas</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={handleDelete}
        title="Eliminar materia" message={`¿Eliminar "${toDelete?.name}"? Se perderán todas sus notas y datos.`} />
    </div>
  );
}
