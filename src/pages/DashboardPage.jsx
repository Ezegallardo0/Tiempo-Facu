import { useAuth } from '../context/useAuth';
import { useAppData } from '../context/AppDataContext';
import { getSubjectAcademicEvaluation } from '../utils/academicEvaluation';
import { CalendarIcon, AwardIcon } from '../components/Icons';
import { ListChecksIcon } from '../components/ui/Icons2';
import EmptyState from '../components/ui/EmptyState';

function KpiCard({ emoji, label, value, sub, color }) {
  return (
    <div className={`kpi-card-v2 ${color}`}>
      <div className="kpi-top"><span className="kpi-label-v2">{label}</span><span className="kpi-emoji-v2">{emoji}</span></div>
      <div className="kpi-value-v2">{value}</div>
      {sub && <span className="kpi-sub-v2">{sub}</span>}
    </div>
  );
}

function UpcomingCard({ event, subject }) {
  const daysLeft = Math.ceil((new Date(event.date) - new Date()) / 86400000);
  const color = daysLeft <= 3 ? 'danger' : daysLeft <= 7 ? 'warning' : 'normal';
  const typeEmoji = { parcial: '📝', final: '🎓', recup: '🔄', recuperatorio: '🔄', entrega: '📤', clase: '📚', evento: '📌' };
  return (
    <div className={`upcoming-card upcoming-${color}`}>
      <div className="upcoming-countdown">
        <span className="upcoming-days">{daysLeft < 0 ? 'Vencido' : daysLeft === 0 ? 'Hoy' : `${daysLeft}d`}</span>
      </div>
      <div className="upcoming-info">
        <span className="upcoming-emoji">{typeEmoji[event.type] || '📌'}</span>
        <div>
          <p className="upcoming-title">{event.title}</p>
          <p className="upcoming-meta">{subject?.name || 'Sin materia'} · {event.date}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const { tasks, subjects, events } = useAppData();

  const today = new Date().toISOString().split('T')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '☀️ Buenos días' : hour < 19 ? '🌤️ Buenas tardes' : '🌙 Buenas noches';

  const doneTasks = tasks.filter(t => t.done).length;
  const pendingTasks = tasks.filter(t => !t.done).length;
  const overdueTasks = tasks.filter(t => !t.done && t.dueDate && t.dueDate < today).length;

  const promoCount = subjects.filter(s => getSubjectAcademicEvaluation(s).statusKey === 'promocionada').length;
  const regularCount = subjects.filter(s => getSubjectAcademicEvaluation(s).statusKey === 'regular').length;

  const upcoming = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const urgentTasks = tasks
    .filter(t => !t.done && (t.priority === 'urgente' || t.priority === 'alta'))
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 4);

  const getSubject = (id) => subjects.find(s => s.id === id);

  return (
    <div className="page-dashboard">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <div>
          <h2 className="greeting-title">{greeting}, {user?.name?.split(' ')[0] || 'Estudiante'}! 🎒</h2>
          <p className="greeting-sub">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="greeting-actions">
          <button className="btn-primary" onClick={() => onNavigate('tareas')}>+ Nueva tarea</button>
          <button className="btn-secondary" onClick={() => onNavigate('calendario')}>Ver calendario</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="kpi-strip-v2">
        <KpiCard emoji="📚" label="Materias" value={subjects.length} sub={`${promoCount} promocionadas`} color="lavender" />
        <KpiCard emoji="✅" label="Tareas hechas" value={doneTasks} sub={`${pendingTasks} pendientes`} color="mint" />
        <KpiCard emoji="⚠️" label="Vencidas" value={overdueTasks} sub={overdueTasks > 0 ? '¡Atención!' : '¡Al día!'} color={overdueTasks > 0 ? 'peach' : 'mint'} />
        <KpiCard emoji="🎉" label="Promocionadas" value={promoCount} sub={`${regularCount} a final`} color="yellow" />
      </div>

      <div className="dashboard-columns">
        {/* Upcoming events */}
        <div className="dashboard-col">
          <div className="section-row-header">
            <h3 className="section-col-title"><CalendarIcon size={16} /> Próximos eventos</h3>
            <button className="link-btn" onClick={() => onNavigate('calendario')}>Ver todo →</button>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState emoji="🗓️" title="Sin eventos próximos" description="Agregá fechas de parciales o entregas en el calendario." />
          ) : (
            upcoming.map(e => <UpcomingCard key={e.id} event={e} subject={getSubject(e.subjectId)} />)
          )}
        </div>

        {/* Urgent tasks */}
        <div className="dashboard-col">
          <div className="section-row-header">
            <h3 className="section-col-title"><ListChecksIcon size={16} /> Tareas urgentes</h3>
            <button className="link-btn" onClick={() => onNavigate('tareas')}>Ver todo →</button>
          </div>
          {urgentTasks.length === 0 ? (
            <EmptyState emoji="🌿" title="Sin tareas urgentes" description="¡Estás al día! No hay tareas de alta prioridad pendientes." />
          ) : (
            urgentTasks.map(t => (
              <div key={t.id} className={`dashboard-task-row priority-${t.priority}`}>
                <div>
                  <p className="dash-task-title">{t.title}</p>
                  <p className="dash-task-meta">{getSubject(t.subjectId)?.name || 'Sin materia'} · {t.dueDate || 'Sin fecha'}</p>
                </div>
                <span className={`priority-dot dot-${t.priority}`}></span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Subjects quick view */}
      <div className="section-row-header" style={{ marginTop: '1.5rem' }}>
        <h3 className="section-col-title"><AwardIcon size={16} /> Estado de materias</h3>
        <button className="link-btn" onClick={() => onNavigate('materias')}>Gestionar →</button>
      </div>
      <div className="dashboard-subjects-strip">
        {subjects.map(s => {
          const ev = getSubjectAcademicEvaluation(s);
          return (
            <div key={s.id} className={`subject-strip-card color-${s.color}`}>
              <div className="strip-name">{s.name}</div>
              <span className={`eval-pill-badge ${ev.badgeClass}`}>{ev.pillText}</span>
            </div>
          );
        })}
        {subjects.length === 0 && (
          <EmptyState emoji="📖" title="Sin materias" description="Agregá tus materias para ver el estado académico." action={<button className="btn-primary" onClick={() => onNavigate('materias')}>Agregar materia</button>} />
        )}
      </div>
    </div>
  );
}
