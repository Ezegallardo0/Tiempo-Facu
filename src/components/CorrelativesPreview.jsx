import { useState } from 'react';
import { CheckCircleIcon, ArrowRightIcon, SparklesIcon } from './Icons';

export default function CorrelativesPreview({ onOpenAuth }) {
  const [selectedCareer, setSelectedCareer] = useState('informatica');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const careersData = {
    informatica: {
      name: 'Ingeniería en Informática / Sistemas',
      subjects: [
        {
          id: 'ami',
          name: 'Análisis Matemático I',
          year: 1,
          status: 'aprobada',
          grade: 9,
          reqs: [],
          unlocks: ['Análisis Matemático II', 'Física I', 'Probabilidad y Estadística']
        },
        {
          id: 'alg1',
          name: 'Algoritmos y Programación I',
          year: 1,
          status: 'aprobada',
          grade: 8,
          reqs: [],
          unlocks: ['Estructuras de Datos y Algoritmos II', 'Paradigmas de Programación']
        },
        {
          id: 'alglin',
          name: 'Álgebra Lineal',
          year: 1,
          status: 'aprobada',
          grade: 7,
          reqs: [],
          unlocks: ['Análisis Matemático II', 'Geometría Analítica']
        },
        {
          id: 'am2',
          name: 'Análisis Matemático II',
          year: 2,
          status: 'en_curso',
          grade: null,
          reqs: ['Análisis Matemático I', 'Álgebra Lineal'],
          unlocks: ['Física II', 'Ecuaciones Diferenciales']
        },
        {
          id: 'edd',
          name: 'Estructuras de Datos & Algoritmos',
          year: 2,
          status: 'en_curso',
          grade: null,
          reqs: ['Algoritmos y Programación I'],
          unlocks: ['Sistemas Operativos', 'Bases de Datos', 'Redes de Información']
        },
        {
          id: 'fis1',
          name: 'Física I (Mecánica)',
          year: 2,
          status: 'aprobada',
          grade: 8,
          reqs: ['Análisis Matemático I'],
          unlocks: ['Física II']
        },
        {
          id: 'so',
          name: 'Sistemas Operativos',
          year: 3,
          status: 'desbloqueada',
          grade: null,
          reqs: ['Estructuras de Datos & Algoritmos'],
          unlocks: ['Sistemas Distribuidos', 'Seguridad Informática']
        },
        {
          id: 'bd',
          name: 'Bases de Datos',
          year: 3,
          status: 'desbloqueada',
          grade: null,
          reqs: ['Estructuras de Datos & Algoritmos'],
          unlocks: ['Ingeniería de Software', 'Minería de Datos']
        },
        {
          id: 'sd',
          name: 'Sistemas Distribuidos',
          year: 4,
          status: 'bloqueada',
          grade: null,
          reqs: ['Sistemas Operativos', 'Redes de Información'],
          unlocks: ['Arquitectura Cloud']
        }
      ]
    },
    abogacia: {
      name: 'Abogacía / Cs. Jurídicas',
      subjects: [
        {
          id: 'int_der',
          name: 'Introducción al Derecho',
          year: 1,
          status: 'aprobada',
          grade: 9,
          reqs: [],
          unlocks: ['Derecho Civil Parte General', 'Derecho Constitucional']
        },
        {
          id: 'der_rom',
          name: 'Derecho Romano',
          year: 1,
          status: 'aprobada',
          grade: 8,
          reqs: [],
          unlocks: ['Derecho Civil Parte General']
        },
        {
          id: 'civ_gen',
          name: 'Derecho Civil (Parte General)',
          year: 2,
          status: 'en_curso',
          grade: null,
          reqs: ['Introducción al Derecho', 'Derecho Romano'],
          unlocks: ['Obligaciones Civiles y Comerciales', 'Derechos Reales']
        },
        {
          id: 'der_const',
          name: 'Derecho Constitucional',
          year: 2,
          status: 'aprobada',
          grade: 8,
          reqs: ['Introducción al Derecho'],
          unlocks: ['Derecho Administrativo', 'Derechos Humanos']
        },
        {
          id: 'der_pen',
          name: 'Derecho Penal I',
          year: 2,
          status: 'en_curso',
          grade: null,
          reqs: ['Derecho Constitucional'],
          unlocks: ['Derecho Penal II', 'Derecho Procesal Penal']
        },
        {
          id: 'obliga',
          name: 'Obligaciones Civiles',
          year: 3,
          status: 'desbloqueada',
          grade: null,
          reqs: ['Derecho Civil (Parte General)'],
          unlocks: ['Contratos Civiles y Comerciales']
        },
        {
          id: 'proc_civ',
          name: 'Derecho Procesal Civil',
          year: 3,
          status: 'bloqueada',
          grade: null,
          reqs: ['Obligaciones Civiles', 'Derecho Constitucional'],
          unlocks: ['Práctica Profesional Forense']
        }
      ]
    }
  };

  const currentCareer = careersData[selectedCareer];
  const activeSubject = selectedSubject || currentCareer.subjects.find(s => s.status === 'en_curso') || currentCareer.subjects[0];

  return (
    <section className="correlatives-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">PLAN DE ESTUDIOS INTELIGENTE</span>
        <h2 className="section-heading">Mapa Visual de Correlativas & Avance</h2>
        <p className="section-subheading">
          Nunca más te quedes sin cursar por no haber rendido un final. Visualizá qué materias destraba cada materia aprobada con un solo clic.
        </p>
      </div>

      <div className="correlatives-container">
        {/* Career Switcher Tabs */}
        <div className="career-selector-bar">
          <span className="career-selector-label">Seleccioná un ejemplo de carrera:</span>
          <div className="career-pill-group">
            <button
              onClick={() => { setSelectedCareer('informatica'); setSelectedSubject(null); }}
              className={`career-pill ${selectedCareer === 'informatica' ? 'active' : ''}`}
            >
              💻 Ingeniería en Informática
            </button>
            <button
              onClick={() => { setSelectedCareer('abogacia'); setSelectedSubject(null); }}
              className={`career-pill ${selectedCareer === 'abogacia' ? 'active' : ''}`}
            >
              ⚖️ Abogacía
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="correlatives-legend">
          <span className="legend-item"><span className="legend-dot aprobada"></span> Aprobada</span>
          <span className="legend-item"><span className="legend-dot en_curso"></span> Cursando este cuatri</span>
          <span className="legend-item"><span className="legend-dot desbloqueada"></span> Habilitada para el próximo cuatri</span>
          <span className="legend-item"><span className="legend-dot bloqueada"></span> Bloqueada por correlativas</span>
        </div>

        {/* Main interactive tree layout */}
        <div className="correlatives-main-grid">
          {/* Subjects Map Column */}
          <div className="subjects-tree-pane">
            {[1, 2, 3, 4].map(year => {
              const yearSubjects = currentCareer.subjects.filter(s => s.year === year);
              if (yearSubjects.length === 0) return null;

              return (
                <div key={year} className="year-tier-row">
                  <div className="year-tier-label">
                    <span>AÑO {year}</span>
                  </div>
                  <div className="year-subjects-cards">
                    {yearSubjects.map(subj => {
                      const isSelected = activeSubject.id === subj.id;
                      return (
                        <div
                          key={subj.id}
                          className={`correlative-node-card status-${subj.status} ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => setSelectedSubject(subj)}
                        >
                          <div className="node-status-row">
                            <span className="node-year-badge">Año {subj.year}</span>
                            <span className={`node-status-chip ${subj.status}`}>
                              {subj.status === 'aprobada' && `✓ Nota: ${subj.grade}`}
                              {subj.status === 'en_curso' && '⏳ Cursando'}
                              {subj.status === 'desbloqueada' && '🔓 Habilitada'}
                              {subj.status === 'bloqueada' && '🔒 Bloqueada'}
                            </span>
                          </div>
                          <h4 className="node-subject-name">{subj.name}</h4>
                          <span className="node-hint">Hacé clic para ver correlativas</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details Pane Column */}
          <div className="subject-detail-pane">
            <div className="detail-pane-card animate-fade-in">
              <div className="detail-header">
                <span className={`detail-status-pill ${activeSubject.status}`}>
                  {activeSubject.status === 'aprobada' && 'Materia Aprobada con Final'}
                  {activeSubject.status === 'en_curso' && 'En Curso (2do Cuatrimestre 2026)'}
                  {activeSubject.status === 'desbloqueada' && 'Lista para cursar el próximo cuatri'}
                  {activeSubject.status === 'bloqueada' && 'Requiere correlativas previas'}
                </span>
                <h3 className="detail-title">{activeSubject.name}</h3>
                <span className="detail-year">Nivel: Año {activeSubject.year} de la carrera</span>
              </div>

              {/* Requirements list */}
              <div className="detail-section">
                <h5 className="detail-section-title">
                  <span>📥 Correlativas previas requeridas:</span>
                </h5>
                {activeSubject.reqs.length === 0 ? (
                  <p className="detail-none-text">Sin correlativas previas. Materia inicial del plan de estudios.</p>
                ) : (
                  <ul className="detail-list">
                    {activeSubject.reqs.map((req, rIdx) => (
                      <li key={rIdx} className="detail-list-item">
                        <CheckCircleIcon size={14} className="text-emerald" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Unlocks list */}
              <div className="detail-section">
                <h5 className="detail-section-title">
                  <span>🚀 Materias que te destraba al aprobarla:</span>
                </h5>
                <ul className="detail-list">
                  {activeSubject.unlocks.map((unl, uIdx) => (
                    <li key={uIdx} className="detail-list-item unlock-item">
                      <SparklesIcon size={14} className="text-cyan" />
                      <span>{unl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-pane-footer">
                <button onClick={() => onOpenAuth('register')} className="btn-detail-cta">
                  <span>Cargar el Plan de mi Facultad</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
