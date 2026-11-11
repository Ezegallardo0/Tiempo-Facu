import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ArrowRightIcon,
  SettingsIcon,
  PencilIcon
} from './Icons';

const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function StudentHomeHub({ onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const [todayDayName] = useState(() => DAYS_OF_WEEK[new Date().getDay()]);

  if (!isAuthenticated || !user) return null;

  const storageKey = `tiempofacu_dashboard_${user.id || 'demo'}`;

  // Read saved subjects or default
  let subjects = [];
  try {
    const saved = localStorage.getItem(`${storageKey}_subjects`);
    if (saved) subjects = JSON.parse(saved);
  } catch {}

  if (!subjects || subjects.length === 0) {
    subjects = [
      { id: 'sub_1', name: 'Análisis Matemático II', day: 'Lunes', time: '08:00 - 12:00 hs', classroom: 'Aula 302 - Pabellón 2', professor: 'Dr. Gómez', p1: 8, p2: 9, color: 'lavender' },
      { id: 'sub_2', name: 'Estructuras de Datos & Algoritmos', day: 'Martes', time: '14:00 - 18:00 hs', classroom: 'Laboratorio 4', professor: 'Lic. Rossi', p1: 7, p2: 8, color: 'mint' },
      { id: 'sub_3', name: 'Física II (Electromagnetismo)', day: 'Miércoles', time: '09:00 - 13:00 hs', classroom: 'Lab Central', professor: 'Ing. Méndez', p1: 5, p2: 6, color: 'yellow' },
      { id: 'sub_4', name: 'Arquitectura de Computadoras', day: 'Jueves', time: '18:00 - 22:00 hs', classroom: 'Aula Magna', professor: 'Dra. Valenzuela', p1: 9, p2: null, color: 'sky' }
    ];
  }

  // Read saved calendar events or default
  let events = [];
  try {
    const saved = localStorage.getItem(`${storageKey}_calendar_events`);
    if (saved) events = JSON.parse(saved);
  } catch {}

  if (!events || events.length === 0) {
    events = [
      { id: 'ev_1', title: '2° Parcial (Unidades 4 a 7)', subject: 'Análisis Matemático II', date: '2026-11-16', time: '08:00 hs', type: 'parcial', classroom: 'Aula 302' },
      { id: 'ev_2', title: 'Entrega Obligatoria TP Árboles AVL', subject: 'Estructuras de Datos & Algoritmos', date: '2026-11-18', time: '23:59 hs', type: 'entrega', classroom: 'Campus Virtual' }
    ];
  }

  // Determine today's classes
  const todayClasses = subjects.filter(s => s.day === todayDayName);

  // Quick stats
  const promoCount = subjects.filter(s => {
    const p1 = s.recup1 ?? s.p1;
    const p2 = s.recup2 ?? s.p2;
    return p1 >= 7 && p2 >= 7;
  }).length;

  const regularCount = subjects.filter(s => {
    const p1 = s.recup1 ?? s.p1;
    const p2 = s.recup2 ?? s.p2;
    return p1 >= 4 && p2 >= 4 && !(p1 >= 7 && p2 >= 7);
  }).length;

  return (
    <section className="student-home-hub-section animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="hub-welcome-banner">
        <div className="hub-welcome-left">
          <div className="hub-status-pill">
            <span className="hub-dot-pulse"></span>
            <span>SESIÓN INICIADA • {user.university.toUpperCase()}</span>
          </div>
          <h2 className="hub-welcome-title">
            Tu Centro de Comando Universitario, <span className="text-primary">{user.name.split(' ')[0]}</span> 🎒
          </h2>
          <p className="hub-welcome-sub">
            {user.career ? `${user.career} • ` : ''}{user.semester} • {subjects.length} materias registradas
          </p>
        </div>

        <div className="hub-welcome-actions">
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-hub-primary"
            title="Ir a mi horario y tareas"
          >
            <CalendarIcon size={16} />
            <span>Abrir Mi Panel</span>
            <ArrowRightIcon size={15} />
          </button>
          <button
            onClick={() => onNavigate('calendar')}
            className="btn-hub-secondary"
            title="Ver calendario mensual"
          >
            <span>🗓️ Calendario</span>
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="btn-hub-tertiary"
            title="Configuración de estudiante"
          >
            <SettingsIcon size={15} />
          </button>
        </div>
      </div>

      {/* 3-Column Highlights Grid */}
      <div className="hub-cards-grid">
        {/* Card 1: Cursada de Hoy */}
        <div className="hub-card-item">
          <div className="hub-card-header">
            <span className="hub-card-icon-bubble lavender">⏰</span>
            <div>
              <h3 className="hub-card-title">Tu Cursada Hoy ({todayDayName})</h3>
              <p className="hub-card-sub">Horarios y aulas de este día</p>
            </div>
          </div>

          <div className="hub-card-content">
            {todayClasses.length > 0 ? (
              <div className="hub-today-classes-list">
                {todayClasses.map(c => (
                  <div key={c.id} className="hub-class-chip">
                    <div className="hub-class-name">
                      <strong>{c.name}</strong>
                      <span className="hub-chip-time"><ClockIcon size={12} /> {c.time}</span>
                    </div>
                    <div className="hub-class-meta">
                      <span><MapPinIcon size={12} /> {c.classroom}</span>
                      <span>• {c.professor}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="hub-empty-today">
                <span className="hub-relax-emoji">☕</span>
                <p><strong>¡Hoy no tenés clases presenciales!</strong></p>
                <small>Buen momento para avanzar tareas pendientes o preparar mates.</small>
              </div>
            )}
          </div>

          <div className="hub-card-footer">
            <button onClick={() => onNavigate('dashboard')} className="btn-hub-link">
              Ver grilla semanal completa →
            </button>
          </div>
        </div>

        {/* Card 2: Próximos Exámenes & Entregas */}
        <div className="hub-card-item">
          <div className="hub-card-header">
            <span className="hub-card-icon-bubble peach">📅</span>
            <div>
              <h3 className="hub-card-title">Próximas Fechas Críticas</h3>
              <p className="hub-card-sub">Parciales y entregas agendadas</p>
            </div>
          </div>

          <div className="hub-card-content">
            {events.length > 0 ? (
              <div className="hub-events-mini-list">
                {events.slice(0, 2).map(ev => (
                  <div key={ev.id} className={`hub-event-item ${ev.type}`}>
                    <div className="hub-event-top">
                      <span className={`hub-event-badge ${ev.type}`}>
                        {ev.type === 'parcial' && '🔴 Parcial'}
                        {ev.type === 'entrega' && '🟡 Entrega TP'}
                        {ev.type === 'recup' && '🔄 Recuperatorio'}
                        {ev.type === 'final' && '🟣 Final'}
                        {ev.type === 'clase' && '🟢 Cursada'}
                      </span>
                      <span className="hub-event-date-text">{ev.date}</span>
                    </div>
                    <h4 className="hub-event-item-title">{ev.title}</h4>
                    <span className="hub-event-room">{ev.classroom} • {ev.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="hub-empty-today">
                <p>No tenés parciales cargados aún.</p>
              </div>
            )}
          </div>

          <div className="hub-card-footer">
            <button onClick={() => onNavigate('calendar')} className="btn-hub-link">
              Abrir calendario mensual de fechas →
            </button>
          </div>
        </div>

        {/* Card 3: Estado de Materias & Notas */}
        <div className="hub-card-item">
          <div className="hub-card-header">
            <span className="hub-card-icon-bubble mint">📊</span>
            <div>
              <h3 className="hub-card-title">Condición de Materias</h3>
              <p className="hub-card-sub">Evaluación individual sin promedios</p>
            </div>
          </div>

          <div className="hub-card-content">
            <div className="hub-grades-metrics-row">
              <div className="hub-metric-pill green">
                <span className="metric-num">{promoCount}</span>
                <span className="metric-lbl">Promocionadas 🎉</span>
              </div>
              <div className="hub-metric-pill yellow">
                <span className="metric-num">{regularCount}</span>
                <span className="metric-lbl">Regulares (Final) 📚</span>
              </div>
            </div>

            <div className="hub-subjects-pill-list">
              {subjects.slice(0, 3).map(s => (
                <div key={s.id} className="hub-sub-chip">
                  <span className="sub-name">{s.name}</span>
                  <span className="sub-grades">
                    1°P: <strong>{s.recup1 ?? s.p1 ?? '-'}</strong> | 2°P: <strong>{s.recup2 ?? s.p2 ?? '-'}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="hub-card-footer">
            <button onClick={() => onNavigate('dashboard')} className="btn-hub-link">
              <PencilIcon size={12} />
              <span>Ver materias & subir notas →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
