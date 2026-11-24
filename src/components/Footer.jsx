import { GraduationCapIcon } from './Icons';

export default function Footer({ onOpenAuth, onNavigate }) {
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
          <div className="footer-student-heart font-hand" style={{ fontSize: '1.2rem' }}>
            Hecho por y para la comunidad universitaria ☕
          </div>
        </div>

        {/* Links Col 1: Herramientas del Organizador */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Organizador</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => onOpenAuth('register')} className="footer-link-btn">Mis Materias & Notas</button></li>
            <li><button onClick={() => onOpenAuth('register')} className="footer-link-btn">Calendario de Exámenes</button></li>
            <li><button onClick={() => scrollTo('simulador')} className="footer-link-btn">Simulador de Promoción Real</button></li>
            <li><button onClick={() => onOpenAuth('register')} className="footer-link-btn">Horario Semanal</button></li>
            <li><button onClick={() => onOpenAuth('register')} className="footer-link-btn">Tareas & Post-its</button></li>
          </ul>
        </div>

        {/* Links Col 2: Recursos Estudiantiles */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Recursos de Estudio</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => onNavigate('register')} className="footer-link-btn">Temporizador Pomodoro</button></li>
            <li><button onClick={() => onNavigate('register')} className="footer-link-btn">Apuntes por materia</button></li>
            <li><button onClick={() => scrollTo('simulador')} className="footer-link-btn">Simulador de Promoción</button></li>
          </ul>
        </div>

        {/* Links Col 3: Soporte */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Soporte & Legal</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => scrollTo('faq')} className="footer-link-btn">Preguntas Frecuentes</button></li>
            <li><button onClick={() => scrollTo('faq')} className="footer-link-btn">Centro de ayuda</button></li>
            <li><button onClick={() => scrollTo('faq')} className="footer-link-btn">Privacidad y datos</button></li>
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
