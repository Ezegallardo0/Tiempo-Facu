export default function Stats() {
  const stats = [
    { value: '+52.000', label: 'Estudiantes activos', detail: 'Organizando sus cursadas hoy', color: 'lavender' },
    { value: '94.2%', label: 'Materias aprobadas', detail: 'Con recordatorios a tiempo', color: 'mint' },
    { value: '3.8 hs', label: 'Ahorro semanal', detail: 'Menos tiempo buscando fechas', color: 'yellow' },
    { value: '4.9 ★', label: 'Calificación promedio', detail: 'En más de 12.000 reseñas', color: 'peach' }
  ];

  const universities = [
    'UBA', 'UTN', 'UNLP', 'UNC', 'ITBA', 'UNR', 'UADE', 'UNSAM', 'UNLAM', 'PUC Chile', 'UNAM'
  ];

  return (
    <section className="stats-section">
      <div className="stats-pastel-container">
        <div className="stats-grid-pastel">
          {stats.map((s, i) => (
            <div key={i} className={`stat-card-pastel ${s.color}`}>
              <span className="stat-num font-mono">{s.value}</span>
              <span className="stat-label-text">{s.label}</span>
              <span className="stat-detail-sub">{s.detail}</span>
            </div>
          ))}
        </div>

        {/* University Badges */}
        <div className="universities-pastel-row">
          <span className="uni-headline-sub">Estudiantes de toda la comunidad universitaria:</span>
          <div className="uni-pills-wrap">
            {universities.map((uni, idx) => (
              <span key={idx} className="uni-pastel-chip">
                {uni}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
