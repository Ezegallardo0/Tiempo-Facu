import { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { PriorityBadge, StatusBadge } from '../components/ui/Badge';
import { PlusIcon, TrashIcon, PencilIcon, CheckCircleIcon, ClockIcon } from '../components/Icons';
import { KanbanIcon, ListChecksIcon, CopyIcon } from '../components/ui/Icons2';

const PRIORITIES = ['baja', 'media', 'alta', 'urgente'];
const STATUSES = ['pendiente', 'en_progreso', 'completada'];
const CATEGORIES = ['tp', 'parcial', 'final', 'lectura', 'proyecto', 'otro'];
const KANBAN_COLS = [
  { id: 'pendiente',   label: '📋 Pendiente' },
  { id: 'en_progreso', label: '⚡ En progreso' },
  { id: 'completada',  label: '✅ Completada' },
];

const EMPTY_FORM = { title: '', description: '', subjectId: '', dueDate: '', dueTime: '', priority: 'media', status: 'pendiente', category: 'tp', subtasks: [], tags: [] };

function TaskForm({ initial = EMPTY_FORM, subjects, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const [subInput, setSubInput] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addSubtask = () => {
    if (!subInput.trim()) return;
    set('subtasks', [...(form.subtasks || []), { id: `st_${Date.now()}`, text: subInput.trim(), done: false }]);
    setSubInput('');
  };
  const toggleSub = (id) => set('subtasks', form.subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s));
  const removeSub = (id) => set('subtasks', form.subtasks.filter(s => s.id !== id));

  const handleSubmit = (e) => { e.preventDefault(); if (!form.title.trim()) return; onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="form-v2">
      <label className="form-field"><span>Título *</span><input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Nombre de la tarea" required /></label>
      <label className="form-field"><span>Descripción</span><textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detalles opcionales..." /></label>
      <div className="form-row-3">
        <label className="form-field"><span>Materia</span>
          <select value={form.subjectId} onChange={e => set('subjectId', e.target.value)}>
            <option value="">Sin materia</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="form-field"><span>Prioridad</span>
          <select value={form.priority} onChange={e => set('priority', e.target.value)}>
            {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </label>
        <label className="form-field"><span>Categoría</span>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'tp' ? 'Trabajo Práctico' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </label>
      </div>
      <div className="form-row-2">
        <label className="form-field"><span>Fecha de vencimiento</span><input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} /></label>
        <label className="form-field"><span>Hora</span><input type="time" value={form.dueTime} onChange={e => set('dueTime', e.target.value)} /></label>
      </div>
      <label className="form-field"><span>Estado</span>
        <select value={form.status} onChange={e => set('status', e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s === 'en_progreso' ? 'En progreso' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </label>

      {/* Subtasks */}
      <div className="form-field">
        <span>Subtareas / Checklist</span>
        <div className="subtask-add-row">
          <input value={subInput} onChange={e => setSubInput(e.target.value)} placeholder="Agregar subtarea..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())} />
          <button type="button" className="btn-secondary" onClick={addSubtask}>+ Agregar</button>
        </div>
        {(form.subtasks || []).map(st => (
          <div key={st.id} className="subtask-row">
            <input type="checkbox" checked={st.done} onChange={() => toggleSub(st.id)} />
            <span className={st.done ? 'subtask-done' : ''}>{st.text}</span>
            <button type="button" className="icon-btn danger" onClick={() => removeSub(st.id)}>✕</button>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar tarea</button>
      </div>
    </form>
  );
}

function TaskRow({ task, subject, onToggle, onEdit, onDelete, onDuplicate }) {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = !task.done && task.dueDate && task.dueDate < today;
  const doneSubs = (task.subtasks || []).filter(s => s.done).length;

  return (
    <div className={`task-row-v2 priority-left-${task.priority} ${task.done ? 'task-done' : ''} ${isOverdue ? 'task-overdue' : ''}`}>
      <button
        className={`task-check ${task.done ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? 'Marcar como pendiente' : 'Marcar como completada'}
      >
        {task.done && <CheckCircleIcon size={16} />}
      </button>
      <div className="task-row-content">
        <div className="task-row-top">
          <span className={`task-row-title ${task.done ? 'line-through' : ''}`}>{task.title}</span>
          <div className="task-row-badges">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>
        <div className="task-row-meta">
          {subject && <span className="task-subject-pill">{subject.name}</span>}
          {task.dueDate && <span className={`task-due ${isOverdue ? 'overdue-text' : ''}`}><ClockIcon size={12} /> {task.dueDate}{task.dueTime ? ` ${task.dueTime}` : ''}</span>}
          {task.subtasks?.length > 0 && <span className="task-subtask-count">{doneSubs}/{task.subtasks.length} subtareas</span>}
        </div>
      </div>
      <div className="task-row-actions">
        <button className="icon-btn" onClick={() => onDuplicate(task)} title="Duplicar"><CopyIcon size={14} /></button>
        <button className="icon-btn" onClick={() => onEdit(task)} title="Editar"><PencilIcon size={14} /></button>
        <button className="icon-btn danger" onClick={() => onDelete(task)} title="Eliminar"><TrashIcon size={14} /></button>
      </div>
    </div>
  );
}

export default function TareasPage() {
  const { tasks, subjects, addTask, updateTask, deleteTask, toggleTask } = useAppData();
  const toast = useToast();
  const [view, setView] = useState('lista'); // lista | kanban
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [filterPriority, setFilterPriority] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [filterSubject, setFilterSubject] = useState('todas');
  const [search, setSearch] = useState('');

  const getSubject = (id) => subjects.find(s => s.id === id);

  const filtered = useMemo(() => tasks.filter(t => {
    if (filterPriority !== 'todas' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'todas' && t.status !== filterStatus) return false;
    if (filterSubject !== 'todas' && t.subjectId !== filterSubject) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tasks, filterPriority, filterStatus, filterSubject, search]);

  const handleAdd = (data) => { addTask(data); setShowAdd(false); toast('Tarea creada ✓'); };
  const handleEdit = (data) => { updateTask(editing.id, data); setEditing(null); toast('Tarea actualizada ✓'); };
  const handleDelete = () => { deleteTask(toDelete.id); toast('Tarea eliminada'); };
  const handleDuplicate = (task) => { addTask({ ...task, id: undefined, title: `${task.title} (copia)`, status: 'pendiente', done: false, createdAt: undefined }); toast('Tarea duplicada ✓'); };
  const handleToggle = (id) => { toggleTask(id); };

  const today = new Date().toISOString().split('T')[0];
  const stats = { total: tasks.length, done: tasks.filter(t => t.done).length, overdue: tasks.filter(t => !t.done && t.dueDate && t.dueDate < today).length };

  return (
    <div className="page-tareas">
      {/* Stats strip */}
      <div className="tasks-stats-row">
        <div className="task-stat-pill"><span>{stats.total}</span> Total</div>
        <div className="task-stat-pill mint"><span>{stats.done}</span> Completadas</div>
        <div className={`task-stat-pill ${stats.overdue > 0 ? 'danger' : 'mint'}`}><span>{stats.overdue}</span> Vencidas</div>
        <div className="task-stat-pill"><div className="mini-progress"><div className="mini-bar" style={{ width: stats.total > 0 ? `${(stats.done / stats.total) * 100}%` : '0%' }} /></div>{stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%</div>
      </div>

      {/* Toolbar */}
      <div className="tasks-toolbar">
        <input className="search-input" placeholder="🔍 Buscar tarea..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="todas">Prioridad: Todas</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="todas">Estado: Todos</option>
          {STATUSES.map(s => <option key={s} value={s}>{s === 'en_progreso' ? 'En progreso' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select className="filter-select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
          <option value="todas">Materia: Todas</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <div className="view-toggle">
          <button className={`view-btn ${view === 'lista' ? 'active' : ''}`} onClick={() => setView('lista')}><ListChecksIcon size={16} /></button>
          <button className={`view-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}><KanbanIcon size={16} /></button>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><PlusIcon size={16} /> Nueva tarea</button>
      </div>

      {/* List view */}
      {view === 'lista' && (
        filtered.length === 0 ? (
          <EmptyState
            emoji="✅"
            title="Sin tareas"
            description={search || filterPriority !== 'todas' || filterStatus !== 'todas' || filterSubject !== 'todas' ? 'No hay tareas que coincidan con los filtros seleccionados.' : 'Creá tu primera tarea para empezar.'}
            action={!search && filterPriority === 'todas' && filterStatus === 'todas' && filterSubject === 'todas' && <button className="btn-primary" onClick={() => setShowAdd(true)}>Crear tarea</button>}
          />
        ) : (
          <div className="task-list-v2">
            {filtered.map(t => <TaskRow key={t.id} task={t} subject={getSubject(t.subjectId)} onToggle={handleToggle} onEdit={setEditing} onDelete={setToDelete} onDuplicate={handleDuplicate} />)}
          </div>
        )
      )}

      {/* Kanban view */}
      {view === 'kanban' && (
        <div className="kanban-board">
          {KANBAN_COLS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="kanban-col">
                <div className="kanban-col-header">
                  <span>{col.label}</span>
                  <span className="kanban-count">{colTasks.length}</span>
                </div>
                <div className="kanban-col-body">
                  {colTasks.map(t => (
                    <div key={t.id} className={`kanban-card priority-left-${t.priority}`} onClick={() => setEditing(t)}>
                      <p className="kanban-card-title">{t.title}</p>
                      <div className="kanban-card-meta">
                        {getSubject(t.subjectId) && <span className="task-subject-pill">{getSubject(t.subjectId).name}</span>}
                        <PriorityBadge priority={t.priority} />
                      </div>
                      {t.dueDate && <p className="kanban-due"><ClockIcon size={11} /> {t.dueDate}</p>}
                    </div>
                  ))}
                  {colTasks.length === 0 && <div className="kanban-empty">Sin tareas</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nueva tarea" size="lg">
        <TaskForm subjects={subjects} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Editar tarea" size="lg">
        {editing && <TaskForm initial={editing} subjects={subjects} onSave={handleEdit} onCancel={() => setEditing(null)} />}
      </Modal>
      <ConfirmDialog isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={handleDelete}
        title="Eliminar tarea" message={`¿Eliminar "${toDelete?.title}"?`} />
    </div>
  );
}
