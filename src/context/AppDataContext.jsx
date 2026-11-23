import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

const AppDataContext = createContext(null);

const DEFAULT_SUBJECTS = [
  { id: 'sub_1', name: 'Análisis Matemático II', code: 'MAT-204', day: 'Lunes', time: '08:00 - 12:00 hs', classroom: 'Aula 302 - Pab. 2', professor: 'Dr. Alejandro Gómez', commission: '02', color: 'lavender', p1: 8, p2: 9, recup1: null, recup2: null, tp: 9, finalExam: null, notes: '' },
  { id: 'sub_2', name: 'Estructuras de Datos', code: 'INF-102', day: 'Martes', time: '14:00 - 18:00 hs', classroom: 'Laboratorio 4', professor: 'Lic. Mariana Rossi', commission: '01', color: 'mint', p1: 7, p2: 8, recup1: null, recup2: null, tp: 10, finalExam: null, notes: '' },
  { id: 'sub_3', name: 'Física II', code: 'FIS-201', day: 'Miércoles', time: '09:00 - 13:00 hs', classroom: 'Lab Central', professor: 'Ing. Carlos Méndez', commission: '03', color: 'yellow', p1: 5, p2: 6, recup1: null, recup2: null, tp: 8, finalExam: null, notes: '' },
  { id: 'sub_4', name: 'Arquitectura de Computadoras', code: 'INF-203', day: 'Jueves', time: '18:00 - 22:00 hs', classroom: 'Aula Magna', professor: 'Dra. Sofía Valenzuela', commission: '01', color: 'sky', p1: 9, p2: null, recup1: null, recup2: null, tp: 9, finalExam: null, notes: '' },
];

const DEFAULT_TASKS = [
  { id: 't_1', title: 'Terminar guía 5 de Análisis II', description: '', subjectId: 'sub_1', dueDate: '2026-11-25', dueTime: '23:59', priority: 'alta', status: 'completada', category: 'tp', subtasks: [], tags: [], createdAt: '2026-11-20', done: true },
  { id: 't_2', title: 'Subir TP de Árboles AVL al Campus', description: '', subjectId: 'sub_2', dueDate: '2026-11-27', dueTime: '23:59', priority: 'alta', status: 'pendiente', category: 'tp', subtasks: [{ id: 'st_1', text: 'Implementar AVL', done: true }, { id: 'st_2', text: 'Escribir informe', done: false }], tags: [], createdAt: '2026-11-20', done: false },
  { id: 't_3', title: 'Repasar teoría de memoria caché', description: '', subjectId: 'sub_4', dueDate: '2026-11-28', dueTime: '23:59', priority: 'media', status: 'en_progreso', category: 'parcial', subtasks: [], tags: [], createdAt: '2026-11-21', done: false },
  { id: 't_4', title: 'Pedir apuntes de Física II', description: '', subjectId: 'sub_3', dueDate: '2026-11-30', dueTime: '12:00', priority: 'baja', status: 'pendiente', category: 'otro', subtasks: [], tags: [], createdAt: '2026-11-21', done: false },
];

const DEFAULT_EVENTS = [
  { id: 'ev_1', title: '2° Parcial AM II', subjectId: 'sub_1', date: '2026-11-25', time: '08:00', type: 'parcial', classroom: 'Aula 302', notes: 'Llevar tabla de integrales.' },
  { id: 'ev_2', title: 'Entrega TP Árboles AVL', subjectId: 'sub_2', date: '2026-11-27', time: '23:59', type: 'entrega', classroom: 'Campus Virtual', notes: '' },
  { id: 'ev_3', title: 'Recup. 1° Parcial Física', subjectId: 'sub_3', date: '2026-11-30', time: '09:00', type: 'recup', classroom: 'Lab Central', notes: '' },
  { id: 'ev_4', title: '2° Parcial Arquitectura', subjectId: 'sub_4', date: '2026-12-02', time: '18:00', type: 'parcial', classroom: 'Aula Magna', notes: 'Definición de promoción.' },
  { id: 'ev_5', title: 'Final Física II', subjectId: 'sub_3', date: '2026-12-10', time: '09:00', type: 'final', classroom: 'Aula Magna', notes: '' },
];

const DEFAULT_EXAMS = [
  { id: 'ex_1', name: '2° Parcial', subjectId: 'sub_1', date: '2026-11-25', time: '08:00', type: 'parcial', topics: 'Integrales dobles y triples, Teoremas de Green, Stokes y Gauss', preparationLevel: 70, notes: '', grade: null },
  { id: 'ex_2', name: '2° Parcial', subjectId: 'sub_4', date: '2026-12-02', time: '18:00', type: 'parcial', topics: 'Pipeline, Memoria Caché, Microcontroladores', preparationLevel: 50, notes: 'Necesito ≥7 para promocionar', grade: null },
  { id: 'ex_3', name: 'Recup. 1° Parcial', subjectId: 'sub_3', date: '2026-11-30', time: '09:00', type: 'recuperatorio', topics: 'Electrostática y Magnetismo', preparationLevel: 40, notes: '', grade: null },
  { id: 'ex_4', name: 'Final', subjectId: 'sub_3', date: '2026-12-10', time: '09:00', type: 'final', topics: 'Temario completo', preparationLevel: 20, notes: '', grade: null },
];

const DEFAULT_NOTES = [
  { id: 'n_1', title: 'Regla de Oro — Notas en Argentina', content: 'En la universidad NO se promedia. 4 + 7 NO da promoción. Para promocionar directamente necesitás ≥7 en CADA parcial por separado. Para regularizar (ir a final) necesitás ≥4 en cada parcial.', subjectId: null, tags: ['importante'], color: 'lavender', createdAt: '2026-11-01', updatedAt: '2026-11-01' },
  { id: 'n_2', title: 'Resumen Capítulo 5 — Memoria Caché', content: 'Jerarquía de memoria: registros, caché L1/L2/L3, RAM, disco. Principio de localidad temporal y espacial. Mapeo directo vs. asociativo por conjuntos.', subjectId: 'sub_4', tags: ['resumen', 'parcial'], color: 'sky', createdAt: '2026-11-15', updatedAt: '2026-11-20' },
  { id: 'n_3', title: 'Fórmulas Integrales Dobles', content: 'Integración por cambio de variables. Jacobiano. Coordenadas polares: x=r·cos(θ), y=r·sin(θ), dA=r·dr·dθ', subjectId: 'sub_1', tags: ['fórmulas'], color: 'mint', createdAt: '2026-11-10', updatedAt: '2026-11-18' },
];

function loadOrDefault(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.id || 'demo';
  const k = (name) => `tiempofacu_v2_${uid}_${name}`;

  const [subjects, setSubjects] = useState(() => loadOrDefault(k('subjects'), DEFAULT_SUBJECTS));
  const [tasks, setTasks] = useState(() => loadOrDefault(k('tasks'), DEFAULT_TASKS));
  const [events, setEvents] = useState(() => loadOrDefault(k('events'), DEFAULT_EVENTS));
  const [exams, setExams] = useState(() => loadOrDefault(k('exams'), DEFAULT_EXAMS));
  const [notes, setNotes] = useState(() => loadOrDefault(k('notes'), DEFAULT_NOTES));
  const [studySessions, setStudySessions] = useState(() => loadOrDefault(k('sessions'), []));
  const [notifications, setNotifications] = useState(() => loadOrDefault(k('notifications'), []));

  // Persist on change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { save(k('subjects'), subjects); }, [subjects, uid, k]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { save(k('tasks'), tasks); }, [tasks, uid, k]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { save(k('events'), events); }, [events, uid, k]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { save(k('exams'), exams); }, [exams, uid, k]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { save(k('notes'), notes); }, [notes, uid, k]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { save(k('sessions'), studySessions); }, [studySessions, uid, k]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { save(k('notifications'), notifications); }, [notifications, uid, k]);

  // --- Subjects ---
  const addSubject = (data) => setSubjects(prev => [...prev, { id: `sub_${Date.now()}`, p1: null, p2: null, recup1: null, recup2: null, tp: null, finalExam: null, notes: '', commission: '', ...data }]);
  const updateSubject = (id, data) => setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteSubject = (id) => setSubjects(prev => prev.filter(s => s.id !== id));

  // --- Tasks ---
  const addTask = (data) => {
    const newTask = { id: `t_${Date.now()}`, status: 'pendiente', done: false, subtasks: [], tags: [], createdAt: new Date().toISOString().split('T')[0], ...data };
    setTasks(prev => [newTask, ...prev]);
    addNotification({ type: 'task', message: `Nueva tarea: "${newTask.title}"`, read: false });
    return newTask;
  };
  const updateTask = (id, data) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data, done: (data.status || t.status) === 'completada' } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, status: !t.done ? 'completada' : 'pendiente' } : t));

  // --- Events ---
  const addEvent = (data) => setEvents(prev => [...prev, { id: `ev_${Date.now()}`, notes: '', ...data }]);
  const updateEvent = (id, data) => setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  // --- Exams ---
  const addExam = (data) => setExams(prev => [...prev, { id: `ex_${Date.now()}`, preparationLevel: 0, grade: null, notes: '', ...data }]);
  const updateExam = (id, data) => setExams(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  const deleteExam = (id) => setExams(prev => prev.filter(e => e.id !== id));

  // --- Notes ---
  const addNote = (data) => setNotes(prev => [{ id: `n_${Date.now()}`, tags: [], color: 'lavender', createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], ...data }, ...prev]);
  const updateNote = (id, data) => setNotes(prev => prev.map(n => n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString().split('T')[0] } : n));
  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  // --- Study Sessions ---
  const addSession = (data) => setStudySessions(prev => [{ id: `ss_${Date.now()}`, startedAt: new Date().toISOString(), ...data }, ...prev]);

  // --- Notifications ---
  const addNotification = (data) => setNotifications(prev => [{ id: `notif_${Date.now()}`, createdAt: new Date().toISOString(), read: false, ...data }, ...prev].slice(0, 50));
  const markNotificationRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppDataContext.Provider value={{
      subjects, addSubject, updateSubject, deleteSubject,
      tasks, addTask, updateTask, deleteTask, toggleTask,
      events, addEvent, updateEvent, deleteEvent,
      exams, addExam, updateExam, deleteExam,
      notes, addNote, updateNote, deleteNote,
      studySessions, addSession,
      notifications, addNotification, markNotificationRead, markAllRead, unreadCount,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
