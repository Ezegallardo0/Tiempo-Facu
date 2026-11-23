import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { PlusIcon, TrashIcon } from '../components/Icons';
import { TagIcon, SaveIcon } from '../components/ui/Icons2';

const COLORS = ['lavender', 'mint', 'yellow', 'peach', 'sky'];
const EMPTY_NOTE = { title: '', content: '', subjectId: '', tags: [], color: 'lavender' };

function NoteCard({ note, subject, onEdit, onDelete }) {
  const preview = note.content.length > 120 ? note.content.slice(0, 120) + '…' : note.content;
  return (
    <div className={`note-card-v2 color-${note.color}`} onClick={() => onEdit(note)}>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title || 'Sin título'}</h3>
        <button className="icon-btn danger" onClick={e => { e.stopPropagation(); onDelete(note); }}><TrashIcon size={13} /></button>
      </div>
      {subject && <span className="note-subject-tag">{subject.name}</span>}
      <p className="note-card-preview">{preview || 'Sin contenido...'}</p>
      <div className="note-card-footer">
        <div className="note-tags-row">{(note.tags || []).map(t => <span key={t} className="note-tag">{t}</span>)}</div>
        <span className="note-date">{note.updatedAt}</span>
      </div>
    </div>
  );
}

function NoteEditor({ initial = EMPTY_NOTE, subjects, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_NOTE, ...initial });
  const [tagInput, setTagInput] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    if (!tagInput.trim()) return;
    set('tags', [...(form.tags || []), tagInput.trim()]);
    setTagInput('');
  };
  const removeTag = (t) => set('tags', form.tags.filter(x => x !== t));

  return (
    <div className="note-editor">
      <div className="note-editor-toolbar">
        <input className="note-title-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Título de la nota..." />
        <div className="note-editor-meta">
          <select className="filter-select" value={form.subjectId} onChange={e => set('subjectId', e.target.value)}>
            <option value="">Sin materia</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="color-picker-row">
            {COLORS.map(c => <button key={c} type="button" onClick={() => set('color', c)} className={`color-dot-pick color-${c} ${form.color === c ? 'selected' : ''}`} />)}
          </div>
        </div>
      </div>

      <textarea
        className="note-content-area"
        rows={12}
        value={form.content}
        onChange={e => set('content', e.target.value)}
        placeholder="Escribí tu nota, resumen o apunte aquí..."
      />

      <div className="note-tags-editor">
        <div className="subtask-add-row">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Agregar etiqueta..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
          <button type="button" className="btn-secondary" onClick={addTag}><TagIcon size={14} /> Tag</button>
        </div>
        <div className="note-tags-row">{(form.tags || []).map(t => <span key={t} className="note-tag">{t} <button onClick={() => removeTag(t)}>✕</button></span>)}</div>
      </div>

      <div className="form-actions">
        <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" onClick={() => onSave(form)}><SaveIcon size={15} /> Guardar nota</button>
      </div>
    </div>
  );
}

export default function NotasPage() {
  const { notes, subjects, addNote, updateNote, deleteNote } = useAppData();
  const toast = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('todas');

  const getSubject = (id) => subjects.find(s => s.id === id);

  const filtered = notes.filter(n => {
    if (filterSubject !== 'todas' && n.subjectId !== filterSubject) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = (data) => { addNote(data); setShowAdd(false); toast('Nota guardada ✓'); };
  const handleEdit = (note) => setEditing(note);
  const handleSaveEdit = (data) => { updateNote(editing.id, data); setEditing(null); toast('Nota actualizada ✓'); };
  const handleDelete = () => { deleteNote(toDelete.id); toast('Nota eliminada'); };

  return (
    <div className="page-notas">
      <div className="page-topbar">
        <div className="toolbar-left">
          <input className="search-input" placeholder="🔍 Buscar notas..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="filter-select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="todas">Todas las materias</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><PlusIcon size={16} /> Nueva nota</button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="📝" title="Sin notas" description={search ? 'Ninguna nota coincide con la búsqueda.' : 'Creá tu primer apunte o resumen.'} action={!search && <button className="btn-primary" onClick={() => setShowAdd(true)}>Crear primera nota</button>} />
      ) : (
        <div className="notes-masonry">
          {filtered.map(n => <NoteCard key={n.id} note={n} subject={getSubject(n.subjectId)} onEdit={handleEdit} onDelete={setToDelete} />)}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nueva nota" size="lg">
        <NoteEditor subjects={subjects} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Editar nota" size="lg">
        {editing && <NoteEditor initial={editing} subjects={subjects} onSave={handleSaveEdit} onCancel={() => setEditing(null)} />}
      </Modal>
      <ConfirmDialog isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={handleDelete}
        title="Eliminar nota" message={`¿Eliminar "${toDelete?.title}"?`} />
    </div>
  );
}
