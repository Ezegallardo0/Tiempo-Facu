import { useState, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/ui/Toast';
import { PlayIcon, PauseIcon, RotateCcwIcon, SkipForwardIcon } from '../components/ui/Icons2';

const MODES = [
  { id: 'focus',   label: '🧠 Concentración', defaultMin: 25, color: 'lavender' },
  { id: 'short',   label: '☕ Descanso corto',  defaultMin: 5,  color: 'mint' },
  { id: 'long',    label: '🛋️ Descanso largo',  defaultMin: 15, color: 'sky' },
];

function pad(n) { return String(n).padStart(2, '0'); }

export default function PomodoroPage() {
  const { subjects, addSession } = useAppData();
  const toast = useToast();

  const [config, setConfig] = useState({ focus: 25, short: 5, long: 15 });
  const [modeIdx, setModeIdx] = useState(0);
  const [seconds, setSeconds] = useState(config.focus * 60);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [subjectId, setSubjectId] = useState('');
  const [sessionGoal, setSessionGoal] = useState('');
  const [completedSessions, setCompletedSessions] = useState([]);
  const intervalRef = useRef(null);

  const mode = MODES[modeIdx];
  const totalSec = config[mode.id] * 60;
  const percent = ((totalSec - seconds) / totalSec) * 100;
  const circumference = 2 * Math.PI * 90;

  useEffect(() => {
    setSeconds(config[MODES[modeIdx].id] * 60);
    setRunning(false);
  }, [modeIdx, config]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleComplete = () => {
    const isFocus = MODES[modeIdx].id === 'focus';
    if (isFocus) {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      const sess = { subjectId, goal: sessionGoal, duration: config.focus, completedAt: new Date().toISOString() };
      addSession(sess);
      setCompletedSessions(p => [sess, ...p]);
      toast(`¡Pomodoro ${newCycles} completado! 🎉 Tomá un descanso.`);
      setModeIdx(newCycles % 4 === 0 ? 2 : 1);
    } else {
      toast('¡Descanso terminado! Volvé a concentrarte.');
      setModeIdx(0);
    }
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('TiempoFacu Pomodoro', { body: isFocus ? '¡Tiempo de descanso!' : '¡A estudiar!' });
    }
  };

  const reset = () => { setRunning(false); setSeconds(config[mode.id] * 60); };
  const skip = () => { setRunning(false); setModeIdx(i => (i + 1) % 3); };

  const requestNotifPerm = () => {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  };

  return (
    <div className="page-pomodoro">
      <div className="pomodoro-layout">
        {/* Timer section */}
        <div className="pomodoro-timer-col">
          {/* Mode tabs */}
          <div className="pomo-mode-tabs">
            {MODES.map((m, i) => (
              <button key={m.id} onClick={() => setModeIdx(i)} className={`pomo-mode-tab ${modeIdx === i ? `active color-${m.color}` : ''}`}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Timer ring */}
          <div className={`pomo-ring-wrap color-${mode.color}`}>
            <svg width="220" height="220" className="pomo-svg">
              <circle cx="110" cy="110" r="90" fill="none" stroke="var(--border)" strokeWidth="12" />
              <circle cx="110" cy="110" r="90" fill="none" stroke={`var(--color-${mode.color})`} strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * percent) / 100}
                strokeLinecap="round"
                transform="rotate(-90 110 110)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="pomo-time-display">
              <span className="pomo-time">{pad(Math.floor(seconds / 60))}:{pad(seconds % 60)}</span>
              <span className="pomo-mode-label">{mode.label}</span>
              <span className="pomo-cycles">Ciclos: {cycles}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="pomo-controls">
            <button className="pomo-btn secondary" onClick={reset} title="Reiniciar"><RotateCcwIcon size={20} /></button>
            <button className={`pomo-btn primary color-${mode.color}`} onClick={() => { requestNotifPerm(); setRunning(r => !r); }}>
              {running ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
            </button>
            <button className="pomo-btn secondary" onClick={skip} title="Saltar"><SkipForwardIcon size={20} /></button>
          </div>

          {/* Config */}
          <div className="pomo-config-card">
            <h3 className="pomo-config-title">⚙️ Duración (minutos)</h3>
            <div className="pomo-config-row">
              {MODES.map(m => (
                <label key={m.id} className="pomo-config-field">
                  <span>{m.label.split(' ').slice(1).join(' ')}</span>
                  <input type="number" min="1" max="90" value={config[m.id]}
                    onChange={e => setConfig(c => ({ ...c, [m.id]: Math.max(1, Number(e.target.value)) }))} />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Session section */}
        <div className="pomodoro-session-col">
          <div className="pomo-session-card">
            <h3 className="pomo-session-title">📋 Sesión de estudio</h3>
            <label className="form-field">
              <span>Materia</span>
              <select value={subjectId} onChange={e => setSubjectId(e.target.value)}>
                <option value="">Sin materia</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>Objetivo de la sesión</span>
              <input value={sessionGoal} onChange={e => setSessionGoal(e.target.value)} placeholder="¿Qué vas a estudiar hoy?" />
            </label>
          </div>

          {/* History */}
          <div className="pomo-history-card">
            <h3 className="pomo-session-title">🕐 Historial de hoy</h3>
            {completedSessions.length === 0 ? (
              <p className="pomo-empty">Sin sesiones completadas aún. ¡Arrancá!</p>
            ) : (
              completedSessions.slice(0, 8).map((s, i) => {
                const sub = subjects.find(x => x.id === s.subjectId);
                return (
                  <div key={i} className="pomo-history-row">
                    <span className="pomo-hist-num">#{completedSessions.length - i}</span>
                    <div>
                      <p className="pomo-hist-sub">{sub?.name || 'Sin materia'}</p>
                      {s.goal && <p className="pomo-hist-goal">{s.goal}</p>}
                    </div>
                    <span className="pomo-hist-dur">{s.duration} min</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
