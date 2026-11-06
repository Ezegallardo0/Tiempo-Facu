import { useState } from 'react';
import { GraduationCapIcon, CheckCircleIcon } from './Icons';

export default function AuthModal({ isOpen, mode = 'register', onClose }) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: 'UBA',
    career: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={resetAndClose}>
      <div className="modal-card-pastel animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close-btn" onClick={resetAndClose} aria-label="Cerrar modal">
          ✕
        </button>

        {isSuccess ? (
          <div className="modal-success-state">
            <div className="success-icon-bubble-pastel">
              <CheckCircleIcon size={36} className="text-mint" />
            </div>
            <h3 className="success-title">¡Bienvenido a TiempoFacu! 🎓</h3>
            <p className="success-desc">
              Hola <strong>{formData.name || 'Estudiante'}</strong>. Tu organizador para <strong>{formData.university || 'tu facultad'}</strong> ya está preparado.
            </p>

            <div className="success-checklist-pastel">
              <div className="success-check-item">
                <span className="check-bullet">✓</span> Horario semanal listo para tus comisiones
              </div>
              <div className="success-check-item">
                <span className="check-bullet">✓</span> Recordatorios de parciales activados
              </div>
              <div className="success-check-item">
                <span className="check-bullet">✓</span> Calculadora de notas guardada en tu perfil
              </div>
            </div>

            <button onClick={resetAndClose} className="btn-modal-primary-pastel">
              Ir a mi Organizador
            </button>
          </div>
        ) : (
          <div>
            <div className="modal-header">
              <div className="brand-icon-wrapper mini">
                <GraduationCapIcon size={18} className="brand-icon" />
              </div>
              <h3 className="modal-title">
                {currentMode === 'login' ? 'Iniciar Sesión' : 'Creá tu Cuenta Estudiantil'}
              </h3>
              <p className="modal-subtitle">
                {currentMode === 'login'
                  ? 'Entrá para ver tus materias y notas guardadas'
                  : '100% Gratis • Sin tarjeta de crédito requerida'}
              </p>
            </div>

            <div className="modal-mode-tabs-pastel">
              <button
                type="button"
                className={`modal-tab-pill ${currentMode === 'register' ? 'active' : ''}`}
                onClick={() => setCurrentMode('register')}
              >
                Crear Cuenta
              </button>
              <button
                type="button"
                className={`modal-tab-pill ${currentMode === 'login' ? 'active' : ''}`}
                onClick={() => setCurrentMode('login')}
              >
                Ya tengo cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {currentMode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Nombre y Apellido</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Rodríguez"
                    className="form-input-pastel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Correo Electrónico (Facultad o Personal)</label>
                <input
                  type="email"
                  required
                  placeholder="estudiante@facu.edu.ar o personal"
                  className="form-input-pastel"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="form-input-pastel"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {currentMode === 'register' && (
                <div className="form-row-dual">
                  <div className="form-group">
                    <label className="form-label">Universidad</label>
                    <select
                      className="form-input-pastel"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    >
                      <option value="UBA">UBA</option>
                      <option value="UTN">UTN</option>
                      <option value="UNLP">UNLP</option>
                      <option value="UNC">UNC</option>
                      <option value="ITBA">ITBA</option>
                      <option value="UNR">UNR</option>
                      <option value="UADE">UADE</option>
                      <option value="Otra">Otra facultad o terciario</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Carrera (opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Medicina, Psicología..."
                      className="form-input-pastel"
                      value={formData.career}
                      onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn-modal-primary-pastel">
                <span>{currentMode === 'login' ? 'Entrar a mi Cuenta' : 'Empezar Gratis'}</span>
              </button>

              <div className="modal-divider-pastel">
                <span>o ingresar con</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData({ name: 'Estudiante Google', university: 'UBA' });
                  setIsSuccess(true);
                }}
                className="btn-google-pastel"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continuar con Google</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
