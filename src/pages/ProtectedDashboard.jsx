import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  LogOutIcon,
  LockIcon,
  HomeIcon,
  MapPinIcon,
  BookOpenIcon,
  AwardIcon,
  SparklesIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon
} from '../components/Icons';
import { getSubjectAcademicEvaluation } from '../utils/academicEvaluation';

// --- HELPER: CALENDAR GRID GENERATOR ---
function getMonthDaysGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // 0 = Monday, 6 = Sunday
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const grid = [];

  // Previous month filler days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevMonthDate = new Date(year, month - 1, d);
    const dateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    grid.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      year: prevMonthDate.getFullYear(),
      month: prevMonthDate.getMonth()
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    grid.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      year,
      month
    });
  }

  // Next month filler days to complete 35 or 42 cells (multiple of 7)
  const remaining = (7 - (grid.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const dateStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    grid.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      year: nextMonthDate.getFullYear(),
      month: nextMonthDate.getMonth()
    });
  }

  return grid;
}

function GatekeeperView({ onNavigate, onDemoLogin }) {
  return (
    <div className="protected-gatekeeper-container">
      <div className="gatekeeper-card animate-scale-up">
        <div className="gatekeeper-icon-bubble">
          <LockIcon size={38} className="text-primary" />
        </div>

        <span className="gatekeeper-badge">ACCESO RESTRINGIDO</span>
        <h2 className="gatekeeper-title">Contenido Protegido</h2>
        <p className="gatekeeper-desc">
          Este es tu panel privado de cursada. Para ver tu horario semanal, registrar parciales y gestionar tus tareas, necesitás iniciar sesión con tu cuenta de estudiante.
        </p>

        <div className="gatekeeper-actions">
          <button
            onClick={() => onNavigate('login')}
            className="btn-gatekeeper primary"
          >
            <LockIcon size={16} />
            <span>Iniciar Sesión</span>
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="btn-gatekeeper secondary"
          >
            <span>Crear Cuenta Gratis</span>
          </button>
        </div>

        <div className="gatekeeper-demo-divider">
          <span>o probalo sin esperas</span>
        </div>

        <button
          onClick={onDemoLogin}
          className="btn-gatekeeper-demo"
        >
          <SparklesIcon size={16} />
          <span>Desbloquear con cuenta Demo de Prueba</span>
        </button>

        <button
          onClick={() => onNavigate('landing')}
          className="btn-gatekeeper-back"
        >
          ← Volver a la página principal
        </button>
      </div>
    </div>
  );
}

function StudentDashboardView({ user, logout, onNavigate, initialTab = 'horario' }) {
  const { updateUserProfile } = useAuth();
  const storageKey = `tiempofacu_dashboard_${user.id || 'demo'}`;

  // Tabs within dashboard: 'horario' | 'calendario' | 'tareas' | 'notas' | 'pizarra' | 'configuracion'
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedDay, setSelectedDay] = useState('Todos');

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
        notes: 'P1: 8 y P2: 9. TP de Integrales dobles aprobado. Cursada promocionada.'
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
        notes: 'P1: 5 y P2: 6. Aprobada pero no alcanza promo (≥7). Regular para rendir examen final.'
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
        notes: 'P1: 9. El 2° Parcial se rinde el 23 de Noviembre. Perfil de promoción en carrera.'
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
        title: '2° Parcial (Unidades 4 a 7)',
        subject: 'Análisis Matemático II',
        date: '2026-11-16',
        time: '08:00 hs',
        type: 'parcial',
        classroom: 'Aula 302 - Pabellón 2',
        notes: 'Traer DNI y libreta universitaria. Entra Taylor, Integrales dobles y Stokes.'
      },
      {
        id: 'ev_2',
        title: 'Entrega Obligatoria TP Árboles AVL',
        subject: 'Estructuras de Datos & Algoritmos',
        date: '2026-11-18',
        time: '23:59 hs',
        type: 'entrega',
        classroom: 'Campus Virtual (Moodle)',
        notes: 'Subir archivo .zip con el código fuente y batería de tests en Google Test.'
      },
      {
        id: 'ev_3',
        title: '2° Parcial Teórico-Práctico',
        subject: 'Física II (Electromagnetismo)',
        date: '2026-11-23',
        time: '09:00 hs',
        type: 'parcial',
        classroom: 'Laboratorio Central',
        notes: 'Leyes de Maxwell, Ondas electromagnéticas y Circuitos RLC.'
      },
      {
        id: 'ev_4',
        title: 'Recuperatorio 1° Parcial',
        subject: 'Arquitectura de Computadoras',
        date: '2026-11-26',
        time: '18:00 hs',
        type: 'recup',
        classroom: 'Aula Magna',
        notes: 'Para quienes desaprobaron o buscan levantar nota para la promoción.'
      },
      {
        id: 'ev_5',
        title: 'Cierre de Cursada & Firma de Libretas',
        subject: 'Todas las materias',
        date: '2026-12-04',
        time: '14:00 hs',
        type: 'clase',
        classroom: 'Departamento de Alumnos',
        notes: 'Verificar actas cargadas en el sistema de gestión académica.'
      },
      {
        id: 'ev_6',
        title: 'Mesa de Examen Final Regular',
        subject: 'Álgebra Lineal',
        date: '2026-12-14',
        time: '09:00 hs',
        type: 'final',
        classroom: 'Pabellón 1 - Aula 12',
        notes: 'Inscripción obligatoria previa en el sistema hasta 48hs hábiles antes.'
      }
    ];
  });

  // Calendar UI state
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => new Date(2026, 10, 1)); // Noviembre 2026
  const [selectedCalendarDay, setSelectedCalendarDay] = useState('2026-11-16');
  const [calendarFilter, setCalendarFilter] = useState('todos'); // 'todos' | 'parcial' | 'entrega' | 'recup' | 'final'
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventSubject, setNewEventSubject] = useState(subjects[0]?.name || 'Análisis Matemático II');
  const [newEventDate, setNewEventDate] = useState('2026-11-20');
  const [newEventTime, setNewEventTime] = useState('09:00 hs');
  const [newEventType, setNewEventType] = useState('parcial');
  const [newEventRoom, setNewEventRoom] = useState('');
  const [newEventNotes, setNewEventNotes] = useState('');

  // Subject Detail / Edit Notes Modal state
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState(null);
  const [subjectDetailSavedToast, setSubjectDetailSavedToast] = useState(false);

  // Cached today string to avoid impure new Date() calls during render
  const [todayDateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  // Tasks list
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_tasks`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 't1', text: 'Entregar informe de laboratorio de Física', subject: 'Física II', done: false, priority: 'Alta' },
      { id: 't2', text: 'Subir código del TP de Árboles AVL al campus', subject: 'Estructuras de Datos', done: true, priority: 'Alta' },
      { id: 't3', text: 'Repasar Teorema de Stokes y Green', subject: 'Análisis Matemático II', done: false, priority: 'Media' },
      { id: 't4', text: 'Leer apunte sobre memoria caché y microarquitecturas', subject: 'Arquitectura', done: false, priority: 'Baja' }
    ];
  });

  // Sticky notes
  const [stickyNotes, setStickyNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_stickies`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 's1', text: 'Pedirle a Cami los ejercicios de la guía 4 de Análisis ☕', color: 'yellow' },
      { id: 's2', text: 'Comprar resaltador pastel y hojas cuadriculadas en la fotocopiadora', color: 'mint' },
      { id: 's3', text: 'Jueves 14hs: Reunión por Meet para armar las diapositivas del TP', color: 'peach' }
    ];
  });

  // --- SETTINGS STATE ---
  const [settingsForm, setSettingsForm] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_settings`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: user.name || '',
      university: user.university || 'UBA (Universidad de Buenos Aires)',
      career: user.career || '',
      semester: user.semester || '2do Cuatrimestre 2026',
      email: user.email || '',
      promoMin: 7,
      passMin: 4,
      attendanceMin: 75,
      alertExams48h: true,
      alertExams24h: true,
      alertCampusTP: true,
      morningDigest: false,
      pastelTheme: 'lavender'
    };
  });

  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  // Modal for adding a subject
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubDay, setNewSubDay] = useState('Lunes');
  const [newSubTime, setNewSubTime] = useState('08:00 - 12:00 hs');
  const [newSubRoom, setNewSubRoom] = useState('');
  const [newSubProf, setNewSubProf] = useState('');
  const [newSubColor, setNewSubColor] = useState('lavender');

  // Input for adding task
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(subjects[0]?.name || 'Facultad');
  const [newTaskPriority, setNewTaskPriority] = useState('Alta');

  // Input for adding sticky
  const [newStickyText, setNewStickyText] = useState('');
  const [newStickyColor, setNewStickyColor] = useState('yellow');

  // Save to localStorage
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
      localStorage.setItem(`${storageKey}_stickies`, JSON.stringify(stickyNotes));
    } catch {}
  }, [stickyNotes, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_settings`, JSON.stringify(settingsForm));
    } catch {}
  }, [settingsForm, storageKey]);

  // Handlers for Subjects
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newSub = {
      id: `sub_${Date.now()}`,
      name: newSubName.trim(),
      day: newSubDay,
      time: newSubTime.trim(),
      classroom: newSubRoom.trim() || 'Aula por confirmar',
      professor: newSubProf.trim() || 'Cátedra',
      color: newSubColor,
      p1: null,
      p2: null,
      recup1: null,
      recup2: null,
      tp: null,
      finalExam: null,
      notes: ''
    };

    setSubjects([...subjects, newSub]);
    setNewSubName('');
    setNewSubRoom('');
    setNewSubProf('');
    setIsAddSubjectOpen(false);
  };

  const handleDeleteSubject = (id) => {
    if (confirm('¿Seguro que querés quitar esta materia de tu horario?')) {
      setSubjects(subjects.filter(s => s.id !== id));
      if (selectedSubjectDetail && selectedSubjectDetail.id === id) {
        setSelectedSubjectDetail(null);
      }
    }
  };

  const handleOpenSubjectDetail = (sub) => {
    setSelectedSubjectDetail({ ...sub });
  };

  const handleSaveSubjectDetail = (e) => {
    e.preventDefault();
    if (!selectedSubjectDetail) return;

    setSubjects(subjects.map(s => s.id === selectedSubjectDetail.id ? selectedSubjectDetail : s));
    setSubjectDetailSavedToast(true);
    setTimeout(() => setSubjectDetailSavedToast(false), 2400);
  };

  const handleUpdateGrade = (subId, field, val) => {
    const num = val === '' ? null : Math.min(10, Math.max(1, Number(val)));
    setSubjects(subjects.map(s => s.id === subId ? { ...s, [field]: num } : s));
  };

  // Handlers for Calendar
  const handlePrevMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentCalendarDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedCalendarDay(todayStr);
  };

  const handleAddCalendarEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate) return;

    const newEv = {
      id: `ev_${Date.now()}`,
      title: newEventTitle.trim(),
      subject: newEventSubject,
      date: newEventDate,
      time: newEventTime.trim() || '09:00 hs',
      type: newEventType,
      classroom: newEventRoom.trim() || 'Aula / Campus',
      notes: newEventNotes.trim()
    };

    setCalendarEvents([...calendarEvents, newEv]);
    setNewEventTitle('');
    setNewEventRoom('');
    setNewEventNotes('');
    setIsAddEventModalOpen(false);
  };

  const handleDeleteCalendarEvent = (id) => {
    setCalendarEvents(calendarEvents.filter(ev => ev.id !== id));
  };

  // Handlers for Tasks & Notes
  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask = {
      id: `t_${Date.now()}`,
      text: newTaskInput.trim(),
      subject: newTaskSubject,
      done: false,
      priority: newTaskPriority
    };

    setTasks([newTask, ...tasks]);
    setNewTaskInput('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddSticky = (e) => {
    e.preventDefault();
    if (!newStickyText.trim()) return;

    const newSticky = {
      id: `s_${Date.now()}`,
      text: newStickyText.trim(),
      color: newStickyColor
    };

    setStickyNotes([newSticky, ...stickyNotes]);
    setNewStickyText('');
  };

  const handleDeleteSticky = (id) => {
    setStickyNotes(stickyNotes.filter(s => s.id !== id));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: settingsForm.name,
      university: settingsForm.university,
      career: settingsForm.career,
      semester: settingsForm.semester
    });
    setSettingsSaveSuccess(true);
    setTimeout(() => setSettingsSaveSuccess(false), 3000);
  };

  const handleResetDemoData = () => {
    if (confirm('¿Querés restablecer las materias, eventos y tareas iniciales de prueba?')) {
      localStorage.removeItem(`${storageKey}_subjects`);
      localStorage.removeItem(`${storageKey}_calendar_events`);
      localStorage.removeItem(`${storageKey}_tasks`);
      localStorage.removeItem(`${storageKey}_stickies`);
      window.location.reload();
    }
  };

  const handleClearCompletedTasks = () => {
    setTasks(tasks.filter(t => !t.done));
  };

  // Filtered subjects
  const filteredSubjects = selectedDay === 'Todos'
    ? subjects
    : subjects.filter(s => s.day === selectedDay);

  // College Academic Status Computations (NO SE PROMEDIAN)
  const academicEvaluations = subjects.map(s => ({
    subject: s,
    evaluation: getSubjectAcademicEvaluation(s, settingsForm)
  }));

  const promoCount = academicEvaluations.filter(e => e.evaluation.statusKey === 'promocionada').length;
  const regularCount = academicEvaluations.filter(e => e.evaluation.statusKey === 'regular').length;
  const recupCount = academicEvaluations.filter(e => e.evaluation.statusKey === 'must_recup_1' || e.evaluation.statusKey === 'must_recup_2').length;
  const cursandoCount = academicEvaluations.filter(e => e.evaluation.statusKey === 'cursando' || e.evaluation.statusKey === 'on_track_promo' || e.evaluation.statusKey === 'regular_path').length;

  const completedTasks = tasks.filter(t => t.done).length;

  return (
    <div className="protected-dashboard-root">
      {/* Top Student Header */}
      <header className="dashboard-header-bar">
        <div className="dash-header-inner">
          <div className="dash-student-profile">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
              alt={user.name}
              className="dash-student-avatar"
            />
            <div className="dash-student-meta">
              <div className="dash-welcome-row">
                <h1 className="dash-student-name">
                  ¡Hola, {user.name}! ☕
                </h1>
                <span className="dash-verified-pill">
                  <CheckCircleIcon size={13} /> Alumno Regular
                </span>
              </div>
              <p className="dash-student-academic">
                <strong>{user.university}</strong> • {user.career} • <span className="dash-cuatri">{user.semester}</span>
              </p>
            </div>
          </div>

          <div className="dash-actions-group">
            <button
              onClick={() => onNavigate('landing')}
              className="btn-dash-action secondary"
              title="Ir a la portada pública"
            >
              <HomeIcon size={16} />
              <span>Ver Portada</span>
            </button>

            <button
              onClick={() => setActiveTab('configuracion')}
              className={`btn-dash-action ${activeTab === 'configuracion' ? 'primary' : 'secondary'}`}
              title="Abrir panel de configuración"
            >
              <SettingsIcon size={16} />
              <span>Configuración</span>
            </button>

            <button
              onClick={() => {
                logout();
                onNavigate('landing');
              }}
              className="btn-dash-action logout"
              title="Cerrar sesión"
            >
              <LogOutIcon size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs within Dashboard */}
        <div className="dash-subnav-container">
          <div className="dash-subnav-inner">
            <button
              onClick={() => setActiveTab('horario')}
              className={`dash-tab-btn ${activeTab === 'horario' ? 'active' : ''}`}
            >
              <CalendarIcon size={16} />
              <span>Mi Horario Semanal</span>
              <span className="dash-tab-count">{subjects.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('calendario')}
              className={`dash-tab-btn ${activeTab === 'calendario' ? 'active' : ''}`}
            >
              <span className="dash-tab-emoji">🗓️</span>
              <span>Calendario Académico</span>
              <span className="dash-tab-count">{calendarEvents.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('tareas')}
              className={`dash-tab-btn ${activeTab === 'tareas' ? 'active' : ''}`}
            >
              <CheckCircleIcon size={16} />
              <span>Mis Tareas & TPs</span>
              <span className="dash-tab-count">{tasks.filter(t => !t.done).length}</span>
            </button>

            <button
              onClick={() => setActiveTab('notas')}
              className={`dash-tab-btn ${activeTab === 'notas' ? 'active' : ''}`}
            >
              <AwardIcon size={16} />
              <span>Notas & Cursada</span>
              <span className="dash-tab-count font-mono">{promoCount} Promo</span>
            </button>

            <button
              onClick={() => setActiveTab('pizarra')}
              className={`dash-tab-btn ${activeTab === 'pizarra' ? 'active' : ''}`}
            >
              <span className="dash-emoji-tab">📌</span>
              <span>Pizarra de Post-its</span>
              <span className="dash-tab-count">{stickyNotes.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('configuracion')}
              className={`dash-tab-btn ${activeTab === 'configuracion' ? 'active' : ''}`}
            >
              <SettingsIcon size={16} />
              <span>Panel de Configuración</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="dashboard-content-container">
        {/* TAB 1: MI HORARIO SEMANAL */}
        {activeTab === 'horario' && (
          <div className="dashboard-tab-view animate-fade-in">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">Mi Grilla de Cursada Semanal</h2>
                <p className="dash-section-desc">
                  Comisiones, aulas y horarios. Hacé clic en cualquier tarjeta para abrir la ficha de la materia y subir tus notas.
                </p>
              </div>

              <div className="dash-header-tools">
                {/* Day selector filter */}
                <div className="dash-day-pills">
                  {['Todos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDay(d)}
                      className={`day-filter-btn ${selectedDay === d ? 'active' : ''}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddSubjectOpen(true)}
                  className="btn-add-subject-modal"
                >
                  <PlusIcon size={16} />
                  <span>Agregar Materia</span>
                </button>
              </div>
            </div>

            {/* Schedule Cards Grid */}
            <div className="dash-schedule-grid">
              {filteredSubjects.length === 0 ? (
                <div className="dash-empty-box">
                  <p>No tenés materias cargadas para este día.</p>
                  <button onClick={() => setIsAddSubjectOpen(true)} className="link-highlight">
                    + Cargar una materia ahora
                  </button>
                </div>
              ) : (
                filteredSubjects.map(sub => {
                  const evalInfo = getSubjectAcademicEvaluation(sub, settingsForm);

                  return (
                    <div
                      key={sub.id}
                      className={`dash-schedule-card ${sub.color} is-card-clickable`}
                      onClick={() => handleOpenSubjectDetail(sub)}
                      title="Hacé clic para ver detalles y gestionar notas"
                    >
                      <div className="card-top-action">
                        <span className="card-day-chip">{sub.day}</span>
                        <div className="card-top-badges">
                          <span className={`card-eval-pill ${evalInfo.badgeClass}`}>
                            {evalInfo.pillText}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubject(sub.id);
                            }}
                            className="btn-delete-card"
                            title="Quitar materia"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </div>

                      <h3 className="card-sub-name">{sub.name}</h3>

                      <div className="card-time-item">
                        <ClockIcon size={14} />
                        <span>{sub.time}</span>
                      </div>

                      <div className="card-room-item">
                        <MapPinIcon size={14} />
                        <span>{sub.classroom}</span>
                      </div>

                      <div className="card-prof-item">
                        <span className="prof-label">Cátedra:</span>
                        <span className="prof-value">{sub.professor}</span>
                      </div>

                      {/* College Evaluation Summary (NO SE PROMEDIAN) */}
                      <div className="card-grades-preview-bar">
                        <div className="grade-tag-item">
                          <span className="grade-tag-lbl">1° Parcial:</span>
                          <span className="grade-tag-val">{sub.recup1 ?? sub.p1 ?? '-'}</span>
                        </div>
                        <div className="grade-tag-item">
                          <span className="grade-tag-lbl">2° Parcial:</span>
                          <span className="grade-tag-val">{sub.recup2 ?? sub.p2 ?? '-'}</span>
                        </div>
                        <div className="grade-tag-item">
                          <span className="grade-tag-lbl">TP:</span>
                          <span className="grade-tag-val">{sub.tp ?? '-'}</span>
                        </div>
                      </div>

                      <div className="card-status-footer">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSubjectDetail(sub);
                          }}
                          className="btn-card-enter-notes"
                        >
                          <PencilIcon size={13} />
                          <span>Ficha & Subir Notas</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CALENDARIO ACADÉMICO */}
        {activeTab === 'calendario' && (
          <div className="dashboard-tab-view animate-fade-in">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">Calendario Académico & Fechas Clave</h2>
                <p className="dash-section-desc">
                  Parciales, entregas de trabajos prácticos, recuperatorios y fechas de final de tu cuatrimestre.
                </p>
              </div>

              <div className="dash-header-tools">
                <button
                  onClick={() => setIsAddEventModalOpen(true)}
                  className="btn-add-subject-modal"
                >
                  <PlusIcon size={16} />
                  <span>Agendar Fecha / Examen</span>
                </button>
              </div>
            </div>

            {/* Upcoming Milestones Highlights */}
            <div className="calendar-milestones-strip">
              <div className="milestone-box parcial">
                <span className="milestone-tag">PRÓXIMO PARCIAL</span>
                <strong>2° Parcial Análisis Matemático II</strong>
                <p>Lunes 16 de Noviembre • 08:00 hs (Aula 302)</p>
              </div>
              <div className="milestone-box entrega">
                <span className="milestone-tag">ENTREGA OBLIGATORIA</span>
                <strong>TP Árboles AVL - Estructuras de Datos</strong>
                <p>Miércoles 18 de Noviembre • 23:59 hs (Campus)</p>
              </div>
              <div className="milestone-box final">
                <span className="milestone-tag">MESA DE FINAL</span>
                <strong>Álgebra Lineal</strong>
                <p>Lunes 14 de Diciembre • 09:00 hs (Pabellón 1)</p>
              </div>
            </div>

            {/* Month Navigation & Filters Bar */}
            <div className="calendar-toolbar-card">
              <div className="calendar-month-nav">
                <button onClick={handlePrevMonth} className="btn-month-nav" title="Mes anterior">
                  <ChevronLeftIcon size={18} />
                </button>
                <h3 className="calendar-month-title">
                  {[
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                  ][currentCalendarDate.getMonth()]} {currentCalendarDate.getFullYear()}
                </h3>
                <button onClick={handleNextMonth} className="btn-month-nav" title="Mes siguiente">
                  <ChevronRightIcon size={18} />
                </button>
                <button onClick={handleGoToToday} className="btn-today-pill">
                  Hoy
                </button>
              </div>

              <div className="calendar-filter-pills">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'parcial', label: '🔴 Parciales' },
                  { id: 'entrega', label: '🟡 Entregas TP' },
                  { id: 'recup', label: '🔄 Recuperatorios' },
                  { id: 'final', label: '🟣 Finales' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setCalendarFilter(f.id)}
                    className={`cal-filter-btn ${calendarFilter === f.id ? 'active' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid & Agenda Split */}
            <div className="calendar-layout-split">
              {/* Monthly Grid */}
              <div className="calendar-grid-card">
                <div className="calendar-day-headers">
                  <span>LUN</span>
                  <span>MAR</span>
                  <span>MIÉ</span>
                  <span>JUE</span>
                  <span>VIE</span>
                  <span>SÁB</span>
                  <span>DOM</span>
                </div>

                <div className="calendar-days-cells">
                  {getMonthDaysGrid(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth()).map((cell, idx) => {
                    const dayEvents = calendarEvents.filter(ev => {
                      if (ev.date !== cell.dateStr) return false;
                      if (calendarFilter !== 'todos' && ev.type !== calendarFilter) return false;
                      return true;
                    });

                    const isToday = cell.dateStr === todayDateStr;
                    const isSelected = cell.dateStr === selectedCalendarDay;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedCalendarDay(cell.dateStr)}
                        className={`calendar-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                      >
                        <div className="cell-header">
                          <span className="cell-day-num">{cell.dayNumber}</span>
                          {isToday && <span className="today-badge">Hoy</span>}
                        </div>

                        <div className="cell-events-list">
                          {dayEvents.slice(0, 3).map(ev => (
                            <div key={ev.id} className={`cal-event-badge ${ev.type}`} title={`${ev.title} (${ev.time})`}>
                              <span className="cal-dot"></span>
                              <span className="cal-event-text">{ev.title}</span>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="cal-more-count">+{dayEvents.length - 3} más</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day Agenda Inspector */}
              <div className="calendar-agenda-card">
                <div className="agenda-header">
                  <div>
                    <h4 className="agenda-title">Agenda del Día</h4>
                    <p className="agenda-date-str">
                      {selectedCalendarDay}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNewEventDate(selectedCalendarDay);
                      setIsAddEventModalOpen(true);
                    }}
                    className="btn-agenda-add"
                    title="Agregar examen o entrega en esta fecha"
                  >
                    + Agendar
                  </button>
                </div>

                <div className="agenda-events-flow">
                  {calendarEvents.filter(ev => ev.date === selectedCalendarDay).length === 0 ? (
                    <div className="agenda-empty-state">
                      <p>No tenés eventos ni parciales registrados para esta fecha.</p>
                      <button
                        onClick={() => {
                          setNewEventDate(selectedCalendarDay);
                          setIsAddEventModalOpen(true);
                        }}
                        className="link-highlight"
                      >
                        + Agendar un parcial o entrega
                      </button>
                    </div>
                  ) : (
                    calendarEvents
                      .filter(ev => ev.date === selectedCalendarDay)
                      .map(ev => (
                        <div key={ev.id} className={`agenda-item-card ${ev.type}`}>
                          <div className="agenda-item-top">
                            <span className={`agenda-type-pill ${ev.type}`}>
                              {ev.type === 'parcial' && '🔴 Parcial'}
                              {ev.type === 'entrega' && '🟡 Entrega TP'}
                              {ev.type === 'recup' && '🔄 Recuperatorio'}
                              {ev.type === 'final' && '🟣 Examen Final'}
                              {ev.type === 'clase' && '🟢 Cursada'}
                            </span>
                            <span className="agenda-time-text">
                              <ClockIcon size={12} /> {ev.time}
                            </span>
                            <button
                              onClick={() => handleDeleteCalendarEvent(ev.id)}
                              className="btn-agenda-del"
                              title="Eliminar evento"
                            >
                              <TrashIcon size={12} />
                            </button>
                          </div>

                          <h5 className="agenda-item-title">{ev.title}</h5>
                          <p className="agenda-item-subj">
                            <BookOpenIcon size={12} /> {ev.subject}
                          </p>

                          <div className="agenda-item-room">
                            <MapPinIcon size={12} />
                            <span>{ev.classroom}</span>
                          </div>

                          {ev.notes && (
                            <p className="agenda-item-notes font-hand">
                              "{ev.notes}"
                            </p>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MIS TAREAS & ENTREGAS */}
        {activeTab === 'tareas' && (
          <div className="dashboard-tab-view animate-fade-in">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">Organizador Personal de Entregas</h2>
                <p className="dash-section-desc">
                  Tus pendientes privados guardados en tu perfil de estudiante.
                </p>
              </div>

              <div className="dash-tasks-metric">
                <span className="metric-pill">
                  <strong>{completedTasks}</strong> de <strong>{tasks.length}</strong> completadas
                </span>
                {completedTasks > 0 && (
                  <button
                    onClick={handleClearCompletedTasks}
                    className="btn-clear-completed"
                    title="Limpiar tareas tachadas"
                  >
                    Limpiar completadas
                  </button>
                )}
              </div>
            </div>

            {/* Quick Add Task Form */}
            <form onSubmit={handleAddTask} className="dash-add-task-bar">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Anotá un pendiente (ej. Resolver ejercicios impares de la guía 3)..."
                className="dash-task-input"
              />
              <select
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                className="dash-task-select"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                <option value="General / Trámites">General / Trámites</option>
              </select>

              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="dash-task-select"
              >
                <option value="Alta">Prioridad Alta 🔥</option>
                <option value="Media">Prioridad Media ⚡</option>
                <option value="Baja">Prioridad Baja 🍃</option>
              </select>

              <button type="submit" className="btn-dash-task-add">
                <PlusIcon size={16} />
                <span>Agregar</span>
              </button>
            </form>

            {/* Tasks List */}
            <div className="dash-tasks-paper">
              {tasks.length === 0 ? (
                <div className="dash-empty-box">
                  <p>¡No tenés tareas pendientes! Aprovechá para descansar o preparar unos mates 🧉</p>
                </div>
              ) : (
                tasks.map(t => (
                  <div
                    key={t.id}
                    className={`dash-task-row ${t.done ? 'is-done' : ''}`}
                    onClick={() => handleToggleTask(t.id)}
                  >
                    <div className={`dash-checkbox ${t.done ? 'checked' : ''}`}>
                      {t.done && <span>✓</span>}
                    </div>

                    <div className="dash-task-body">
                      <span className={`dash-task-text ${t.done ? 'strike' : ''}`}>
                        {t.text}
                      </span>
                      <div className="dash-task-tags">
                        <span className="tag-subj">{t.subject}</span>
                        <span className={`tag-prio ${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(t.id);
                      }}
                      className="btn-trash-task"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: NOTAS & CONDICIÓN DE CURSADA */}
        {activeTab === 'notas' && (
          <div className="dashboard-tab-view animate-fade-in">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">Registro de Notas e Instancias de Cursada</h2>
                <p className="dash-section-desc">
                  En la universidad las notas no se promedian: cada parcial y TP es una instancia obligatoria para promocionar o regularizar.
                </p>
              </div>

              {/* Real Academic Counters */}
              <div className="academic-status-metrics-strip">
                <div className="metric-status-card success">
                  <span className="metric-status-num font-mono">{promoCount}</span>
                  <span className="metric-status-label">Promocionadas 🎉</span>
                </div>
                <div className="metric-status-card warning">
                  <span className="metric-status-num font-mono">{regularCount}</span>
                  <span className="metric-status-label">Regulares (A Final) 📚</span>
                </div>
                <div className="metric-status-card danger">
                  <span className="metric-status-num font-mono">{recupCount}</span>
                  <span className="metric-status-label">A Recuperatorio 🔄</span>
                </div>
                <div className="metric-status-card neutral">
                  <span className="metric-status-num font-mono">{cursandoCount}</span>
                  <span className="metric-status-label">En Cursada ⏳</span>
                </div>
              </div>
            </div>

            {/* University Notice Banner */}
            <div className="college-notice-callout">
              <span className="notice-callout-icon">💡</span>
              <div className="notice-callout-body">
                <strong>¿Cómo funciona la acreditación de cursada en la facultad?</strong>
                <p>
                  No existe promedio compensatorio entre parciales: si sacás 10 en el 1° Parcial y 2 en el 2° Parcial, no promedia 6; debés rendir el Recuperatorio del 2° Parcial. Para promocionar directo debés alcanzar el mínimo en cada parcial (≥ {settingsForm.promoMin || 7}) y aprobar los TPs.
                </p>
              </div>
            </div>

            <div className="dash-grades-table-card">
              <table className="dash-grades-table">
                <thead>
                  <tr>
                    <th>Materia</th>
                    <th>1° Parcial</th>
                    <th>2° Parcial</th>
                    <th>Recuperatorio</th>
                    <th>TP Obligatorio</th>
                    <th>Condición Académica</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(s => {
                    const evalInfo = getSubjectAcademicEvaluation(s, settingsForm);

                    return (
                      <tr key={s.id}>
                        <td>
                          <strong>{s.name}</strong>
                          <span className="table-sub-detail">{s.classroom} • {s.professor}</span>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            step="0.5"
                            value={s.p1 ?? ''}
                            onChange={(e) => handleUpdateGrade(s.id, 'p1', e.target.value)}
                            placeholder="-"
                            className="input-grade-table"
                            title="Nota 1° Parcial"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            step="0.5"
                            value={s.p2 ?? ''}
                            onChange={(e) => handleUpdateGrade(s.id, 'p2', e.target.value)}
                            placeholder="-"
                            className="input-grade-table"
                            title="Nota 2° Parcial"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            step="0.5"
                            value={s.recup1 ?? s.recup2 ?? ''}
                            onChange={(e) => handleUpdateGrade(s.id, s.p1 < (settingsForm.passMin || 4) ? 'recup1' : 'recup2', e.target.value)}
                            placeholder="-"
                            className="input-grade-table"
                            title="Nota de Recuperatorio (si corresponde)"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            step="0.5"
                            value={s.tp ?? ''}
                            onChange={(e) => handleUpdateGrade(s.id, 'tp', e.target.value)}
                            placeholder="-"
                            className="input-grade-table"
                            title="Nota de TP Obligatorio / Laboratorio"
                          />
                        </td>
                        <td>
                          <span className={`status-pill-table ${evalInfo.badgeClass}`}>
                            {evalInfo.title}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleOpenSubjectDetail(s)}
                            className="btn-table-action-open"
                            title="Abrir ficha y subir notas detalladas"
                          >
                            <PencilIcon size={13} />
                            <span>Abrir Ficha</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PIZARRA DE POST-ITS */}
        {activeTab === 'pizarra' && (
          <div className="dashboard-tab-view animate-fade-in">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">Pizarra Personal de Notas & Recordatorios</h2>
                <p className="dash-section-desc">
                  Tus post-its con fechas, ideas rápidas o datos para no olvidar.
                </p>
              </div>
            </div>

            {/* Add Sticky Form */}
            <form onSubmit={handleAddSticky} className="dash-add-sticky-card">
              <input
                type="text"
                value={newStickyText}
                onChange={(e) => setNewStickyText(e.target.value)}
                placeholder="Escribí una nota rápida para tu pizarra (ej. Llevar libreta universitaria el viernes)..."
                className="dash-sticky-input"
              />
              <div className="dash-sticky-color-picker">
                <span className="color-picker-label">Color:</span>
                {[
                  { id: 'yellow', label: 'Manteca' },
                  { id: 'mint', label: 'Menta' },
                  { id: 'lavender', label: 'Lavanda' },
                  { id: 'peach', label: 'Durazno' }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setNewStickyColor(c.id)}
                    className={`color-dot-btn ${c.id} ${newStickyColor === c.id ? 'active' : ''}`}
                    title={c.label}
                  />
                ))}
              </div>

              <button type="submit" className="btn-add-sticky">
                <PlusIcon size={16} />
                <span>Pegar en la Pizarra</span>
              </button>
            </form>

            {/* Stickies Grid */}
            <div className="dash-stickies-board">
              {stickyNotes.map(sn => (
                <div key={sn.id} className={`dash-sticky-note ${sn.color}`}>
                  <button
                    onClick={() => handleDeleteSticky(sn.id)}
                    className="btn-remove-sticky"
                    title="Despegar nota"
                  >
                    ✕
                  </button>
                  <span className="dash-pin">📌</span>
                  <p className="dash-sticky-text font-hand">
                    "{sn.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PANEL DE CONFIGURACIÓN */}
        {activeTab === 'configuracion' && (
          <div className="dashboard-tab-view animate-fade-in">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">Panel de Configuración</h2>
                <p className="dash-section-desc">
                  Ajustá los datos de tu universidad, reglas de notas de tu carrera y recordatorios.
                </p>
              </div>

              {settingsSaveSuccess && (
                <div className="settings-success-toast animate-scale-up">
                  <CheckCircleIcon size={16} />
                  <span>✓ Configuración guardada correctamente en tu dispositivo</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="settings-cards-flow">
              {/* Card 1: Perfil y Datos de la Facultad */}
              <div className="settings-card-item">
                <div className="settings-card-header">
                  <div className="settings-icon-bubble">🎓</div>
                  <div>
                    <h3 className="settings-item-title">Datos del Estudiante & Facultad</h3>
                    <p className="settings-item-sub">Tu información visible en tu panel de cursada</p>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <div className="form-group">
                    <label className="form-label">Nombre y Apellido</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="form-input-pastel"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Universidad / Institución</label>
                    <select
                      value={settingsForm.university}
                      onChange={(e) => setSettingsForm({ ...settingsForm, university: e.target.value })}
                      className="form-input-pastel"
                    >
                      <option value="UBA (Universidad de Buenos Aires)">UBA (Universidad de Buenos Aires)</option>
                      <option value="UTN (Universidad Tecnológica Nacional)">UTN (Universidad Tecnológica Nacional)</option>
                      <option value="UNC (Universidad Nacional de Córdoba)">UNC (Universidad Nacional de Córdoba)</option>
                      <option value="UNLP (Universidad Nacional de La Plata)">UNLP (Universidad Nacional de La Plata)</option>
                      <option value="UNR (Universidad Nacional de Rosario)">UNR (Universidad Nacional de Rosario)</option>
                      <option value="ITBA (Instituto Tecnológico)">ITBA (Instituto Tecnológico)</option>
                      <option value="UADE (Universidad Argentina de la Empresa)">UADE</option>
                      <option value="UNSAM (San Martín)">UNSAM</option>
                      <option value="UNLAM (La Matanza)">UNLAM</option>
                      <option value="UNCUYO (Cuyo)">UNCUYO</option>
                      <option value="PUC (Chile)">PUC (Chile)</option>
                      <option value="UNAM (México)">UNAM (México)</option>
                      <option value="Otra Universidad / Instituto">Otra institución</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Carrera / Especialidad</label>
                    <input
                      type="text"
                      value={settingsForm.career}
                      onChange={(e) => setSettingsForm({ ...settingsForm, career: e.target.value })}
                      placeholder="Ej. Ingeniería en Informática, Medicina..."
                      className="form-input-pastel"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cuatrimestre / Ciclo en Curso</label>
                    <select
                      value={settingsForm.semester}
                      onChange={(e) => setSettingsForm({ ...settingsForm, semester: e.target.value })}
                      className="form-input-pastel"
                    >
                      <option value="2do Cuatrimestre 2026">2do Cuatrimestre 2026</option>
                      <option value="1er Cuatrimestre 2027">1er Cuatrimestre 2027</option>
                      <option value="Ciclo Anual 2026">Ciclo Anual 2026</option>
                      <option value="Cursos de Verano">Cursos de Verano</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 2: Reglas de Promoción y Calificación */}
              <div className="settings-card-item">
                <div className="settings-card-header">
                  <div className="settings-icon-bubble">🧮</div>
                  <div>
                    <h3 className="settings-item-title">Reglas de Calificación & Asistencia</h3>
                    <p className="settings-item-sub">Personalizá las notas de corte según el régimen de tu plan</p>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <div className="form-group">
                    <label className="form-label">Nota mínima para Promoción Directa</label>
                    <select
                      value={settingsForm.promoMin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoMin: Number(e.target.value) })}
                      className="form-input-pastel"
                    >
                      <option value={7}>Nota ≥ 7 en cada examen (Estándar UBA/UTN/UNC)</option>
                      <option value={8}>Nota ≥ 8 en cada examen (Exigencia alta)</option>
                      <option value={6}>Nota ≥ 6 en cada examen (Promoción simple)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nota mínima para Regularizar (ir a final)</label>
                    <select
                      value={settingsForm.passMin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, passMin: Number(e.target.value) })}
                      className="form-input-pastel"
                    >
                      <option value={4}>Nota 4 (Aprobación tradicional)</option>
                      <option value={5}>Nota 5</option>
                      <option value={6}>Nota 6</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Asistencia mínima obligatoria</label>
                    <select
                      value={settingsForm.attendanceMin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, attendanceMin: Number(e.target.value) })}
                      className="form-input-pastel"
                    >
                      <option value={75}>75% de asistencia</option>
                      <option value={80}>80% de asistencia</option>
                      <option value={70}>70% de asistencia</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tema de Acento Pastel</label>
                    <div className="settings-pastel-picker">
                      {[
                        { id: 'lavender', label: 'Lavanda' },
                        { id: 'mint', label: 'Menta' },
                        { id: 'yellow', label: 'Manteca' },
                        { id: 'peach', label: 'Durazno' },
                        { id: 'sky', label: 'Cielo' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, pastelTheme: t.id })}
                          className={`btn-pastel-choice ${t.id} ${settingsForm.pastelTheme === t.id ? 'active' : ''}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Notificaciones & Recordatorios */}
              <div className="settings-card-item">
                <div className="settings-card-header">
                  <div className="settings-icon-bubble">🔔</div>
                  <div>
                    <h3 className="settings-item-title">Recordatorios & Alertas Anti-Pánico</h3>
                    <p className="settings-item-sub">Elegí cómo y cuándo querés que te avisemos de tus fechas</p>
                  </div>
                </div>

                <div className="settings-checkboxes-list">
                  <label className="settings-toggle-row">
                    <input
                      type="checkbox"
                      checked={settingsForm.alertExams48h}
                      onChange={(e) => setSettingsForm({ ...settingsForm, alertExams48h: e.target.checked })}
                    />
                    <div>
                      <strong>Alerta de Parcial 48 hs antes</strong>
                      <p>Para hacer el último repaso y revisar dudas de ejercicios.</p>
                    </div>
                  </label>

                  <label className="settings-toggle-row">
                    <input
                      type="checkbox"
                      checked={settingsForm.alertCampusTP}
                      onChange={(e) => setSettingsForm({ ...settingsForm, alertCampusTP: e.target.checked })}
                    />
                    <div>
                      <strong>Aviso de cierre de Campus Virtual (Moodle / Blackboard)</strong>
                      <p>Notificación 3 horas antes de la medianoche para subir el archivo con tiempo.</p>
                    </div>
                  </label>

                  <label className="settings-toggle-row">
                    <input
                      type="checkbox"
                      checked={settingsForm.morningDigest}
                      onChange={(e) => setSettingsForm({ ...settingsForm, morningDigest: e.target.checked })}
                    />
                    <div>
                      <strong>Resumen de cursada del día</strong>
                      <p>Aviso a las 07:30 hs indicando en qué aula cursás y si tenés entregas hoy.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card 4: Acciones de Guardado y Datos */}
              <div className="settings-save-actions-bar">
                <button type="submit" className="btn-save-settings-main">
                  <span>Guardar Preferencias</span>
                </button>

                <div className="settings-secondary-actions">
                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="btn-danger-outline"
                    title="Restablecer materias a las de prueba"
                  >
                    Restablecer Materias Iniciales
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* MODAL: AGREGAR MATERIA */}
      {isAddSubjectOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddSubjectOpen(false)}>
          <div className="modal-card-pastel animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsAddSubjectOpen(false)}
              className="modal-close-btn"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="modal-header">
              <div className="brand-icon-wrapper mini">
                <BookOpenIcon size={18} className="brand-icon" />
              </div>
              <h3 className="modal-title">Agregar Materia a tu Cursada</h3>
              <p className="modal-subtitle">Completá los datos para sumarla a tu horario semanal</p>
            </div>

            <form onSubmit={handleAddSubject} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre de la Materia *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ej. Algoritmos y Programación II"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="form-input-pastel"
                />
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label className="form-label">Día de Cursada</label>
                  <select
                    value={newSubDay}
                    onChange={(e) => setNewSubDay(e.target.value)}
                    className="form-input-pastel"
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Horario</label>
                  <input
                    type="text"
                    value={newSubTime}
                    onChange={(e) => setNewSubTime(e.target.value)}
                    placeholder="Ej. 18:00 - 22:00 hs"
                    className="form-input-pastel"
                  />
                </div>
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label className="form-label">Aula / Sede</label>
                  <input
                    type="text"
                    value={newSubRoom}
                    onChange={(e) => setNewSubRoom(e.target.value)}
                    placeholder="Ej. Aula 204 - Pab. 1"
                    className="form-input-pastel"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Profesor / Cátedra</label>
                  <input
                    type="text"
                    value={newSubProf}
                    onChange={(e) => setNewSubProf(e.target.value)}
                    placeholder="Ej. Dr. Rossi"
                    className="form-input-pastel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Color Pastel de la Tarjeta</label>
                <div className="color-selector-pills">
                  {[
                    { id: 'lavender', label: 'Lavanda' },
                    { id: 'mint', label: 'Menta' },
                    { id: 'yellow', label: 'Manteca' },
                    { id: 'peach', label: 'Durazno' },
                    { id: 'sky', label: 'Cielo' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewSubColor(c.id)}
                      className={`pill-color-choice ${c.id} ${newSubColor === c.id ? 'active' : ''}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-modal-primary-pastel">
                <span>Guardar Materia</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: FICHA DE LA MATERIA Y GESTIÓN DE NOTAS (NO SE PROMEDIAN) */}
      {selectedSubjectDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedSubjectDetail(null)}>
          <div className="modal-card-pastel modal-subject-detail animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedSubjectDetail(null)}
              className="modal-close-btn"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Header */}
            <div className={`subject-detail-banner ${selectedSubjectDetail.color}`}>
              <div className="banner-info">
                <span className="banner-day-tag">{selectedSubjectDetail.day} • {selectedSubjectDetail.time}</span>
                <h3 className="banner-title">{selectedSubjectDetail.name}</h3>
                <p className="banner-meta">
                  <MapPinIcon size={14} /> <span>{selectedSubjectDetail.classroom}</span>
                  <span className="dot-sep">•</span>
                  <span>Cátedra: {selectedSubjectDetail.professor}</span>
                </p>
              </div>

              {(() => {
                const evalInfo = getSubjectAcademicEvaluation(selectedSubjectDetail, settingsForm);
                return (
                  <div className={`detail-status-badge ${evalInfo.badgeClass}`}>
                    <span className="badge-title">{evalInfo.title}</span>
                    <span className="badge-subtitle">{evalInfo.summary}</span>
                  </div>
                );
              })()}
            </div>

            {/* College Rule Reminder Box */}
            <div className="college-notice-callout">
              <span className="notice-callout-icon">🎓</span>
              <div className="notice-callout-body">
                <strong>En la facultad las notas no se promedian</strong>
                <p>
                  Para <strong>Promoción Directa</strong> se exige alcanzar al menos {settingsForm.promoMin || 7} en cada parcial individualmente y aprobar el TP. Si obtenés menos de {settingsForm.passMin || 4} en algún parcial, no promedia con el otro: debés rendir su recuperatorio para poder regularizar.
                </p>
              </div>
            </div>

            {/* Dynamic Academic Diagnosis Box */}
            {(() => {
              const evalInfo = getSubjectAcademicEvaluation(selectedSubjectDetail, settingsForm);
              return (
                <div className={`academic-live-diagnosis ${evalInfo.badgeClass}`}>
                  <div className="diag-header">
                    <strong>Diagnóstico Académico: {evalInfo.title}</strong>
                  </div>
                  <p className="diag-text">{evalInfo.explanation}</p>
                </div>
              );
            })()}

            {subjectDetailSavedToast && (
              <div className="settings-success-toast animate-scale-up">
                <CheckCircleIcon size={16} />
                <span>✓ Notas e información guardadas correctamente</span>
              </div>
            )}

            {/* Grades and Details Form */}
            <form onSubmit={handleSaveSubjectDetail} className="subject-detail-form">
              <h4 className="detail-section-title">Instancias de Evaluación & Parciales</h4>

              <div className="grades-input-grid">
                <div className="grade-field">
                  <label>1° Parcial</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    placeholder="Nota (1-10)"
                    value={selectedSubjectDetail.p1 ?? ''}
                    onChange={(e) => setSelectedSubjectDetail({
                      ...selectedSubjectDetail,
                      p1: e.target.value === '' ? null : Number(e.target.value)
                    })}
                    className="form-input-pastel font-mono"
                  />
                  <small className="grade-hint">≥ {settingsForm.promoMin || 7} promo | ≥ {settingsForm.passMin || 4} regular</small>
                </div>

                <div className="grade-field">
                  <label>2° Parcial</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    placeholder="Nota (1-10)"
                    value={selectedSubjectDetail.p2 ?? ''}
                    onChange={(e) => setSelectedSubjectDetail({
                      ...selectedSubjectDetail,
                      p2: e.target.value === '' ? null : Number(e.target.value)
                    })}
                    className="form-input-pastel font-mono"
                  />
                  <small className="grade-hint">≥ {settingsForm.promoMin || 7} promo | ≥ {settingsForm.passMin || 4} regular</small>
                </div>

                <div className="grade-field">
                  <label>Recuperatorio 1° Parcial</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    placeholder="Solo si recuperás"
                    value={selectedSubjectDetail.recup1 ?? ''}
                    onChange={(e) => setSelectedSubjectDetail({
                      ...selectedSubjectDetail,
                      recup1: e.target.value === '' ? null : Number(e.target.value)
                    })}
                    className="form-input-pastel font-mono"
                  />
                  <small className="grade-hint">Reemplaza al 1° Parcial</small>
                </div>

                <div className="grade-field">
                  <label>Recuperatorio 2° Parcial</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    placeholder="Solo si recuperás"
                    value={selectedSubjectDetail.recup2 ?? ''}
                    onChange={(e) => setSelectedSubjectDetail({
                      ...selectedSubjectDetail,
                      recup2: e.target.value === '' ? null : Number(e.target.value)
                    })}
                    className="form-input-pastel font-mono"
                  />
                  <small className="grade-hint">Reemplaza al 2° Parcial</small>
                </div>

                <div className="grade-field">
                  <label>TP Obligatorio / Lab</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    placeholder="Nota o 10"
                    value={selectedSubjectDetail.tp ?? ''}
                    onChange={(e) => setSelectedSubjectDetail({
                      ...selectedSubjectDetail,
                      tp: e.target.value === '' ? null : Number(e.target.value)
                    })}
                    className="form-input-pastel font-mono"
                  />
                  <small className="grade-hint">Requisito para acreditar</small>
                </div>

                <div className="grade-field">
                  <label>Examen Final (Mesa)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    placeholder="Si rendiste final"
                    value={selectedSubjectDetail.finalExam ?? ''}
                    onChange={(e) => setSelectedSubjectDetail({
                      ...selectedSubjectDetail,
                      finalExam: e.target.value === '' ? null : Number(e.target.value)
                    })}
                    className="form-input-pastel font-mono"
                  />
                  <small className="grade-hint">Para materias regulares</small>
                </div>
              </div>

              <h4 className="detail-section-title">Datos de Cátedra & Apuntes</h4>

              <div className="form-row-dual">
                <div className="form-group">
                  <label className="form-label">Aula / Sede</label>
                  <input
                    type="text"
                    value={selectedSubjectDetail.classroom || ''}
                    onChange={(e) => setSelectedSubjectDetail({ ...selectedSubjectDetail, classroom: e.target.value })}
                    className="form-input-pastel"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Profesor / Cátedra</label>
                  <input
                    type="text"
                    value={selectedSubjectDetail.professor || ''}
                    onChange={(e) => setSelectedSubjectDetail({ ...selectedSubjectDetail, professor: e.target.value })}
                    className="form-input-pastel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Apuntes, Bibliografía o Enlace al Campus / Drive</label>
                <textarea
                  rows="3"
                  placeholder="Ej: Link al drive de apuntes, bibliografía recomendada, temas que entran en el parcial..."
                  value={selectedSubjectDetail.notes || ''}
                  onChange={(e) => setSelectedSubjectDetail({ ...selectedSubjectDetail, notes: e.target.value })}
                  className="form-input-pastel"
                ></textarea>
              </div>

              <div className="modal-actions-bar">
                <button type="submit" className="btn-save-settings-main">
                  <span>Guardar Notas y Cambios</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubjectDetail(null)}
                  className="btn-danger-outline"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AGENDAR FECHA / EXAMEN EN EL CALENDARIO */}
      {isAddEventModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddEventModalOpen(false)}>
          <div className="modal-card-pastel animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsAddEventModalOpen(false)}
              className="modal-close-btn"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="modal-header">
              <div className="brand-icon-wrapper mini">
                <CalendarIcon size={18} className="brand-icon" />
              </div>
              <h3 className="modal-title">Agendar Fecha en el Calendario</h3>
              <p className="modal-subtitle">Parciales, entregas de trabajos prácticos o fechas de final</p>
            </div>

            <form onSubmit={handleAddCalendarEvent} className="modal-form">
              <div className="form-group">
                <label className="form-label">Título del Evento *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ej. 2° Parcial (Unidades 4 y 5)"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="form-input-pastel"
                />
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label className="form-label">Materia Relacionada</label>
                  <select
                    value={newEventSubject}
                    onChange={(e) => setNewEventSubject(e.target.value)}
                    className="form-input-pastel"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="General / Trámite">General / Trámite</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Fecha</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    className="form-input-pastel"
                  >
                    <option value="parcial">🔴 Parcial</option>
                    <option value="entrega">🟡 Entrega Obligatoria TP</option>
                    <option value="recup">🔄 Recuperatorio</option>
                    <option value="final">🟣 Examen Final</option>
                    <option value="clase">🟢 Cursada Especial</option>
                  </select>
                </div>
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label className="form-label">Fecha (Día)</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="form-input-pastel font-mono"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Horario</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="Ej. 08:00 hs o 23:59 hs"
                    className="form-input-pastel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Aula / Plataforma</label>
                <input
                  type="text"
                  value={newEventRoom}
                  onChange={(e) => setNewEventRoom(e.target.value)}
                  placeholder="Ej. Aula 302 o Campus Moodle"
                  className="form-input-pastel"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notas o Recordatorio</label>
                <textarea
                  rows="2"
                  value={newEventNotes}
                  onChange={(e) => setNewEventNotes(e.target.value)}
                  placeholder="Ej. Llevar tabla de fórmulas y calculadora..."
                  className="form-input-pastel"
                ></textarea>
              </div>

              <button type="submit" className="btn-modal-primary-pastel">
                <span>Guardar en Calendario</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtectedDashboard({ onNavigate, initialTab = 'horario' }) {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <GatekeeperView
        onNavigate={onNavigate}
        onDemoLogin={() => {
          loginAsDemo();
        }}
      />
    );
  }

  return (
    <StudentDashboardView
      user={user}
      logout={logout}
      onNavigate={onNavigate}
      initialTab={initialTab}
    />
  );
}
