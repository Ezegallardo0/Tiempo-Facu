import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon
} from './Icons';
import PromoCalculator from './PromoCalculator';
import { getSubjectAcademicEvaluation } from '../utils/academicEvaluation';

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const SUNDAY_TO_SAT = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function StudentHomeOrganizer({ onNavigate, onOpenAuth }) {
  const { user } = useAuth();
  const storageKey = `tiempofacu_dashboard_${user?.id || 'demo'}`;

  const [todayDayName] = useState(() => SUNDAY_TO_SAT[new Date().getDay()]);
  const [todayDateStr] = useState(() => new Date().toISOString().split('T')[0]);

  // Subjects in the schedule
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_subjects`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'sub_1',
        name: 'Análisis Matemático II',
        day: 'Lunes',
        time: '08:00 - 12:00 hs',
        classroom: 'Aula 302 - Pabellón 2',
        professor: 'Dr. Alejandro Gómez',
        color: 'lavender',
        p1: 8,
        p2: 9,
        recup1: null,
        recup2: null,
        tp: 9,
        finalExam: null,
        notes: '1°P: 8 y 2°P: 9. TP de Integrales dobles aprobado. Cursada promocionada.'
      },
      {
        id: 'sub_2',
        name: 'Estructuras de Datos & Algoritmos',
        day: 'Martes',
        time: '14:00 - 18:00 hs',
        classroom: 'Laboratorio 4',
        professor: 'Lic. Mariana Rossi',
        color: 'mint',
        p1: 7,
        p2: 8,
        recup1: null,
        recup2: null,
        tp: 10,
        finalExam: null,
        notes: '1° Parcial: 7, 2° Parcial: 8. TP de Árboles AVL con nota 10.'
      },
      {
        id: 'sub_3',
        name: 'Física II (Electromagnetismo)',
        day: 'Miércoles',
        time: '09:00 - 13:00 hs',
        classroom: 'Lab Central',
        professor: 'Ing. Carlos Méndez',
        color: 'yellow',
        p1: 5,
        p2: 6,
        recup1: null,
        recup2: null,
        tp: 8,
        finalExam: null,
        notes: 'P1: 5 y P2: 6. En la facultad no se promedia: condición Regular para rendir examen final.'
      },
      {
        id: 'sub_4',
        name: 'Arquitectura de Computadoras',
        day: 'Jueves',
        time: '18:00 - 22:00 hs',
        classroom: 'Aula Magna',
        professor: 'Dra. Sofía Valenzuela',
        color: 'sky',
        p1: 9,
        p2: null,
        recup1: null,
        recup2: null,
        tp: 9,
        finalExam: null,
        notes: '1°P: 9. Para promocionar se debe sacar ≥ 7 en el 2° Parcial (23 de Noviembre).'
      }
    ];
  });

  // Calendar Events
  const [calendarEvents, setCalendarEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_calendar_events`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'ev_1',
        title: '2° Parcial (Integrales Dobles y Curvilíneas)',
        subject: 'Análisis Matemático II',
        date: '2026-11-16',
        time: '08:00 hs',
        type: 'parcial',
        classroom: 'Aula 302 (Pab 2)',
        notes: 'Llevar tabla de integrales oficial y documento.'
      },
      {
        id: 'ev_2',
        title: 'Entrega Obligatoria TP Árboles AVL & Grafos',
        subject: 'Estructuras de Datos & Algoritmos',
        date: '2026-11-18',
        time: '23:59 hs',
        type: 'entrega',
        classroom: 'Campus Virtual',
        notes: 'Subir link al repositorio de GitHub con los tests pasando.'
      },
      {
        id: 'ev_3',
        title: 'Recuperatorio 1° Parcial (Electrostática)',
        subject: 'Física II (Electromagnetismo)',
        date: '2026-11-20',
        time: '09:00 hs',
        type: 'recup',
        classroom: 'Laboratorio Central',
        notes: 'Para quienes no llegaron al 4 en la primera fecha.'
      },
      {
        id: 'ev_4',
        title: '2° Parcial (Pipelines & Memoria Caché)',
        subject: 'Arquitectura de Computadoras',
        date: '2026-11-23',
        time: '18:00 hs',
        type: 'parcial',
        classroom: 'Aula Magna',
        notes: 'Se define la promoción directa: debés sacar ≥ 7.'
      },
      {
        id: 'ev_5',
        title: 'Mesa de Examen Final (Turno Diciembre)',
        subject: 'Física II (Electromagnetismo)',
        date: '2026-12-07',
        time: '09:00 hs',
        type: 'final',
        classroom: 'Aula Magna',
        notes: 'Inscripción obligatoria 48hs antes por SIU Guaraní.'
      }
    ];
  });

  // Tasks checklist
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_tasks`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 't_1', text: 'Terminar guía 5 de ejercicios de Análisis II', done: true, priority: 'alta', date: 'Hoy' },
      { id: 't_2', text: 'Subir código de Árboles AVL al Campus', done: false, priority: 'alta', date: 'Miércoles' },
      { id: 't_3', text: 'Pedir apuntes de Cátedra de Física II en fotocopiadora', done: false, priority: 'media', date: 'Jueves' },
      { id: 't_4', text: 'Repasar teoría de memoria caché para Arquitectura', done: false, priority: 'baja', date: 'Viernes' }
    ];
  });

  // Sticky notes
  const [stickyNotes, setStickyNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_sticky_notes`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'st_1', text: 'Regla de Oro de la Facu: En parciales NO se promedia. 4 + 7 NO promociona. Para promocionar se necesita ≥ 7 en ambos.', color: 'lavender' },
      { id: 'st_2', text: 'Carpeta Drive de la Comisión: bit.ly/apuntes-comision-02 (subieron resúmenes del 2° parcial)', color: 'mint' },
      { id: 'st_3', text: 'Grupo de estudio para el TP: Nos juntamos el jueves 16hs en la biblioteca central.', color: 'yellow' }
    ];
  });

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_subjects`, JSON.stringify(subjects));
    } catch {}
  }, [subjects, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_calendar_events`, JSON.stringify(calendarEvents));
    } catch {}
  }, [calendarEvents, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_tasks`, JSON.stringify(tasks));
    } catch {}
  }, [tasks, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_sticky_notes`, JSON.stringify(stickyNotes));
    } catch {}
  }, [stickyNotes, storageKey]);

  // Modals state
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState(null);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // New subject form
  const [newSub, setNewSub] = useState({
    name: '',
    day: 'Lunes',
    time: '08:00 - 12:00 hs',
    classroom: '',
    professor: '',
    color: 'lavender'
  });

  // New event form
  const [newEvent, setNewEvent] = useState({
    title: '',
    subject: subjects[0]?.name || '',
    date: '2026-11-20',
    time: '09:00 hs',
    type: 'parcial',
    classroom: '',
    notes: ''
  });

  // Calendar view state
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed: 10 = Nov)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(16);
  const [calendarFilter, setCalendarFilter] = useState('todos');

  // Academic statistics
  const promoCount = subjects.filter(s => {
    const evalData = getSubjectAcademicEvaluation(s);
    return evalData.statusKey === 'promocionada';
  }).length;

  const regularCount = subjects.filter(s => {
    const evalData = getSubjectAcademicEvaluation(s);
    return evalData.statusKey === 'regular';
  }).length;

  const recupCount = subjects.filter(s => {
    const evalData = getSubjectAcademicEvaluation(s);
    return evalData.statusKey === 'must_recup_1' || evalData.statusKey === 'must_recup_2' || evalData.statusKey === 'libre';
  }).length;

  // Today's classes
  const todayClasses = subjects.filter(s => s.day === todayDayName);

  // Handlers for subject modal
  const handleOpenSubjectDetail = (sub) => {
    setSelectedSubjectDetail({ ...sub });
  };

  const handleSaveSubjectDetail = (e) => {
    e.preventDefault();
    if (!selectedSubjectDetail) return;
    setSubjects(prev =>
      prev.map(s => (s.id === selectedSubjectDetail.id ? { ...selectedSubjectDetail } : s))
    );
    setSelectedSubjectDetail(null);
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm('¿Seguro que querés quitar esta materia de tu cursada?')) {
      setSubjects(prev => prev.filter(s => s.id !== id));
      if (selectedSubjectDetail?.id === id) setSelectedSubjectDetail(null);
    }
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSub.name.trim()) return;
    const created = {
      id: `sub_${Date.now()}`,
      name: newSub.name.trim(),
      day: newSub.day,
      time: newSub.time,
      classroom: newSub.classroom || 'Aula a confirmar',
      professor: newSub.professor || 'Cátedra',
      color: newSub.color,
      p1: null,
      p2: null,
      recup1: null,
      recup2: null,
      tp: null,
      finalExam: null,
      notes: ''
    };
    setSubjects(prev => [...prev, created]);
    setNewSub({ name: '', day: 'Lunes', time: '08:00 - 12:00 hs', classroom: '', professor: '', color: 'lavender' });
    setIsAddSubjectOpen(false);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    const created = {
      id: `ev_${Date.now()}`,
      title: newEvent.title.trim(),
      subject: newEvent.subject,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      classroom: newEvent.classroom || 'Aula a confirmar',
      notes: newEvent.notes || ''
    };
    setCalendarEvents(prev => [...prev, created]);
    setNewEvent({ title: '', subject: subjects[0]?.name || '', date: '2026-11-20', time: '09:00 hs', type: 'parcial', classroom: '', notes: '' });
    setIsAddEventOpen(false);
  };

  // Calendar helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Build calendar matrix (Monday-start)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < startingDayIndex; i++) {
    calendarDays.push({ empty: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const monthFormatted = String(currentMonth + 1).padStart(2, '0');
    const dayFormatted = String(d).padStart(2, '0');
    const fullDate = `${currentYear}-${monthFormatted}-${dayFormatted}`;
    const dayEvents = calendarEvents.filter(ev => {
      if (ev.date !== fullDate) return false;
      if (calendarFilter !== 'todos' && ev.type !== calendarFilter) return false;
      return true;
    });
    calendarDays.push({ d, fullDate, dayEvents });
  }

  // Selected date events
  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedCalendarDay).padStart(2, '0')}`;
  const selectedDayEvents = calendarEvents.filter(ev => ev.date === selectedDateStr);

  return (
    <div className="student-home-organizer animate-fade-in">
      {/* 1. STUDENT CONTROL CENTER HEADER */}
      <section className="organizer-hero-banner">
        <div className="organizer-hero-top">
          <div className="hero-student-meta">
            <span className="organizer-badge-pill">
              🎓 ORGANIZADOR ACADÉMICO • {user?.university ? user.university.toUpperCase() : 'UNIVERSIDAD'}
            </span>
            <h1 className="organizer-main-title">
              ¡Hola, {user ? user.name.split(' ')[0] : 'Estudiante'}! 🎒 <br />
              <span className="highlighter-mint">Tu cuatrimestre organizado sin promedios falsos.</span>
            </h1>
            <p className="organizer-main-sub">
              {user?.career ? `${user.career} • ` : ''}
              {user?.semester || '2° Cuatrimestre 2026'} • Ficha de cada materia, calendario de parciales y calculadora universitaria real.
            </p>
          </div>

          <div className="organizer-hero-actions">
            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="btn-organizer-primary"
            >
              <PlusIcon size={16} />
              <span>Agregar Materia</span>
            </button>
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="btn-organizer-secondary"
            >
              <CalendarIcon size={16} />
              <span>Agendar Fecha / Examen</span>
            </button>
          </div>
        </div>

        {/* Live Academic KPI Metric Strip */}
        <div className="organizer-kpi-grid">
          <div className="kpi-card pastel-blue">
            <div className="kpi-top">
              <span className="kpi-title">Materias Cursando</span>
              <span className="kpi-icon">📚</span>
            </div>
            <div className="kpi-number">{subjects.length}</div>
            <span className="kpi-note">{todayDayName}: {todayClasses.length} clases presenciales</span>
          </div>

          <div className="kpi-card pastel-green">
            <div className="kpi-top">
              <span className="kpi-title">Promocionadas</span>
              <span className="kpi-icon">🎉</span>
            </div>
            <div className="kpi-number">{promoCount}</div>
            <span className="kpi-note">Exige ≥ 7 en cada parcial individual</span>
          </div>

          <div className="kpi-card pastel-yellow">
            <div className="kpi-top">
              <span className="kpi-title">Regulares (A Final)</span>
              <span className="kpi-icon">📖</span>
            </div>
            <div className="kpi-number">{regularCount}</div>
            <span className="kpi-note">Parciales ≥ 4 aprobados para mesa</span>
          </div>

          <div className="kpi-card pastel-peach">
            <div className="kpi-top">
              <span className="kpi-title">A Recuperatorio</span>
              <span className="kpi-icon">🔄</span>
            </div>
            <div className="kpi-number">{recupCount}</div>
            <span className="kpi-note">{recupCount === 0 ? '¡Al día sin aplazos!' : 'Fechas a recuperar'}</span>
          </div>
        </div>
      </section>

      {/* 2. CLASES DE HOY SECTION */}
      <section id="hoy" className="organizer-today-section">
        <div className="section-header-compact">
          <div className="header-badge-row">
            <span className="section-eyebrow">AGENDA INMEDIATA</span>
            <span className="today-date-badge font-mono">{todayDayName} • {todayDateStr}</span>
          </div>
          <h2 className="section-heading">Tu Cursada Hoy ({todayDayName})</h2>
          <p className="section-subheading">
            Horarios, aulas y docentes programados para el día de la fecha.
          </p>
        </div>

        {todayClasses.length > 0 ? (
          <div className="today-classes-grid">
            {todayClasses.map(c => {
              const evalData = getSubjectAcademicEvaluation(c);
              return (
                <div key={c.id} className={`today-class-card ${c.color}`}>
                  <div className="today-class-header">
                    <span className="today-class-time font-mono">
                      <ClockIcon size={14} /> {c.time}
                    </span>
                    <span className={`eval-pill-badge ${evalData.badgeClass}`}>
                      {evalData.pillText}
                    </span>
                  </div>
                  <h3 className="today-class-name">{c.name}</h3>
                  <div className="today-class-details">
                    <div className="detail-row">
                      <MapPinIcon size={14} className="text-secondary" />
                      <span>{c.classroom}</span>
                    </div>
                    <div className="detail-row">
                      <span>Docente: <strong>{c.professor}</strong></span>
                    </div>
                  </div>
                  <div className="today-class-actions">
                    <button
                      onClick={() => handleOpenSubjectDetail(c)}
                      className="btn-today-open-modal"
                    >
                      <PencilIcon size={13} />
                      <span>Ver Ficha & Subir Notas</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="today-relax-box">
            <span className="relax-emoji">☕</span>
            <div className="relax-text">
              <h3>¡Hoy no tenés clases presenciales!</h3>
              <p>
                Aprovechá este día libre para avanzar entregas de trabajos prácticos, repasar resúmenes de cátedra o descansar.
              </p>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('materias');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-hub-secondary"
            >
              Revisar mis materias →
            </button>
          </div>
        )}
      </section>

      {/* 3. MIS MATERIAS & SUBIR NOTAS SECTION */}
      <section id="materias" className="organizer-subjects-section">
        <div className="section-header-compact">
          <div className="header-between">
            <div>
              <span className="section-eyebrow">MATERIAS & EVALUACIÓN ACADÉMICA</span>
              <h2 className="section-heading">Mis Materias del Cuatrimestre</h2>
              <p className="section-subheading">
                Hacé clic en cualquier tarjeta para abrir su ficha, subir notas de parciales y consultar tu condición real (sin promedios falsos).
              </p>
            </div>
            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="btn-add-subject-header"
            >
              <PlusIcon size={16} />
              <span>+ Nueva Materia</span>
            </button>
          </div>
        </div>

        <div className="subjects-cards-grid">
          {subjects.map(sub => {
            const evalData = getSubjectAcademicEvaluation(sub);
            return (
              <div
                key={sub.id}
                className={`subject-card-interactive ${sub.color}`}
                onClick={() => handleOpenSubjectDetail(sub)}
              >
                <div className="subject-card-top-bar">
                  <span className="subject-schedule-chip">
                    <ClockIcon size={12} /> {sub.day} • {sub.time}
                  </span>
                  <span className={`eval-pill-badge ${evalData.badgeClass}`}>
                    {evalData.pillText}
                  </span>
                </div>

                <h3 className="subject-card-name">{sub.name}</h3>

                <div className="subject-meta-list">
                  <div className="meta-item">
                    <MapPinIcon size={13} />
                    <span>{sub.classroom}</span>
                  </div>
                  <div className="meta-item">
                    <span>Prof: {sub.professor}</span>
                  </div>
                </div>

                {/* Instance notes display */}
                <div className="subject-grades-strip">
                  <div className="grade-badge-col">
                    <span className="g-label">1°P</span>
                    <span className="g-val font-mono">{sub.recup1 ?? sub.p1 ?? '-'}</span>
                  </div>
                  <div className="grade-badge-col">
                    <span className="g-label">2°P</span>
                    <span className="g-val font-mono">{sub.recup2 ?? sub.p2 ?? '-'}</span>
                  </div>
                  <div className="grade-badge-col">
                    <span className="g-label">TP</span>
                    <span className="g-val font-mono">{sub.tp ?? '-'}</span>
                  </div>
                  <div className="grade-badge-col">
                    <span className="g-label">Final</span>
                    <span className="g-val font-mono">{sub.finalExam ?? '-'}</span>
                  </div>
                </div>

                <div className="subject-card-footer">
                  <button
                    type="button"
                    className="btn-card-open-sheet"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSubjectDetail(sub);
                    }}
                  >
                    <PencilIcon size={13} />
                    <span>📝 Ficha & Subir Notas</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CALENDARIO ACADÉMICO COMPLETO */}
      <section id="calendario" className="organizer-calendar-section">
        <div className="section-header-compact">
          <div className="header-between">
            <div>
              <span className="section-eyebrow">CRONOGRAMA DE CURSADA</span>
              <h2 className="section-heading">Calendario de Parciales & Entregas</h2>
              <p className="section-subheading">
                Visualizá tus fechas clave con código de colores pasteles y cuenta regresiva.
              </p>
            </div>
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="btn-add-subject-header"
            >
              <CalendarIcon size={16} />
              <span>+ Agendar Fecha</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="calendar-filter-pills">
            <button
              onClick={() => setCalendarFilter('todos')}
              className={`cal-filter-btn ${calendarFilter === 'todos' ? 'active' : ''}`}
            >
              Todos los hitos ({calendarEvents.length})
            </button>
            <button
              onClick={() => setCalendarFilter('parcial')}
              className={`cal-filter-btn red ${calendarFilter === 'parcial' ? 'active' : ''}`}
            >
              🔴 Parciales
            </button>
            <button
              onClick={() => setCalendarFilter('entrega')}
              className={`cal-filter-btn yellow ${calendarFilter === 'entrega' ? 'active' : ''}`}
            >
              🟡 Entregas TP
            </button>
            <button
              onClick={() => setCalendarFilter('recup')}
              className={`cal-filter-btn purple ${calendarFilter === 'recup' ? 'active' : ''}`}
            >
              🔄 Recuperatorios
            </button>
            <button
              onClick={() => setCalendarFilter('final')}
              className={`cal-filter-btn blue ${calendarFilter === 'final' ? 'active' : ''}`}
            >
              🟣 Finales
            </button>
          </div>
        </div>

        <div className="calendar-main-layout">
          {/* Calendar Grid Card */}
          <div className="calendar-sheet-card">
            <div className="calendar-sheet-header">
              <button onClick={handlePrevMonth} className="btn-cal-nav" aria-label="Mes anterior">
                <ChevronLeftIcon size={18} />
              </button>
              <h3 className="cal-month-title">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <button onClick={handleNextMonth} className="btn-cal-nav" aria-label="Mes siguiente">
                <ChevronRightIcon size={18} />
              </button>
            </div>

            {/* Days header */}
            <div className="cal-days-header-row">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                <div key={d} className="cal-day-col-title">{d}</div>
              ))}
            </div>

            {/* Matrix */}
            <div className="cal-matrix-grid">
              {calendarDays.map((cell, idx) => {
                if (cell.empty) {
                  return <div key={`empty_${idx}`} className="cal-day-cell empty"></div>;
                }
                const isSelected = cell.d === selectedCalendarDay;
                const hasEvents = cell.dayEvents && cell.dayEvents.length > 0;
                return (
                  <div
                    key={`day_${cell.d}`}
                    className={`cal-day-cell ${isSelected ? 'is-selected' : ''} ${hasEvents ? 'has-events' : ''}`}
                    onClick={() => setSelectedCalendarDay(cell.d)}
                  >
                    <span className="cal-day-number font-mono">{cell.d}</span>
                    {hasEvents && (
                      <div className="cal-event-chips-stack">
                        {cell.dayEvents.slice(0, 2).map(ev => (
                          <span key={ev.id} className={`cal-mini-badge ${ev.type}`} title={ev.title}>
                            {ev.type === 'parcial' && '🔴'}
                            {ev.type === 'entrega' && '🟡'}
                            {ev.type === 'recup' && '🔄'}
                            {ev.type === 'final' && '🟣'} {ev.title.split(' ')[0]}
                          </span>
                        ))}
                        {cell.dayEvents.length > 2 && (
                          <span className="cal-more-dots">+{cell.dayEvents.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day Agenda Inspector */}
          <div className="calendar-day-inspector-card">
            <div className="inspector-header">
              <span className="inspector-eyebrow">AGENDA DEL DÍA</span>
              <h3 className="inspector-title">
                {selectedCalendarDay} de {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
            </div>

            <div className="inspector-events-list">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(ev => (
                  <div key={ev.id} className={`inspector-event-item ${ev.type}`}>
                    <div className="event-item-top">
                      <span className={`event-badge-tag ${ev.type}`}>
                        {ev.type === 'parcial' && '🔴 Examen Parcial'}
                        {ev.type === 'entrega' && '🟡 Entrega Obligatoria'}
                        {ev.type === 'recup' && '🔄 Recuperatorio'}
                        {ev.type === 'final' && '🟣 Examen Final'}
                      </span>
                      <span className="event-time font-mono">{ev.time}</span>
                    </div>
                    <h4 className="event-title">{ev.title}</h4>
                    <span className="event-subject-name">📚 {ev.subject}</span>
                    <div className="event-room-info">
                      <MapPinIcon size={12} /> {ev.classroom}
                    </div>
                    {ev.notes && <p className="event-notes-text">📝 {ev.notes}</p>}
                  </div>
                ))
              ) : (
                <div className="inspector-empty">
                  <span>☕</span>
                  <p>No tenés parciales ni entregas agendadas para este día.</p>
                  <button
                    onClick={() => {
                      setNewEvent(prev => ({
                        ...prev,
                        date: selectedDateStr
                      }));
                      setIsAddEventOpen(true);
                    }}
                    className="btn-add-for-day"
                  >
                    + Agendar evento para esta fecha
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIMULADOR DE PROMOCIÓN UNIVERSITARIA REAL */}
      <PromoCalculator onOpenAuth={onOpenAuth} onNavigate={onNavigate} />

      {/* 6. HORARIO SEMANAL DE CURSADA */}
      <section id="horario" className="organizer-schedule-section">
        <div className="section-header-compact">
          <span className="section-eyebrow">GRILLA SEMANAL</span>
          <h2 className="section-heading">Horario Semanal de Cursada</h2>
          <p className="section-subheading">
            Distribución de materias por día de la semana para organizar tus tiempos de viaje y estudio.
          </p>
        </div>

        <div className="schedule-table-wrapper">
          <div className="weekly-schedule-grid">
            {DAYS_OF_WEEK.map(day => {
              const daySubs = subjects.filter(s => s.day === day);
              const isToday = day === todayDayName;
              return (
                <div key={day} className={`day-column ${isToday ? 'is-today-col' : ''}`}>
                  <div className="day-column-header">
                    <span className="day-name">{day}</span>
                    {isToday && <span className="today-badge-dot">HOY</span>}
                  </div>

                  <div className="day-column-cards">
                    {daySubs.length > 0 ? (
                      daySubs.map(s => (
                        <div
                          key={s.id}
                          className={`schedule-class-block ${s.color}`}
                          onClick={() => handleOpenSubjectDetail(s)}
                          title="Clic para ver ficha de notas"
                        >
                          <span className="block-time font-mono">{s.time}</span>
                          <strong className="block-title">{s.name}</strong>
                          <span className="block-room">{s.classroom}</span>
                          <span className="block-prof">{s.professor}</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-day-slot">
                        <span>Sin cursada</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. TAREAS & PIZARRA DE POST-ITS */}
      <section id="tareas" className="organizer-tasks-section">
        <div className="section-header-compact">
          <span className="section-eyebrow">GESTIÓN PERSONAL</span>
          <h2 className="section-heading">Tareas, Entregas & Pizarra de Apuntes</h2>
          <p className="section-subheading">
            Checklist de entregas académicas y notas adhesivas para no perder enlaces ni recordatorios de cursada.
          </p>
        </div>

        <div className="tasks-and-corkboard-grid">
          {/* Column 1: Task Checklist */}
          <div className="task-manager-card">
            <h3 className="sub-module-title">📋 Entregas & Pendientes</h3>
            <div className="task-items-list">
              {tasks.map(t => (
                <div key={t.id} className={`task-row ${t.done ? 'is-done' : ''}`}>
                  <label className="task-checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => {
                        setTasks(prev =>
                          prev.map(item => (item.id === t.id ? { ...item, done: !item.done } : item))
                        );
                      }}
                    />
                    <span className="custom-check-box"></span>
                    <span className="task-text">{t.text}</span>
                  </label>
                  <div className="task-row-meta">
                    <span className={`priority-tag ${t.priority}`}>{t.priority}</span>
                    <button
                      onClick={() => setTasks(prev => prev.filter(item => item.id !== t.id))}
                      className="btn-trash-task"
                      title="Eliminar tarea"
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add task input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const text = form.taskText.value.trim();
                if (!text) return;
                setTasks(prev => [
                  ...prev,
                  { id: `t_${Date.now()}`, text, done: false, priority: 'media', date: 'Esta semana' }
                ]);
                form.reset();
              }}
              className="quick-add-task-form"
            >
              <input
                type="text"
                name="taskText"
                placeholder="+ Agregar nueva tarea o entrega..."
                className="task-input-field"
              />
              <button type="submit" className="btn-task-add">
                Sumar
              </button>
            </form>
          </div>

          {/* Column 2: Sticky Corkboard */}
          <div className="corkboard-card">
            <div className="corkboard-header">
              <h3 className="sub-module-title">📌 Pizarra de Notas Adhesivas</h3>
              <button
                onClick={() => {
                  const colors = ['lavender', 'mint', 'yellow', 'peach', 'sky'];
                  const picked = colors[Math.floor(Math.random() * colors.length)];
                  const text = prompt('Escribí tu recordatorio o link de Drive:');
                  if (text && text.trim()) {
                    setStickyNotes(prev => [
                      ...prev,
                      { id: `st_${Date.now()}`, text: text.trim(), color: picked }
                    ]);
                  }
                }}
                className="btn-add-postit"
              >
                + Pegar Post-it
              </button>
            </div>

            <div className="postit-cards-stack">
              {stickyNotes.map(st => (
                <div key={st.id} className={`postit-card ${st.color}`}>
                  <span className="postit-pin">📌</span>
                  <p className="postit-text font-hand">{st.text}</p>
                  <button
                    onClick={() => setStickyNotes(prev => prev.filter(item => item.id !== st.id))}
                    className="btn-del-postit"
                    title="Despegar post-it"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL 1: FICHA DE LA MATERIA Y GESTIÓN DE NOTAS */}
      {selectedSubjectDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedSubjectDetail(null)}>
          <div className="modal-card-pastel modal-subject-detail animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedSubjectDetail(null)}
              className="modal-close-btn"
              aria-label="Cerrar ficha"
            >
              ✕
            </button>

            <div className="modal-header">
              <span className="modal-badge-pill">FICHA ACADÉMICA • NOTAS UNIVERSITARIAS</span>
              <h3 className="modal-title">{selectedSubjectDetail.name}</h3>
              <p className="modal-subtitle">
                {selectedSubjectDetail.day} ({selectedSubjectDetail.time}) • {selectedSubjectDetail.classroom}
              </p>
            </div>

            {/* University strict notice in modal */}
            <div className="modal-academic-warning">
              <div className="warning-icon">🎓</div>
              <div className="warning-text">
                <strong>En la facultad las notas no se promedian</strong>
                <p>
                  Para <strong>Promoción Directa</strong> se exige alcanzar al menos <strong>≥ 7 en cada parcial individualmente</strong> y aprobar el TP. 
                  Un 4 solo otorga regularidad e ir a examen final; no promedia con notas altas.
                </p>
              </div>
            </div>

            {/* Live diagnostic calculation */}
            {(() => {
              const evalData = getSubjectAcademicEvaluation(selectedSubjectDetail);
              return (
                <div className={`modal-eval-card ${evalData.badgeClass}`}>
                  <div className="modal-eval-top">
                    <span className="eval-status-title">{evalData.title}</span>
                    <span className="eval-summary-text font-mono">{evalData.summary}</span>
                  </div>
                  <p className="eval-explanation">{evalData.explanation}</p>
                </div>
              );
            })()}

            <form onSubmit={handleSaveSubjectDetail} className="modal-form">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">1° Parcial (Nota 1 a 10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={selectedSubjectDetail.p1 ?? ''}
                    onChange={(e) => setSelectedSubjectDetail(prev => ({
                      ...prev,
                      p1: e.target.value === '' ? null : Number(e.target.value)
                    }))}
                    placeholder="Sin nota aún"
                    className="modal-input-pastel font-mono"
                  />
                  <small className="field-hint">Para promocionar debés sacar ≥ 7</small>
                </div>

                <div className="form-group">
                  <label className="input-label">2° Parcial (Nota 1 a 10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={selectedSubjectDetail.p2 ?? ''}
                    onChange={(e) => setSelectedSubjectDetail(prev => ({
                      ...prev,
                      p2: e.target.value === '' ? null : Number(e.target.value)
                    }))}
                    placeholder="Sin nota aún"
                    className="modal-input-pastel font-mono"
                  />
                  <small className="field-hint">Para promocionar debés sacar ≥ 7</small>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Recuperatorio 1° Parcial (Opcional)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={selectedSubjectDetail.recup1 ?? ''}
                    onChange={(e) => setSelectedSubjectDetail(prev => ({
                      ...prev,
                      recup1: e.target.value === '' ? null : Number(e.target.value)
                    }))}
                    placeholder="Solo si rendís recup"
                    className="modal-input-pastel font-mono"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Recuperatorio 2° Parcial (Opcional)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={selectedSubjectDetail.recup2 ?? ''}
                    onChange={(e) => setSelectedSubjectDetail(prev => ({
                      ...prev,
                      recup2: e.target.value === '' ? null : Number(e.target.value)
                    }))}
                    placeholder="Solo si rendís recup"
                    className="modal-input-pastel font-mono"
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Trabajo Práctico Obligatorio</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={selectedSubjectDetail.tp ?? ''}
                    onChange={(e) => setSelectedSubjectDetail(prev => ({
                      ...prev,
                      tp: e.target.value === '' ? null : Number(e.target.value)
                    }))}
                    placeholder="Ej. 8, 9, 10"
                    className="modal-input-pastel font-mono"
                  />
                  <small className="field-hint">Debe estar aprobado (≥ 4)</small>
                </div>

                <div className="form-group">
                  <label className="input-label">Nota de Examen Final (Si rinde mesa)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={selectedSubjectDetail.finalExam ?? ''}
                    onChange={(e) => setSelectedSubjectDetail(prev => ({
                      ...prev,
                      finalExam: e.target.value === '' ? null : Number(e.target.value)
                    }))}
                    placeholder="Nota de final cerrado"
                    className="modal-input-pastel font-mono"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Apuntes de Cátedra & Enlace a Carpeta de Google Drive</label>
                <textarea
                  rows="2"
                  value={selectedSubjectDetail.notes || ''}
                  onChange={(e) => setSelectedSubjectDetail(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ej. Carpeta con modelos de parcial: drive.google.com/... Cátedra Gómez."
                  className="modal-textarea-pastel"
                />
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  onClick={() => handleDeleteSubject(selectedSubjectDetail.id)}
                  className="btn-modal-delete-danger"
                >
                  <TrashIcon size={14} /> Quitar Materia
                </button>

                <div className="modal-actions-right">
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectDetail(null)}
                    className="btn-modal-secondary-pastel"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-modal-primary-pastel">
                    Guardar Notas
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AGREGAR MATERIA */}
      {isAddSubjectOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddSubjectOpen(false)}>
          <div className="modal-card-pastel animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsAddSubjectOpen(false)} className="modal-close-btn">✕</button>
            <div className="modal-header">
              <span className="modal-badge-pill">NUEVA MATERIA</span>
              <h3 className="modal-title">Agregar Materia a tu Cursada</h3>
              <p className="modal-subtitle">Completá los datos para sumarla a tu horario semanal</p>
            </div>

            <form onSubmit={handleAddSubject} className="modal-form">
              <div className="form-group">
                <label className="input-label">Nombre de la materia *</label>
                <input
                  type="text"
                  required
                  value={newSub.name}
                  onChange={(e) => setNewSub(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej. Química General, Derecho Penal..."
                  className="modal-input-pastel"
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Día de cursada</label>
                  <select
                    value={newSub.day}
                    onChange={(e) => setNewSub(prev => ({ ...prev, day: e.target.value }))}
                    className="modal-select-pastel"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label">Horario</label>
                  <input
                    type="text"
                    value={newSub.time}
                    onChange={(e) => setNewSub(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="Ej. 08:00 - 12:00 hs"
                    className="modal-input-pastel"
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Aula / Pabellón</label>
                  <input
                    type="text"
                    value={newSub.classroom}
                    onChange={(e) => setNewSub(prev => ({ ...prev, classroom: e.target.value }))}
                    placeholder="Ej. Aula 204 - Piso 2"
                    className="modal-input-pastel"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Docente / Cátedra</label>
                  <input
                    type="text"
                    value={newSub.professor}
                    onChange={(e) => setNewSub(prev => ({ ...prev, professor: e.target.value }))}
                    placeholder="Ej. Dr. Martínez"
                    className="modal-input-pastel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Color del bloque</label>
                <div className="color-picker-row">
                  {['lavender', 'mint', 'yellow', 'peach', 'sky'].map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`color-pick-circle ${c} ${newSub.color === c ? 'active' : ''}`}
                      onClick={() => setNewSub(prev => ({ ...prev, color: c }))}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-modal-primary-pastel">
                Sumar Materia al Organizador
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: AGENDAR FECHA / EXAMEN */}
      {isAddEventOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddEventOpen(false)}>
          <div className="modal-card-pastel animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsAddEventOpen(false)} className="modal-close-btn">✕</button>
            <div className="modal-header">
              <span className="modal-badge-pill">NUEVA FECHA</span>
              <h3 className="modal-title">Agendar Examen o Entrega</h3>
              <p className="modal-subtitle">Sumá una fecha crítica a tu calendario de cursada</p>
            </div>

            <form onSubmit={handleAddEvent} className="modal-form">
              <div className="form-group">
                <label className="input-label">Título del evento / examen *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej. 1° Parcial (Unidades 1 a 4)"
                  className="modal-input-pastel"
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Materia</label>
                  <select
                    value={newEvent.subject}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, subject: e.target.value }))}
                    className="modal-select-pastel"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label">Tipo de instancia</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    className="modal-select-pastel"
                  >
                    <option value="parcial">🔴 Examen Parcial</option>
                    <option value="entrega">🟡 Entrega Obligatoria TP</option>
                    <option value="recup">🔄 Recuperatorio</option>
                    <option value="final">🟣 Examen Final</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Fecha (AAAA-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="modal-input-pastel font-mono"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Horario</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="Ej. 08:00 hs"
                    className="modal-input-pastel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Aula / Campus</label>
                <input
                  type="text"
                  value={newEvent.classroom}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, classroom: e.target.value }))}
                  placeholder="Ej. Aula 302, Pabellón 2"
                  className="modal-input-pastel"
                />
              </div>

              <div className="form-group">
                <label className="input-label">Notas / Temario a rendir</label>
                <textarea
                  rows="2"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ej. Entra hasta el capítulo 4. Traer calculadora científica."
                  className="modal-textarea-pastel"
                />
              </div>

              <button type="submit" className="btn-modal-primary-pastel">
                Guardar en Calendario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
