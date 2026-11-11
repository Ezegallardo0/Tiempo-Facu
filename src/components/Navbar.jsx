import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { GraduationCapIcon, LogOutIcon, SettingsIcon } from './Icons';

export default function Navbar({ onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <a
          href="#landing"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="brand-icon-wrapper">
            <GraduationCapIcon size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Tiempo<span className="brand-accent">Facu</span></span>
            <span className="brand-tag">ORGANIZADOR UNIVERSITARIO</span>
          </div>
        </a>

        {/* Desktop Navigation Links (Spaced out, clean) */}
        <nav className="desktop-nav">
          <button onClick={() => scrollToSection('hoy')} className="nav-item-btn">
            Hoy
          </button>
          <button onClick={() => scrollToSection('materias')} className="nav-item-btn">
            Mis Materias & Notas
          </button>
          <button onClick={() => scrollToSection('calendario')} className="nav-item-btn">
            Calendario Exámenes
          </button>
          <button onClick={() => scrollToSection('simulador')} className="nav-item-btn">
            Simulador Promo
          </button>
          <button onClick={() => scrollToSection('horario')} className="nav-item-btn">
            Horario Semanal
          </button>
          <button onClick={() => scrollToSection('tareas')} className="nav-item-btn">
            Tareas & Post-its
          </button>
        </nav>

        {/* Right Actions: STRICTLY CONDITIONAL ON AUTH STATE */}
        <div className="nav-actions">
          {isAuthenticated && user ? (
            /* LOGGED IN VIEW: NO REGISTER BUTTONS */
            <div className="logged-in-user-chip">
              <button
                onClick={() => onNavigate('dashboard')}
                className="user-profile-btn"
                title="Ir a mi panel privado"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop'}
                  alt={user.name}
                  className="user-avatar-mini"
                />
                <span className="user-name-display">{user.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-my-dashboard"
                title="Abrir mi panel de cursada"
              >
                Mi Panel
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="btn-nav-settings"
                title="Configuración de cuenta y cursada"
              >
                <SettingsIcon size={15} />
                <span className="btn-nav-settings-text">Ajustes</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  onNavigate('landing');
                }}
                className="btn-logout-mini"
                title="Cerrar sesión"
              >
                <LogOutIcon size={16} />
              </button>
            </div>
          ) : (
            /* LOGGED OUT VIEW: Show login & register */
            <div className="guest-nav-actions">
              <button
                onClick={() => onNavigate('login')}
                className="btn-secondary-nav"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="btn-primary-nav"
              >
                <span>Registrarse Gratis</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open-1' : ''}`}></span>
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open-2' : ''}`}></span>
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open-3' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          {/* ONLY show Mi Panel when logged in */}
          {isAuthenticated && user && (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="mobile-nav-item highlight-user-panel"
              >
                📅 Mi Panel de Cursada
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('settings');
                }}
                className="mobile-nav-item"
              >
                ⚙️ Configuración del Estudiante
              </button>
            </>
          )}

          <button onClick={() => scrollToSection('hoy')} className="mobile-nav-item">
            ⏰ Clases de Hoy
          </button>
          <button onClick={() => scrollToSection('materias')} className="mobile-nav-item">
            📚 Mis Materias & Notas
          </button>
          <button onClick={() => scrollToSection('calendario')} className="mobile-nav-item">
            🗓️ Calendario de Exámenes
          </button>
          <button onClick={() => scrollToSection('simulador')} className="mobile-nav-item">
            🎓 Simulador de Promoción
          </button>
          <button onClick={() => scrollToSection('horario')} className="mobile-nav-item">
            📅 Horario Semanal
          </button>
          <button onClick={() => scrollToSection('tareas')} className="mobile-nav-item">
            📝 Tareas & Post-its
          </button>

          <div className="mobile-drawer-footer">
            {isAuthenticated && user ? (
              /* LOGGED IN: NO REGISTER BUTTONS */
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  onNavigate('landing');
                }}
                className="btn-secondary-full"
              >
                Cerrar Sesión ({user.name.split(' ')[0]})
              </button>
            ) : (
              /* LOGGED OUT */
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="btn-secondary-full"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('register');
                  }}
                  className="btn-primary-full"
                >
                  Registrarse Gratis
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
