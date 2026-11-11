import { GraduationCapIcon } from './Icons';

export default function Footer({ onOpenAuth }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer-pastel-container">
      <div className="footer-top-grid">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <div className="footer-brand-header">
            <div className="brand-icon-wrapper mini">
              <GraduationCapIcon size={18} className="brand-icon" />
            </div>
            <span className="brand-name">Tiempo<span className="brand-accent">Facu</span></span>
          </div>
          <p className="footer-brand-desc">
            El espacio pensado para ordenar horarios de cursada, fechas de parciales, entregas de trabajos prácticos y cálculo de notas de promoción.
          </p>
          <div className="footer-student-heart font-hand" style={{ fontSize: '1.2rem', color: '#5850ec' }}>
            Hecho por y para la comunidad universitaria ☕
          </div>
        </div>

        {/* Links Col 1: Herramientas del Organizador */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Organizador</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => scrollTo('materias')} className="footer-link-btn">Mis Materias & Notas</button></li>
            <li><button onClick={() => scrollTo('calendario')} className="footer-link-btn">Calendario de Exámenes</button></li>
            <li><button onClick={() => scrollTo('simulador')} className="footer-link-btn">Simulador de Promoción Real</button></li>
            <li><button onClick={() => scrollTo('horario')} className="footer-link-btn">Horario Semanal</button></li>
            <li><button onClick={() => scrollTo('tareas')} className="footer-link-btn">Tareas & Post-its</button></li>
          </ul>
        </div>

        {/* Links Col 2: Recursos Estudiantiles */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Recursos de Estudio</h4>
          <ul className="footer-links-list">
            <li><a href="#guia" onClick={(e) => { e.preventDefault(); alert('Próximamente: Guía de Técnicas de Estudio & Pomodoro'); }} className="footer-link-btn">Técnicas de Estudio</a></li>
            <li><a href="#plantillas" onClick={(e) => { e.preventDefault(); alert('Próximamente: Modelos de Resúmenes y Plantillas'); }} className="footer-link-btn">Modelos de Parciales</a></li>
            <li><a href="#calculadora" onClick={() => scrollTo('calculadora')} className="footer-link-btn">Simulador de Promoción</a></li>
            <li><a href="#comunidad" onClick={(e) => { e.preventDefault(); alert('Comunidad de Discord con +20.000 estudiantes'); }} className="footer-link-btn">Comunidad de Estudiantes</a></li>
          </ul>
        </div>

        {/* Links Col 3: Soporte */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Soporte & Legal</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => scrollTo('faq')} className="footer-link-btn">Preguntas Frecuentes</button></li>
            <li><a href="#soporte" onClick={(e) => { e.preventDefault(); onOpenAuth('soporte'); }} className="footer-link-btn">Contacto de Ayuda</a></li>
            <li><a href="#privacidad" onClick={(e) => { e.preventDefault(); alert('Tus datos académicos son 100% privados y nunca se comparten con terceros.'); }} className="footer-link-btn">Política de Privacidad</a></li>
            <li><a href="#terminos" onClick={(e) => { e.preventDefault(); alert('Términos de servicio de TiempoFacu'); }} className="footer-link-btn">Términos de Uso</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p className="copyright-text">
          © 2026 TiempoFacu. Hecho con ☕, mate y dedicación para que apruebes con una sonrisa.
        </p>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Plataforma operativa para el 2° Cuatrimestre</span>
        </div>
      </div>
    </footer>
  );
}
