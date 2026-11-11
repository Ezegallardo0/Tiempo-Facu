import { useAuth } from '../context/useAuth';
import { ArrowRightIcon, CalendarIcon, CheckCircleIcon, StarIcon, SettingsIcon } from './Icons';

export default function Hero({ onOpenAuth, onNavigate }) {
  const { user, isAuthenticated } = useAuth();

  const scrollToPreview = () => {
    const el = document.getElementById('preview');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      {/* Decorative Pastel Sticky Notes (gives personal, human touch) */}
      <div className="hero-sticky-note note-left animate-float">
        <span className="sticky-pin">📌</span>
        <p className="sticky-text font-hand">
          {isAuthenticated && user ? `¡Vamos con el cuatri, ${user.name.split(' ')[0]}! ☕` : '¡Aprobé el 1° parcial con 9! Ahora a meterle al TP ☕'}
        </p>
        <span className="sticky-tag">
          {isAuthenticated && user ? user.university.split(' ')[0] : 'Análisis Matemático'}
        </span>
      </div>

      <div className="hero-sticky-note note-right animate-float" style={{ animationDelay: '1.5s' }}>
        <span className="sticky-pin">✏️</span>
        <p className="sticky-text font-hand">
          {isAuthenticated && user ? 'Parciales y notas organizadas ✔' : 'Martes 14hs: Entrega informe en Lab 4 ✔'}
        </p>
        <span className="sticky-tag mint">
          {isAuthenticated && user ? user.semester : 'Comisión 02'}
        </span>
      </div>

      <div className="hero-content">
        {/* Release Pill Badge */}
        <div className="hero-badge">
          <span className="badge-emoji">{isAuthenticated && user ? '🎓' : '🎒'}</span>
          <span className="badge-text">
            {isAuthenticated && user
              ? `SESIÓN ACTIVA • ALUMNO REGULAR EN ${user.university.toUpperCase()}`
              : 'El organizador pensado por y para estudiantes universitarios'}
          </span>
        </div>

        {/* Main Headline */}
        {isAuthenticated && user ? (
          <h1 className="hero-title">
            ¡Hola de nuevo, {user.name.split(' ')[0]}! <br />
            <span className="highlighter-mint">Tu cursada al día y bajo control.</span>
          </h1>
        ) : (
          <h1 className="hero-title">
            Tu facultad en orden, <br />
            <span className="highlighter-yellow">tu mente en paz.</span>
          </h1>
        )}

        {/* Subtitle */}
        {isAuthenticated && user ? (
          <p className="hero-description">
            Tenés todo listo en tu perfil de <strong>TiempoFacu</strong>. 
            Revisá tus horarios de <strong>{user.career || 'tu carrera'}</strong>, tus parciales cargados en el calendario y la condición de cada materia sin promedios engañosos.
          </p>
        ) : (
          <p className="hero-description">
            Dejá de tener fechas desparramadas en 5 grupos de WhatsApp, excels que nunca abrís y el campus virtual que se cuelga. 
            <strong> TiempoFacu</strong> reúne tus horarios de cursada, fechas de parciales, entregas de TPs y el cálculo exacto de notas en un espacio limpio, cálido y sin estrés.
          </p>
        )}

        {/* CTA Buttons */}
        {isAuthenticated && user ? (
          <div className="hero-cta-group">
            <button onClick={() => onNavigate('dashboard')} className="btn-hero-primary group">
              <span>📅 Abrir Mi Panel de Cursada</span>
              <ArrowRightIcon size={18} className="btn-icon-shift" />
            </button>
            <button onClick={() => onNavigate('calendar')} className="btn-hero-secondary">
              <CalendarIcon size={18} />
              <span>🗓️ Calendario de Exámenes</span>
            </button>
            <button onClick={() => onNavigate('settings')} className="btn-hero-settings-pill" title="Configuración de Estudiante">
              <SettingsIcon size={16} />
              <span>Ajustes</span>
            </button>
          </div>
        ) : (
          <div className="hero-cta-group">
            <button onClick={() => onOpenAuth('register')} className="btn-hero-primary group">
              <span>Comenzar gratis (sin tarjeta)</span>
              <ArrowRightIcon size={18} className="btn-icon-shift" />
            </button>
            <button onClick={scrollToPreview} className="btn-hero-secondary">
              <CalendarIcon size={18} />
              <span>Ver cómo se ve mi horario</span>
            </button>
          </div>
        )}

        {/* Value pills / Micro-assurances */}
        {isAuthenticated && user ? (
          <div className="hero-assurances">
            <span className="assurance-item">
              <CheckCircleIcon size={16} className="text-mint" /> Alumno regular verificado
            </span>
            <span className="assurance-divider">•</span>
            <span className="assurance-item">
              <CheckCircleIcon size={16} className="text-mint" /> Guardado local en tu dispositivo
            </span>
            <span className="assurance-divider">•</span>
            <span className="assurance-item">
              <CheckCircleIcon size={16} className="text-mint" /> {user.semester}
            </span>
          </div>
        ) : (
          <div className="hero-assurances">
            <span className="assurance-item">
              <CheckCircleIcon size={16} className="text-mint" /> 100% Gratis para ingresar
            </span>
            <span className="assurance-divider">•</span>
            <span className="assurance-item">
              <CheckCircleIcon size={16} className="text-mint" /> Funciona en aulas sin wifi
            </span>
            <span className="assurance-divider">•</span>
            <span className="assurance-item">
              <CheckCircleIcon size={16} className="text-mint" /> Compatible con cualquier facultad
            </span>
          </div>
        )}

        {/* Social Proof Strip (shows community) */}
        <div className="hero-social-proof">
          <div className="avatar-stack">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="Estudiante" className="avatar-img" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="Estudiante" className="avatar-img" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" alt="Estudiante" className="avatar-img" />
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" alt="Estudiante" className="avatar-img" />
            <div className="avatar-more">+50k</div>
          </div>
          <div className="proof-text-container">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={15} className="star-filled" />
              ))}
              <span className="stars-score">4.9 / 5</span>
            </div>
            <p className="proof-subtext">
              Elegido por <strong>más de 50.000 estudiantes</strong> de UBA, UTN, UNC, UNLP, ITBA, UNR, UADE y más.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
