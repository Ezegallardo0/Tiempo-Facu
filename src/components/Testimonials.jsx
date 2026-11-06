import { StarIcon } from './Icons';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Sofía Rodríguez',
      career: 'Ingeniería en Informática',
      university: 'UBA - Ingeniería',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      highlight: 'Promocioné 4 materias y me saqué la ansiedad',
      text: 'Antes tenía varios archivos de Excel que dejaba de actualizar a las dos semanas. Con TiempoFacu tengo los horarios con colores lindos y la calculadora de notas me sacó la incertidumbre de la cabeza.',
      color: 'lavender'
    },
    {
      name: 'Lucas Martínez',
      career: 'Medicina',
      university: 'UNC - Córdoba',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
      highlight: 'Vital para coordinar guardias y parciales',
      text: 'En Medicina el volumen de estudio es enorme. La vista de cuenta regresiva en días para los parciales y los temas clave me ayudaron a ordenar las semanas sin colapsar en época de exámenes.',
      color: 'mint'
    },
    {
      name: 'Camila Fernández',
      career: 'Abogacía',
      university: 'UNLP - La Plata',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
      highlight: 'La función de TPs en grupo es un alivio',
      text: 'Siempre me tocaba ser la que perseguía al resto para armar los trabajos grupales. En TiempoFacu asignamos partes con plazos intermedios y todos cumplieron a tiempo. Nos sacamos un 10.',
      color: 'peach'
    },
    {
      name: 'Mateo Benítez',
      career: 'Diseño Gráfico',
      university: 'FADU - Ciudad Universitaria',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
      highlight: 'Diseño estético y funciona sin wifi en el aula',
      text: 'Diseño tiene entregas gigantes todos los martes y jueves. El organizador visual con colores por materia y la app que funciona sin internet en el subsuelo de FADU es oro puro.',
      color: 'sky'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">HISTORIAS REALES</span>
        <h2 className="section-heading">Estudiantes que recuperaron el control de su carrera</h2>
        <p className="section-subheading">
          Miles de universitarios ya no sufren las semanas de parciales ni se olvidan entregas del campus.
        </p>
      </div>

      <div className="testimonials-grid-pastel">
        {reviews.map((rev, idx) => (
          <div key={idx} className={`testimonial-card-pastel ${rev.color}`}>
            <div className="review-stars-row">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={15} className="star-filled" />
              ))}
            </div>

            <h4 className="review-highlight font-hand" style={{ fontSize: '1.25rem' }}>"{rev.highlight}"</h4>
            <p className="review-body-text">{rev.text}</p>

            <div className="reviewer-author-row">
              <img src={rev.avatar} alt={rev.name} className="reviewer-avatar" />
              <div className="reviewer-data">
                <span className="reviewer-name">{rev.name}</span>
                <span className="reviewer-details">{rev.career} • {rev.university}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
