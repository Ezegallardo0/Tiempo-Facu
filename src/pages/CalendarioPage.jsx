import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { TypeBadge } from '../components/ui/Badge';
import { PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '../components/Icons';

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const EVENT_TYPES = ['parcial','recuperatorio','final','entrega','clase','evento'];
const TYPE_COLORS = { parcial: 'lavender', recuperatorio: 'peach', recup: 'peach', final: 'mint', entrega: 'yellow', clase: 'sky', evento: 'default' };

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevLast = new Date(year, month, 0).getDate();
  const grid = [];
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevLast - i;
    const dt = new Date(year, month - 1, d);
    grid.push({ dateStr: `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, day: d, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push({ dateStr: `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, day: d, current: true });
  }
  const rem = (7 - (grid.length % 7)) % 7;
  for (let d = 1; d <= rem; d++) {
    const dt = new Date(year, month + 1, d);
    grid.push({ dateStr: `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, day: d, current: false });
  }
  return grid;
}

const EMPTY_EV = { title: '', subjectId: '', date: new Date().toISOString().split('T')[0], time: '09:00', type: 'parcial', classroom: '', notes: '' };

export default function CalendarioPage() {
  const { events, subjects, addEvent, deleteEvent } = useAppData();
  const toast = useToast();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(now.toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('todos');
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_EV, date: selected });

  const today = now.toISOString().split('T')[0];
  const grid = getMonthGrid(year, month);

  const getSubject = (id) => subjects.find(s => s.id === id);

  const filteredEvents = events.filter(e => filterType === 'todos' || (e.type === 'recup' ? 'recuperatorio' : e.type) === filterType);
  const dayEvents = filteredEvents.filter(e => e.date === selected);
  const upcoming = filteredEvents.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addEvent(form);
    setShowAdd(false);
    setForm({ ...EMPTY_EV, date: selected });
    toast('Evento agregado ✓');
  };

  const eventCountForDay = (dateStr) => filteredEvents.filter(e => e.date === dateStr).length;

  return (
    <div className="page-calendario">
      <div className="calendario-layout">
        {/* Calendar grid */}
        <div className="calendar-main">
          <div className="cal-header">
            <button className="icon-btn" onClick={prevMonth}><ChevronLeftIcon size={20} /></button>
            <h2 className="cal-month-title">{MONTH_NAMES[month]} {year}</h2>
            <button className="icon-btn" onClick={nextMonth}><ChevronRightIcon size={20} /></button>
            <button className="btn-secondary cal-today-btn" onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelected(today); }}>Hoy</button>
          </div>

          {/* Filter */}
          <div className="cal-filters">
            {['todos', ...EVENT_TYPES].map(t => (
              <button key={t} onClick={() => setFilterType(t)} className={`cal-filter-pill ${filterType === t ? 'active' : ''} ${t !== 'todos' ? `color-${TYPE_COLORS[t]}` : ''}`}>
                {t === 'todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="cal-grid">
            {DAY_NAMES.map(d => <div key={d} className="cal-dayname">{d}</div>)}
            {grid.map(cell => {
              const count = eventCountForDay(cell.dateStr);
              const isToday = cell.dateStr === today;
              const isSelected = cell.dateStr === selected;
              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelected(cell.dateStr)}
                  className={`cal-cell ${!cell.current ? 'other-month' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                >
                  <span className="cal-cell-day">{cell.day}</span>
                  {count > 0 && <div className="cal-dots">{Array.from({ length: Math.min(count, 3) }).map((_, i) => <span key={i} className="cal-dot" />)}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="calendar-side">
          {/* Selected day events */}
          <div className="cal-day-panel">
            <div className="cal-day-header">
              <span className="cal-day-label">{selected}</span>
              <button className="btn-primary btn-sm" onClick={() => { setForm({ ...EMPTY_EV, date: selected }); setShowAdd(true); }}>
                <PlusIcon size={14} /> Agregar
              </button>
            </div>
            {dayEvents.length === 0 ? (
              <p className="cal-empty-day">Sin eventos este día</p>
            ) : (
              dayEvents.map(ev => (
                <div key={ev.id} className={`cal-event-card color-${TYPE_COLORS[ev.type] || 'default'}`}>
                  <div className="cal-event-top">
                    <TypeBadge type={ev.type} />
                    <button className="icon-btn danger" onClick={() => setToDelete(ev)}><TrashIcon size={13} /></button>
                  </div>
                  <p className="cal-event-title">{ev.title}</p>
                  {ev.time && <p className="cal-event-meta">🕐 {ev.time}{ev.classroom ? ` · ${ev.classroom}` : ''}</p>}
                  {getSubject(ev.subjectId) && <p className="cal-event-meta">📖 {getSubject(ev.subjectId).name}</p>}
                  {ev.notes && <p className="cal-event-notes">{ev.notes}</p>}
                </div>
              ))
            )}
          </div>

          {/* Upcoming */}
          <div className="cal-upcoming">
            <h3 className="cal-upcoming-title"><CalendarIcon size={15} /> Próximos eventos</h3>
            {upcoming.map(ev => {
              const days = Math.ceil((new Date(ev.date) - new Date(today)) / 86400000);
              return (
                <div key={ev.id} className="cal-upcoming-row">
                  <div className={`cal-upcoming-days ${days <= 3 ? 'urgent' : ''}`}>{days}d</div>
                  <div>
                    <p className="cal-upcoming-name">{ev.title}</p>
                    <p className="cal-upcoming-date">{ev.date} {ev.time || ''}</p>
                  </div>
                </div>
              );
            })}
            {upcoming.length === 0 && <p className="cal-empty-day">Sin próximos eventos</p>}
          </div>
        </div>
      </div>

      {/* Add event modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Agregar evento" size="md">
        <form onSubmit={handleAddEvent} className="form-v2">
          <label className="form-field"><span>Título *</span><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="2° Parcial, Entrega TP..." required /></label>
          <div className="form-row-2">
            <label className="form-field"><span>Fecha</span><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></label>
            <label className="form-field"><span>Hora</span><input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></label>
          </div>
          <div className="form-row-2">
            <label className="form-field"><span>Tipo</span>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </label>
            <label className="form-field"><span>Materia</span>
              <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
                <option value="">Sin materia</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
          </div>
          <label className="form-field"><span>Aula</span><input value={form.classroom} onChange={e => setForm(f => ({ ...f, classroom: e.target.value }))} placeholder="Aula 302" /></label>
          <label className="form-field"><span>Notas</span><textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></label>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar evento</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={() => { deleteEvent(toDelete.id); toast('Evento eliminado'); }}
        title="Eliminar evento" message={`¿Eliminar "${toDelete?.title}"?`} />
    </div>
  );
}
