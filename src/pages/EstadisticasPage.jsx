import { useAppData } from '../context/AppDataContext';
import { getSubjectAcademicEvaluation } from '../utils/academicEvaluation';
import { TrendingUpIcon, BarChartIcon } from '../components/ui/Icons2';

function StatCard({ label, value, sub, color = 'lavender', big = false }) {
  return (
    <div className={`stat-card-v2 color-${color}`}>
      <span className="stat-label-v2">{label}</span>
      <span className={`stat-value-v2 ${big ? 'stat-big' : ''}`}>{value}</span>
      {sub && <span className="stat-sub-v2">{sub}</span>}
    </div>
  );
}

function BarChart({ data, maxVal }) {
  return (
    <div className="bar-chart-v2">
      {data.map(({ label, value, color }) => (
        <div key={label} className="bar-row">
          <span className="bar-label">{label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${maxVal > 0 ? (value / maxVal) * 100 : 0}%`, background: `var(--color-${color || 'lavender'})` }} />
          </div>
          <span className="bar-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ done, total, color = 'mint' }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * pct) / 100;
  return (
    <div className="donut-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="14" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={`var(--color-${color})`} strokeWidth="14"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="donut-label">
        <span className="donut-pct">{pct}%</span>
        <span className="donut-sub">{done}/{total}</span>
      </div>
    </div>
  );
}

export default function EstadisticasPage() {
  const { tasks, subjects, exams, studySessions } = useAppData();

  const today = new Date().toISOString().split('T')[0];
  const doneTasks = tasks.filter(t => t.done).length;
  const pendingTasks = tasks.filter(t => !t.done).length;
  const overdueTasks = tasks.filter(t => !t.done && t.dueDate && t.dueDate < today).length;
  const completionRate = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  const promoCount = subjects.filter(s => getSubjectAcademicEvaluation(s).statusKey === 'promocionada').length;
  const regularCount = subjects.filter(s => getSubjectAcademicEvaluation(s).statusKey === 'regular').length;

  const passedExams = exams.filter(e => e.grade !== null && e.grade >= 4).length;
  const failedExams = exams.filter(e => e.grade !== null && e.grade < 4).length;

  const totalStudyMin = studySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const studyHours = Math.round(totalStudyMin / 60 * 10) / 10;

  // Tasks by priority
  const byPriority = ['urgente', 'alta', 'media', 'baja'].map(p => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    value: tasks.filter(t => t.priority === p).length,
    color: p === 'urgente' ? 'peach' : p === 'alta' ? 'peach' : p === 'media' ? 'yellow' : 'mint'
  }));
  const maxP = Math.max(...byPriority.map(x => x.value), 1);

  // Tasks by subject
  const bySubject = subjects.map(s => ({
    label: s.name.length > 20 ? s.name.slice(0, 18) + '…' : s.name,
    value: tasks.filter(t => t.subjectId === s.id).length,
    color: s.color
  })).filter(x => x.value > 0).sort((a, b) => b.value - a.value).slice(0, 6);
  const maxS = Math.max(...bySubject.map(x => x.value), 1);

  // Study by subject
  const studyBySubj = subjects.map(s => ({
    label: s.name.length > 20 ? s.name.slice(0, 18) + '…' : s.name,
    value: studySessions.filter(ss => ss.subjectId === s.id).reduce((acc, ss) => acc + (ss.duration || 0), 0),
    color: s.color
  })).filter(x => x.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);
  const maxSt = Math.max(...studyBySubj.map(x => x.value), 1);

  return (
    <div className="page-estadisticas">
      {/* KPI row */}
      <div className="stats-kpi-grid">
        <StatCard label="Tareas completadas" value={doneTasks} sub={`de ${tasks.length} en total`} color="mint" big />
        <StatCard label="Tasa de cumplimiento" value={`${completionRate}%`} sub={`${pendingTasks} pendientes`} color="lavender" big />
        <StatCard label="Vencidas" value={overdueTasks} sub={overdueTasks > 0 ? '⚠️ Requieren atención' : '✓ ¡Al día!'} color={overdueTasks > 0 ? 'peach' : 'mint'} big />
        <StatCard label="Horas de estudio" value={`${studyHours}h`} sub={`${studySessions.length} sesiones Pomodoro`} color="yellow" big />
      </div>

      <div className="stats-columns">
        {/* Task completion donut */}
        <div className="stats-card">
          <h3 className="stats-card-title"><BarChartIcon size={16} /> Completitud de tareas</h3>
          <DonutChart done={doneTasks} total={tasks.length} color="mint" />
          <div className="donut-legend">
            <span className="legend-dot mint" /> <span>Completadas: {doneTasks}</span>
            <span className="legend-dot peach" /> <span>Pendientes: {pendingTasks}</span>
            {overdueTasks > 0 && <><span className="legend-dot danger" /><span>Vencidas: {overdueTasks}</span></>}
          </div>
        </div>

        {/* Academic status */}
        <div className="stats-card">
          <h3 className="stats-card-title">🎓 Estado académico</h3>
          <div className="academic-status-grid">
            <div className="ac-stat mint"><span className="ac-num">{promoCount}</span><span>Promocionadas</span></div>
            <div className="ac-stat lavender"><span className="ac-num">{regularCount}</span><span>A Final</span></div>
            <div className="ac-stat yellow"><span className="ac-num">{subjects.length}</span><span>Total materias</span></div>
          </div>
          <div className="academic-status-grid" style={{ marginTop: '1rem' }}>
            <div className="ac-stat mint"><span className="ac-num">{passedExams}</span><span>Aprobados</span></div>
            <div className="ac-stat peach"><span className="ac-num">{failedExams}</span><span>Aplazados</span></div>
            <div className="ac-stat lavender"><span className="ac-num">{exams.length}</span><span>Total exámenes</span></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="stats-chart-row">
        <div className="stats-card stats-card-wide">
          <h3 className="stats-card-title"><TrendingUpIcon size={16} /> Tareas por prioridad</h3>
          <BarChart data={byPriority} maxVal={maxP} />
        </div>

        {bySubject.length > 0 && (
          <div className="stats-card stats-card-wide">
            <h3 className="stats-card-title">📚 Tareas por materia</h3>
            <BarChart data={bySubject} maxVal={maxS} />
          </div>
        )}

        {studyBySubj.length > 0 && (
          <div className="stats-card stats-card-wide">
            <h3 className="stats-card-title">⏱️ Minutos de estudio por materia</h3>
            <BarChart data={studyBySubj} maxVal={maxSt} />
          </div>
        )}
      </div>
    </div>
  );
}
