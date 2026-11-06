import { useState } from 'react';
import { ArrowRightIcon } from './Icons';

export default function PromoCalculator({ onOpenAuth }) {
  const [subjectName, setSubjectName] = useState('Análisis Matemático II');
  const [grade1, setGrade1] = useState(8);
  const [tpGrade, setTpGrade] = useState(9);
  const [promoMinAverage, setPromoMinAverage] = useState(7);
  const passMinGrade = 4;
  const [weighting, setWeighting] = useState('simple'); // 'simple' or 'tp-weighted'

  let neededForPromo = 0;
  let neededForRegular = 0;

  if (weighting === 'simple') {
    neededForPromo = Math.ceil(promoMinAverage * 2 - grade1);
    neededForRegular = Math.ceil(passMinGrade * 2 - grade1);
  } else {
    const currentAccum = (grade1 * 0.4) + (tpGrade * 0.2);
    neededForPromo = Math.ceil((promoMinAverage - currentAccum) / 0.4);
    neededForRegular = Math.ceil((passMinGrade - currentAccum) / 0.4);
  }

  // Bound between reasonable values
  if (neededForRegular < passMinGrade) neededForRegular = passMinGrade;
  if (neededForPromo < passMinGrade) neededForPromo = passMinGrade;

  const isPromoPossible = neededForPromo <= 10;

  return (
    <section id="calculadora" className="calculator-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">HERRAMIENTA ÚTIL</span>
        <h2 className="section-heading">¿Con cuánto promociono mi materia?</h2>
        <p className="section-subheading">
          Ingresá la nota de tu primer parcial y tus TPs para saber qué tenés que sacarte en el segundo parcial para no rendir final o no ir a recuperatorio.
        </p>
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

            <div className="calc-mode-selector">
              <span className="calc-label-sub">Régimen de evaluación:</span>
              <div className="regime-toggle-pills">
                <button
                  type="button"
                  onClick={() => setWeighting('simple')}
                  className={`pill-btn ${weighting === 'simple' ? 'active' : ''}`}
                >
                  Solo Parciales (50% / 50%)
                </button>
                <button
                  type="button"
                  onClick={() => setWeighting('tp-weighted')}
                  className={`pill-btn ${weighting === 'tp-weighted' ? 'active' : ''}`}
                >
                  Con TPs (40% / 40% / 20%)
                </button>
              </div>
            </div>

            {/* Slider 1: Primer Parcial */}
            <div className="slider-box-pastel">
              <div className="slider-header">
                <span className="slider-name">Nota 1° Parcial</span>
                <span className={`slider-value-badge ${grade1 >= 7 ? 'high' : grade1 >= 4 ? 'mid' : 'low'}`}>
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
              />
              <div className="slider-ticks">
                <span>1 (Insuficiente)</span>
                <span>4 (Aprobado)</span>
                <span>7 (Promoción)</span>
                <span>10</span>
              </div>
            </div>

            {/* Slider TP */}
            {weighting === 'tp-weighted' && (
              <div className="slider-box-pastel animate-fade-in">
                <div className="slider-header">
                  <span className="slider-name">Nota de Trabajos Prácticos / Lab</span>
                  <span className="slider-value-badge high">{tpGrade} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={tpGrade}
                  onChange={(e) => setTpGrade(Number(e.target.value))}
                  className="custom-range-slider"
                />
                <div className="slider-ticks">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            )}

            {/* Configuración de corte */}
            <div className="rules-customizer">
              <label className="rule-label">Regla de promoción de tu facultad:</label>
              <select
                value={promoMinAverage}
                onChange={(e) => setPromoMinAverage(Number(e.target.value))}
                className="calc-select"
              >
                <option value={7}>Promedio 7 o más (UBA, UTN, UNC, UNLP)</option>
                <option value={8}>Promedio 8 o más (Exigencia alta)</option>
                <option value={6}>Promedio 6 o más (Promoción simple)</option>
              </select>
            </div>
          </div>

          {/* Results Column */}
          <div className="calc-results-col">
            <div className="result-main-card-pastel">
              <div className="result-header">
                <span className="result-subject-tag">📚 {subjectName || 'Tu Materia'}</span>
                <span className="result-badge-live">Cálculo en vivo</span>
              </div>

              {/* Status Outcome Banner */}
              {isPromoPossible ? (
                <div className="promo-outcome-box success">
                  <div className="promo-outcome-header">
                    <span className="outcome-emoji">🎉</span>
                    <div>
                      <span className="outcome-title">¡Podés promocionar directo!</span>
                      <p className="outcome-desc">
                        Sacando un <strong>{neededForPromo} o más</strong> en el 2° Parcial, cerrás la materia sin necesidad de rendir examen final.
                      </p>
                    </div>
                  </div>
                  <div className="outcome-target-badge">
                    <span className="target-num font-mono">{neededForPromo}</span>
                    <span className="target-sub">Meta para Promo</span>
                  </div>
                </div>
              ) : (
                <div className="promo-outcome-box warning">
                  <div className="promo-outcome-header">
                    <span className="outcome-emoji">📚</span>
                    <div>
                      <span className="outcome-title">Apuntale al final regular</span>
                      <p className="outcome-desc">
                        Para promocionar necesitarías más de 10, pero con un <strong>{neededForRegular}</strong> aprobás la cursada y vas tranquilo a final.
                      </p>
                    </div>
                  </div>
                  <div className="outcome-target-badge warning">
                    <span className="target-num font-mono">{neededForRegular}</span>
                    <span className="target-sub">Meta para Final</span>
                  </div>
                </div>
              )}

              {/* Scenarios Table */}
              <div className="scenarios-list">
                <span className="scenarios-title">Posibles notas para el 2° Parcial:</span>

                <div className="scenario-item">
                  <div className="scenario-left">
                    <span className="scenario-chip green">Promoción</span>
                    <span className="scenario-grade">
                      Nota <strong>{isPromoPossible ? `≥ ${neededForPromo}` : 'No disponible'}</strong>
                    </span>
                  </div>
                  <span className="scenario-text">Aprobás la materia de forma directa 🏖️</span>
                </div>

                <div className="scenario-item">
                  <div className="scenario-left">
                    <span className="scenario-chip yellow">Regular</span>
                    <span className="scenario-grade">Nota <strong>≥ {neededForRegular}</strong></span>
                  </div>
                  <span className="scenario-text">Aprobás la cursada y rendís mesa de final 📖</span>
                </div>

                <div className="scenario-item">
                  <div className="scenario-left">
                    <span className="scenario-chip peach">Recuperatorio</span>
                    <span className="scenario-grade">Nota <strong>&lt; {passMinGrade}</strong></span>
                  </div>
                  <span className="scenario-text">Vas a fecha complementaria o recuperatorio 🔄</span>
                </div>
              </div>

              {/* CTA save card */}
              <div className="calc-save-card">
                <p className="save-card-text">
                  En <strong>TiempoFacu</strong> guardás tus materias una sola vez y la app te avisa cuánto te falta para cada parcial.
                </p>
                <button onClick={() => onOpenAuth('register')} className="btn-save-materia">
                  <span>Guardar mis materias en TiempoFacu</span>
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
