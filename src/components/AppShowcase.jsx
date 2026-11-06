import { useState } from 'react';
import { CalendarIcon, ClockIcon, CheckCircleIcon, BookOpenIcon, BellIcon, MapPinIcon } from './Icons';

export default function AppShowcase() {
  const [activeTab, setActiveTab] = useState('horarios');
  const [selectedClass, setSelectedClass] = useState(null);
  const [examReminderActive, setExamReminderActive] = useState({ 1: true, 2: false, 3: true });

  const toggleReminder = (id) => {
    setExamReminderActive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scheduleClasses = [
    {
      id: 'am2',
      name: 'Análisis Matemático II',
      code: 'MAT-204',
      day: 'Lunes',
      time: '08:00 - 12:00 hs',
      type: 'Teórica + Práctica',
      classroom: 'Aula 302 (Pabellón 2)',
      professor: 'Dr. Alejandro Gómez',
      color: 'lavender',
      attendance: 90,
      notes: 'Llevar tabla de integrales dobles y guía 4 resuelta.'
    },
    {
      id: 'edd',
      name: 'Estructuras de Datos & Algoritmos',
      code: 'INF-102',
      day: 'Martes',
      time: '14:00 - 18:00 hs',
      type: 'Laboratorio de Código',
      classroom: 'Lab 4 (Piso 2)',
      professor: 'Lic. Mariana Rossi',
      color: 'mint',
      attendance: 100,
      notes: 'Entrega en repo de Git antes de las 14:00 hs.'
    },
    {
      id: 'fis2',
      name: 'Física II (Electromagnetismo)',
      code: 'FIS-201',
      day: 'Miércoles',
      time: '09:00 - 13:00 hs',
      type: 'Clase Experimental',
      classroom: 'Laboratorio Central',
      professor: 'Ing. Carlos Méndez',
      color: 'yellow',
      attendance: 85,
      notes: 'Llevar tester y cuaderno de laboratorio.'
    },
    {
      id: 'arq',
      name: 'Arquitectura de Computadoras',
      code: 'INF-203',
      day: 'Jueves',
      time: '18:00 - 22:00 hs',
      type: 'Teórica & Taller',
      classroom: 'Aula Magna (Sede Central)',
      professor: 'Dra. Sofía Valenzuela',
      color: 'sky',
      attendance: 95,
      notes: 'Repaso de pipeline, memoria caché y microcontroladores.'
    },
    {
      id: 'leg',
      name: 'Legislación y Ética Profesional',
      code: 'HUM-301',
      day: 'Viernes',
      time: '16:00 - 19:00 hs',
      type: 'Seminario Debate',
      classroom: 'Aula 14 (Anexo)',
      professor: 'Abg. Roberto Páez',
      color: 'peach',
      attendance: 80,
      notes: 'Lectura de fallo judicial sobre propiedad intelectual.'
    }
  ];

  const exams = [
    {
      id: 1,
      title: '1° Parcial: Estructuras de Datos',
      subject: 'Estructuras de Datos & Algoritmos',
      daysLeft: 4,
      date: 'Martes 10 Noviembre • 14:00 hs',
      topics: 'Árboles AVL, Grafos, Recorridos BFS/DFS y Algoritmo de Dijkstra',
      urgency: 'high',
      studyProgress: 75,
      color: 'mint'
    },
    {
      id: 2,
      title: 'Entrega TP N° 3: Simulador de Caché',
      subject: 'Arquitectura de Computadoras',
      daysLeft: 8,
      date: 'Jueves 14 Noviembre • 23:59 hs (Campus)',
      topics: 'Implementación en C/C++ y reporte de fallos L1/L2',
      urgency: 'medium',
      studyProgress: 90,
      color: 'sky'
    },
    {
      id: 3,
      title: '2° Parcial: Análisis Matemático II',
      subject: 'Análisis Matemático II',
      daysLeft: 15,
      date: 'Lunes 21 Noviembre • 08:30 hs',
      topics: 'Integrales dobles y triples, Teoremas de Green, Stokes y Gauss',
      urgency: 'normal',
      studyProgress: 45,
      color: 'lavender'
    }
  ];

  return (
    <section id="preview" className="showcase-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">ASÍ SE VE TU DÍA</span>
        <h2 className="section-heading">Tu organizador personal de facultad</h2>
        <p className="section-subheading">
          Elegí colores pasteles para tus materias, mirá en qué aula cursás hoy y tené siempre a mano cuándo rinde cada parcial.
        </p>
      </div>

      {/* Desk Planner Container */}
      <div className="planner-desk-container">
        {/* Planner Header */}
        <div className="planner-topbar">
          <div className="planner-window-controls">
            <span className="p-dot p-rose"></span>
            <span className="p-dot p-yellow"></span>
            <span className="p-dot p-mint"></span>
          </div>

          <div className="planner-semester-tag">
            <BookOpenIcon size={15} />
            <span>2° Cuatrimestre 2026 • Semana 11</span>
          </div>

          {/* Tab Switcher */}
          <div className="planner-tabs">
            <button
              onClick={() => setActiveTab('horarios')}
              className={`planner-tab-btn ${activeTab === 'horarios' ? 'active' : ''}`}
            >
              <CalendarIcon size={15} />
              <span>Mi Horario Semanal</span>
            </button>
            <button
              onClick={() => setActiveTab('parciales')}
              className={`planner-tab-btn ${activeTab === 'parciales' ? 'active' : ''}`}
            >
              <ClockIcon size={15} />
              <span>Parciales & Entregas</span>
              <span className="badge-notification">3</span>
            </button>
            <button
              onClick={() => setActiveTab('avance')}
              className={`planner-tab-btn ${activeTab === 'avance' ? 'active' : ''}`}
            >
              <CheckCircleIcon size={15} />
              <span>Mis Promedios</span>
            </button>
          </div>
        </div>

        {/* Planner Main Canvas */}
        <div className="planner-canvas">
          {/* TAB 1: HORARIOS & STICKY NOTE */}
          {activeTab === 'horarios' && (
            <div className="planner-tab-content animate-fade-in">
              <div className="planner-view-split">
                {/* Left: Schedule Cards Grid */}
                <div className="schedule-column">
                  <div className="column-header-row">
                    <div>
                      <h3 className="column-title">Cronograma de Cursada</h3>
                      <p className="column-desc">5 materias activas • 0 solapamientos de horario</p>
                    </div>
                    <span className="tag-regular-safe">
                      ✓ Regularidad en regla (85%+ asistencia)
                    </span>
                  </div>

                  <div className="schedule-pastel-grid">
                    {scheduleClasses.map((item) => (
                      <div
                        key={item.id}
                        className={`pastel-class-card ${item.color} ${selectedClass?.id === item.id ? 'is-active' : ''}`}
                        onClick={() => setSelectedClass(selectedClass?.id === item.id ? null : item)}
                      >
                        <div className="card-header-line">
                          <span className="class-day-badge">{item.day}</span>
                          <span className="class-time-tag">
                            <ClockIcon size={13} /> {item.time}
                          </span>
                        </div>

                        <h4 className="class-title-text">{item.name}</h4>
                        <span className="class-code-pill">{item.code} • {item.type}</span>

                        <div className="class-room-row">
                          <MapPinIcon size={14} />
                          <span>{item.classroom}</span>
                        </div>

                        <div className="class-footer-row">
                          <span className="class-prof">Prof: {item.professor}</span>
                          <span className="class-attendance">{item.attendance}% asistencia</span>
                        </div>

                        {selectedClass?.id === item.id && (
                          <div className="class-expanded-note animate-fade-in">
                            <p className="expanded-note-text">
                              <strong>💡 Recordatorio para la clase:</strong> {item.notes}
                            </p>
                            <button
                              className="btn-open-drive"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Carpeta de apuntes y resúmenes sincronizada.');
                              }}
                            >
                              📂 Ver apuntes de la materia
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Desk Sticky Note Widget */}
                <div className="desk-widgets-sidebar">
                  {/* Sticky Note 1 */}
                  <div className="pastel-sticky-widget yellow">
                    <div className="sticky-header">
                      <span className="sticky-pin-icon">📌</span>
                      <span className="sticky-date">Esta semana</span>
                    </div>
                    <p className="sticky-body font-hand">
                      "Comprar resaltador pastel y pedirle a Flor las fotos del pizarrón del lunes. ¡No olvidar la calculadora científica el jueves!"
                    </p>
                    <div className="sticky-checklist-mini">
                      <label className="mini-check-label">
                        <input type="checkbox" defaultChecked />
                        <span>Revisar práctica 4 de Análisis</span>
                      </label>
                      <label className="mini-check-label">
                        <input type="checkbox" defaultChecked />
                        <span>Imprimir TP de Arquitectura</span>
                      </label>
                      <label className="mini-check-label">
                        <input type="checkbox" />
                        <span>Armar resumen de Física</span>
                      </label>
                    </div>
                  </div>

                  {/* Motivational Coffee Widget */}
                  <div className="pastel-widget-card mint">
                    <div className="widget-icon-title">
                      <span className="w-emoji">☕</span>
                      <div>
                        <h4 className="w-title">Semana 11 en marcha</h4>
                        <p className="w-sub">Estás al día con el 80% de tus materias. ¡Gran ritmo!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARCIALES & ENTREGAS */}
          {activeTab === 'parciales' && (
            <div className="planner-tab-content animate-fade-in">
              <div className="column-header-row">
                <div>
                  <h3 className="column-title">Próximos Parciales & Entregas de TP</h3>
                  <p className="column-desc">Recordatorios automáticos para que estudies con tiempo y sin angustia</p>
                </div>
                <span className="tag-filter-pill">Semanas 10 a 14</span>
              </div>

              <div className="exams-pastel-list">
                {exams.map((exam) => (
                  <div key={exam.id} className={`exam-pastel-card ${exam.color}`}>
                    <div className="exam-countdown-box">
                      <span className="countdown-number">{exam.daysLeft}</span>
                      <span className="countdown-sub">DÍAS</span>
                    </div>

                    <div className="exam-content-area">
                      <div className="exam-title-row">
                        <h4 className="exam-name">{exam.title}</h4>
                        <span className={`exam-pill ${exam.urgency}`}>
                          {exam.urgency === 'high' ? '🔥 Esta semana' : exam.urgency === 'medium' ? '⚡ Próxima semana' : '📘 Programado'}
                        </span>
                      </div>
                      <p className="exam-date-meta">
                        {exam.subject} • <strong>{exam.date}</strong>
                      </p>
                      <p className="exam-topics-text">
                        <strong>Temario:</strong> {exam.topics}
                      </p>

                      <div className="exam-study-progress">
                        <div className="study-progress-track">
                          <div
                            className="study-progress-bar"
                            style={{ width: `${exam.studyProgress}%` }}
                          ></div>
                        </div>
                        <span className="study-progress-text">
                          {exam.studyProgress}% de temas repasados
                        </span>
                      </div>
                    </div>

                    <div className="exam-reminder-col">
                      <button
                        onClick={() => toggleReminder(exam.id)}
                        className={`btn-exam-bell ${examReminderActive[exam.id] ? 'active' : ''}`}
                        title="Activar o desactivar recordatorio"
                      >
                        <BellIcon size={16} />
                        <span>{examReminderActive[exam.id] ? 'Alarma activa' : 'Silenciado'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROMEDIOS & RENDIMIENTO */}
          {activeTab === 'avance' && (
            <div className="planner-tab-content animate-fade-in">
              <div className="column-header-row">
                <div>
                  <h3 className="column-title">Tu Libreta & Avance de Carrera</h3>
                  <p className="column-desc">Cálculo transparente de promedios para becas y plan de estudio</p>
                </div>
                <span className="tag-plan-pill">Plan Universitario 2020</span>
              </div>

              <div className="grades-summary-grid">
                <div className="grade-pastel-card mint">
                  <span className="grade-card-label">Promedio con aplazos</span>
                  <div className="grade-card-number">8.42</div>
                  <span className="grade-card-sub">Top 8% de tu comisión 🌟</span>
                </div>

                <div className="grade-pastel-card lavender">
                  <span className="grade-card-label">Promedio sin aplazos</span>
                  <div className="grade-card-number">8.75</div>
                  <span className="grade-card-sub">Excelente para aplicar a becas</span>
                </div>

                <div className="grade-pastel-card yellow">
                  <span className="grade-card-label">Materias aprobadas</span>
                  <div className="grade-card-number">22 <span className="grade-total">/ 38</span></div>
                  <span className="grade-card-sub">58% de la carrera completada</span>
                </div>

                <div className="grade-pastel-card sky">
                  <span className="grade-card-label">Próximo Cuatrimestre</span>
                  <div className="grade-card-number">4</div>
                  <span className="grade-card-sub">Materias correlativas listas</span>
                </div>
              </div>

              <div className="career-progress-pastel-card">
                <div className="career-progress-header">
                  <span className="career-progress-title">Progreso hacia el título de grado</span>
                  <span className="career-progress-perc font-mono">57.9% de créditos aprobados</span>
                </div>
                <div className="career-track">
                  <div className="career-fill" style={{ width: '58%' }}></div>
                </div>
                <div className="career-phases">
                  <span className="phase-done">Ciclo Básico (100% ✔)</span>
                  <span className="phase-current">Ciclo Profesional (En curso ⏳)</span>
                  <span className="phase-pending">Práctica Profesional / Tesina</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
