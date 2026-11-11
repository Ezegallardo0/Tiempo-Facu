import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon } from './Icons';

export default function PromoCalculator({ onOpenAuth, onNavigate }) {
  const { isAuthenticated } = useAuth();
  const [subjectName, setSubjectName] = useState('Análisis Matemático II');
  const [grade1, setGrade1] = useState(8);
  const [tpApproved, setTpApproved] = useState(true);
  const [promoCutoff, setPromoCutoff] = useState(7); // Must score >= 7 on EACH exam
  const passCutoff = 4; // Must score >= 4 on each exam for regularidad

  // UNIVERSITY RULES (STRICT: NO AVERAGING!)
  // In college, you cannot average a 4 and a 7 to promote.
  // Both exams must independently be >= promoCutoff.
  const isP1Passing = grade1 >= passCutoff;
  const isP1Promoting = grade1 >= promoCutoff;

  let academicStage = 'promo_track';
  if (!isP1Passing) {
    academicStage = 'failed_p1';
  } else if (!isP1Promoting) {
    academicStage = 'regular_only';
  } else {
    academicStage = 'promo_track';
  }

  return (
    <section id="simulador" className="calculator-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">REGLAMENTO UNIVERSITARIO • EVALUACIÓN REAL</span>
        <h2 className="section-heading">Simulador de Promoción: ¿Con cuánto apruebo o promociono?</h2>
        <p className="section-subheading">
          En la facultad las notas <strong>NO se promedian</strong>: un <strong>4 + 7 NO te hace promocionar</strong>. 
          Para promocionar directo sin rendir final, <strong>debés sacar más de 7 (≥ 7) en cada parcial por separado</strong>.
        </p>
      </div>

      {/* University Strict Rule Banner */}
      <div className="university-rule-banner animate-fade-in">
        <div className="rule-banner-icon">⚠️</div>
        <div className="rule-banner-text">
          <strong>Regla de oro universitaria:</strong> En la facultad cada parcial es una instancia eliminatoria independiente. 
          Un <strong>4</strong> solo sirve para conservar la regularidad (e ir a mesa de final); <strong>jamás promedia con notas altas para promocionar</strong>. 
          Para evitar el examen final, debés alcanzar <strong>≥ {promoCutoff} en el 1° Parcial Y en el 2° Parcial</strong>.
        </div>
      </div>

      <div className="calculator-card-pastel">
        <div className="calc-grid">
          {/* Inputs Column */}
          <div className="calc-inputs-col">
            <div className="calc-input-group">
              <label className="calc-label">Nombre de tu materia</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Ej. Análisis Matemático II, Derecho Civil..."
                className="calc-text-input"
              />
            </div>

            {/* Slider 1: Primer Parcial */}
            <div className="slider-box-pastel">
              <div className="slider-header">
                <span className="slider-name">Nota obtenida en el 1° Parcial</span>
                <span className={`slider-value-badge ${grade1 >= promoCutoff ? 'high' : grade1 >= passCutoff ? 'mid' : 'low'}`}>
                  {grade1} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={grade1}
                onChange={(e) => setGrade1(Number(e.target.value))}
                className="custom-range-slider"
                aria-label="Nota del 1° Parcial"
              />
              <div className="slider-ticks">
                <span className={grade1 < passCutoff ? 'active-tick text-danger' : ''}>1-3 (Aplazo)</span>
                <span className={grade1 >= passCutoff && grade1 < promoCutoff ? 'active-tick text-warning' : ''}>4-6 (Regular)</span>
                <span className={grade1 >= promoCutoff ? 'active-tick text-success' : ''}>≥ {promoCutoff} (Promoción)</span>
              </div>
            </div>

            {/* TP Obligatorio toggle */}
            <div className="tp-toggle-box">
              <span className="tp-label">Trabajo Práctico Obligatorio / Laboratorio:</span>
              <div className="tp-toggle-buttons">
                <button
                  type="button"
                  onClick={() => setTpApproved(true)}
                  className={`tp-toggle-btn ${tpApproved ? 'active' : ''}`}
                >
                  <CheckCircleIcon size={14} />
                  <span>Aprobado / Entregado</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTpApproved(false)}
                  className={`tp-toggle-btn ${!tpApproved ? 'active' : ''}`}
                >
                  <span>Pendiente / En Cursada</span>
                </button>
              </div>
            </div>

            {/* Configuración de corte universitario */}
            <div className="rules-customizer">
              <label className="rule-label">Exigencia de tu universidad / cátedra:</label>
              <select
                value={promoCutoff}
                onChange={(e) => setPromoCutoff(Number(e.target.value))}
                className="calc-select"
              >
                <option value={7}>Nota ≥ 7 en CADA parcial (Estándar UBA, UTN, UNC, UNLP)</option>
                <option value={8}>Nota ≥ 8 en CADA parcial (Cátedras de alta exigencia)</option>
                <option value={6}>Nota ≥ 6 en CADA parcial (Régimen promocional simple)</option>
              </select>
            </div>
          </div>

          {/* Results Column */}
          <div className="calc-results-col">
            <div className="result-main-card-pastel">
              <div className="result-header">
                <span className="result-subject-tag">📚 {subjectName || 'Tu Materia'}</span>
                <span className="result-badge-live">Diagnóstico Oficial</span>
              </div>

              {/* Status Outcome Banner */}
              {academicStage === 'failed_p1' && (
                <div className="promo-outcome-box danger animate-fade-in">
                  <div className="promo-outcome-header">
                    <span className="outcome-emoji">🔴</span>
                    <div>
                      <span className="outcome-title">1° Parcial Desaprobado ({grade1})</span>
                      <p className="outcome-desc">
                        En la facultad <strong>no se promedia</strong> con el segundo. Un 10 en el 2° Parcial no anula este aplazo. 
                        Debés rendir el <strong>Recuperatorio del 1° Parcial</strong> para regularizar la materia.
                      </p>
                    </div>
                  </div>
                  <div className="outcome-target-badge danger">
                    <span className="target-num font-mono">RECUP</span>
                    <span className="target-sub">1° Parcial</span>
                  </div>
                </div>
              )}

              {academicStage === 'regular_only' && (
                <div className="promo-outcome-box warning animate-fade-in">
                  <div className="promo-outcome-header">
                    <span className="outcome-emoji">📚</span>
                    <div>
                      <span className="outcome-title">Regularidad en Carrera • ¡NO PROMOCIONA!</span>
                      <p className="outcome-desc">
                        Aprobaste el 1° Parcial con <strong>{grade1}</strong>. Pero <strong>no hay promedio que compense</strong>: 
                        un <strong>{grade1} + 10 NO promociona</strong> en la facultad. 
                        Tu meta es sacar <strong>≥ {passCutoff}</strong> en el 2° Parcial para asegurar la regularidad y rendir <strong>Examen Final</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="outcome-target-badge warning">
                    <span className="target-num font-mono">≥ {passCutoff}</span>
                    <span className="target-sub">A Final</span>
                  </div>
                </div>
              )}

              {academicStage === 'promo_track' && (
                <div className="promo-outcome-box success animate-fade-in">
                  <div className="promo-outcome-header">
                    <span className="outcome-emoji">🚀</span>
                    <div>
                      <span className="outcome-title">¡En Carrera de Promoción Directa!</span>
                      <p className="outcome-desc">
                        Cumpliste con la nota mínima en el 1° Parcial (<strong>{grade1} ≥ {promoCutoff}</strong>). 
                        Para cerrar la materia sin rendir final, en el 2° Parcial <strong>debés sacar sí o sí ≥ {promoCutoff}</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="outcome-target-badge success">
                    <span className="target-num font-mono">≥ {promoCutoff}</span>
                    <span className="target-sub">En 2°P para Promo</span>
                  </div>
                </div>
              )}

              {/* Scenarios Table */}
              <div className="scenarios-list">
                <span className="scenarios-title">Qué pasa según lo que saques en el 2° Parcial:</span>

                {/* Scenario 1 */}
                <div className="scenario-item">
                  <div className="scenario-left">
                    <span className="scenario-chip green">2°P ≥ {promoCutoff}</span>
                    <span className="scenario-grade">
                      {academicStage === 'promo_track' ? '¡Promocionada! 🎉' : 'Regular (A Final) 📚'}
                    </span>
                  </div>
                  <span className="scenario-text">
                    {academicStage === 'promo_track'
                      ? 'Ambos parciales alcanzaron la nota mínima de promoción. ¡Materia aprobada sin examen final!'
                      : `Aprobaste el 2° parcial con nota alta, pero el ${grade1} del 1°P bloquea la promoción. Vas a mesa de final.`}
                  </span>
                </div>

                {/* Scenario 2 */}
                <div className="scenario-item">
                  <div className="scenario-left">
                    <span className="scenario-chip yellow">2°P entre {passCutoff} y {promoCutoff - 1}</span>
                    <span className="scenario-grade">Regular (A Final) 📚</span>
                  </div>
                  <span className="scenario-text">
                    {academicStage === 'promo_track'
                      ? `Aunque sacaste ${grade1} en el 1°P, no se promedian. Quedás regular y debés rendir la materia en examen final.`
                      : 'Ambos parciales aprobados. Regularizaste la cursada para presentarte en mesas de examen final.'}
                  </span>
                </div>

                {/* Scenario 3 */}
                <div className="scenario-item">
                  <div className="scenario-left">
                    <span className="scenario-chip peach">2°P &lt; {passCutoff}</span>
                    <span className="scenario-grade">A Recuperatorio 🔄</span>
                  </div>
                  <span className="scenario-text">
                    No promedia con el primer parcial. Debés rendir el Recuperatorio del 2° Parcial para no perder la cursada.
                  </span>
                </div>
              </div>

              {/* CTA save / open panel */}
              <div className="calc-save-card">
                <p className="save-card-text">
                  En <strong>TiempoFacu</strong> cargás tus notas una sola vez y la ficha de cada materia te indica tu estado real sin promedios falsos.
                </p>
                {isAuthenticated ? (
                  <button
                    onClick={() => (onNavigate ? onNavigate('dashboard') : onOpenAuth('dashboard'))}
                    className="btn-save-materia"
                  >
                    <span>Ver mis materias y notas en Mi Panel</span>
                    <ArrowRightIcon size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const el = document.getElementById('materias');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-save-materia"
                  >
                    <span>Ver mis materias y subir notas</span>
                    <ArrowRightIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Myth buster university matrix */}
        <div className="myth-buster-card">
          <div className="myth-header">
            <span className="myth-badge">
              <SparklesIcon size={14} /> CLARIDAD ACADÉMICA
            </span>
            <h3 className="myth-title">El Mito del Promedio Escolar vs. La Realidad Universitaria</h3>
            <p className="myth-desc">
              Muchos ingresantes asumen que la facultad funciona como el colegio secundario. Estos 4 ejemplos explican cómo se define tu cursada:
            </p>
          </div>

          <div className="myth-grid">
            <div className="myth-case-card myth-false">
              <div className="myth-case-top">
                <span className="myth-pill red">❌ MITO COMÚN</span>
                <span className="myth-grades font-mono">1°P: 4 | 2°P: 7</span>
              </div>
              <h4>"4 + 7 / 2 = 5.5, ¿promociono?"</h4>
              <p>
                <strong>Falso:</strong> Un 4 en cualquier parcial bloquea automáticamente la promoción directa. Tu condición es <strong>Regular</strong> y debés rendir examen final.
              </p>
            </div>

            <div className="myth-case-card myth-false">
              <div className="myth-case-top">
                <span className="myth-pill red">❌ MITO COMÚN</span>
                <span className="myth-grades font-mono">1°P: 4 | 2°P: 10</span>
              </div>
              <h4>"¡Me saqué 10! 4 + 10 = 14 / 2 = 7, ¡promociono!"</h4>
              <p>
                <strong>Falso:</strong> En la universidad no existe promedio compensatorio. Ambas notas deben ser <strong>≥ 7</strong>. Vas a examen final obligatorio.
              </p>
            </div>

            <div className="myth-case-card myth-true">
              <div className="myth-case-top">
                <span className="myth-pill green">✔ REGLA REAL</span>
                <span className="myth-grades font-mono">1°P: 7 | 2°P: 7</span>
              </div>
              <h4>"Saqué 7 en el primero y 7 en el segundo."</h4>
              <p>
                <strong>Verdadero:</strong> ¡Promoción Directa! Cumpliste la exigencia de <strong>más de 7 en cada instancia por separado</strong> y cerrás la materia sin final.
              </p>
            </div>

            <div className="myth-case-card myth-false">
              <div className="myth-case-top">
                <span className="myth-pill red">❌ MITO COMÚN</span>
                <span className="myth-grades font-mono">1°P: 9 | 2°P: 5</span>
              </div>
              <h4>"9 + 5 / 2 = 7, ¿alcanza la promoción?"</h4>
              <p>
                <strong>Falso:</strong> El 9 no compensa el 5 del segundo parcial. Como no sacaste ≥ 7 en ambos, tu condición es <strong>Regular (a mesa de examen final)</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
