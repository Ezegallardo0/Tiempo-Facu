import { ClockIcon, AlertTriangleIcon, CalculatorIcon, BookOpenIcon, UsersIcon, ShieldCheckIcon } from './Icons';

export default function Features() {
  const featuresList = [
    {
      icon: <ClockIcon size={22} />,
      colorClass: 'lavender',
      tag: 'INSCRIPCIÓN SIN SORPRESAS',
      title: 'Detector de solapamientos de comisiones',
      description: 'Armá tu horario antes de inscribirte. La app te avisa si dos materias se pisan en horario o si no te da el tiempo de viaje entre sedes universitarias.'
    },
    {
      icon: <AlertTriangleIcon size={22} />,
      colorClass: 'peach',
      tag: 'CERO ENTREGAS PERDIDAS',
      title: 'Alertas que te salvan a tiempo',
      description: 'Recordatorios progresivos antes de que cierre el campus virtual (Moodle, Blackboard, SIU Guaraní). Nunca más te vas a enterar a las 23:57 de una entrega.'
    },
    {
      icon: <CalculatorIcon size={22} />,
      colorClass: 'mint',
      tag: 'MENOS CUENTAS, MÁS CERTEZA',
      title: 'Calculadora de promoción directa',
      description: 'Olvidate de hacer reglas de tres compuestas. El sistema pondera tus parciales y TPs para decirte exactamente qué nota necesitás para no ir a examen final.'
    },
    {
      icon: <BookOpenIcon size={22} />,
      colorClass: 'sky',
      tag: 'TU CARRERA CLARA',
      title: 'Mapa de materias correlativas',
      description: 'Mirá qué materias se te destraban al aprobar cada final. Planificá con anticipación cuántas materias cursar el próximo cuatrimestre sin sorpresas.'
    },
    {
      icon: <UsersIcon size={22} />,
      colorClass: 'yellow',
      tag: 'TRABAJOS EN EQUIPO',
      title: 'Coordinador de TPs grupales',
      description: 'Repartí partes del informe con tus compañeros, asigná plazos intermedios y chequeá el estado de entrega sin mandar 40 audios en el grupo de WhatsApp.'
    },
    {
      icon: <ShieldCheckIcon size={22} />,
      colorClass: 'lavender',
      tag: 'PARA EL DÍA A DÍA',
      title: 'Funciona 100% sin internet',
      description: '¿No tenés datos ni wifi en el subsuelo o aula magna de la facultad? TiempoFacu abre siempre. Podés ver tus horarios y anotar tareas sin conexión.'
    }
  ];

  return (
    <section id="caracteristicas" className="features-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">PENSADO PARA ESTUDIANTES REALES</span>
        <h2 className="section-heading">Todo lo que necesitás para tener la mente en paz</h2>
        <p className="section-subheading">
          Las herramientas genéricas como Excel o Notion requieren horas para configurarse. TiempoFacu ya viene listo con las reglas y la rutina de la facultad.
        </p>
      </div>

      <div className="features-pastel-grid">
        {featuresList.map((f, idx) => (
          <div key={idx} className={`feature-pastel-card ${f.colorClass}`}>
            <div className="feature-card-top">
              <div className="feature-icon-pastel">
                {f.icon}
              </div>
              <span className="feature-tag-pill">{f.tag}</span>
            </div>
            <h3 className="feature-title-text">{f.title}</h3>
            <p className="feature-desc-text">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
