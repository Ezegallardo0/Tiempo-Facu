import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { GraduationCapIcon, LockIcon, EyeIcon, EyeOffIcon, SparklesIcon } from '../components/Icons';

export default function LoginPage({ onNavigate }) {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Por favor completá tu correo y contraseña.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        onNavigate('dashboard');
      } else {
        setErrorMessage(res.message);
      }
    }, 350);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemo();
      setIsLoading(false);
      onNavigate('dashboard');
    }, 250);
  };

  return (
    <div className="auth-page-container">
      {/* Decorative Pastel Background Blobs */}
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>

      <div className="auth-page-card animate-scale-up">
        {/* Top brand header */}
        <div className="auth-card-header">
          <a
            href="#landing"
            onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}
            className="auth-brand-badge"
          >
            <div className="brand-icon-wrapper mini">
              <GraduationCapIcon size={18} className="brand-icon" />
            </div>
            <span className="brand-name">Tiempo<span className="brand-accent">Facu</span></span>
          </a>

          <h2 className="auth-title">Iniciar Sesión</h2>
          <p className="auth-subtitle">
            Ingresá a tu espacio de estudio, horarios de cursada y notas guardadas.
          </p>
        </div>

        {/* Demo Fast Access Pill */}
        <div className="demo-access-banner">
          <div className="demo-access-info">
            <span className="demo-emoji">💡</span>
            <div>
              <strong>¿Querés probar el contenido protegido sin registrarte?</strong>
              <p>Entrá directo con nuestra cuenta de estudiante de muestra.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="btn-demo-fast"
          >
            <SparklesIcon size={15} />
            <span>Entrar con Demo</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="auth-error-banner animate-fade-in">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Correo Electrónico (Facultad o Personal)
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="estudiante@facu.edu.ar o personal"
              className="form-input-pastel"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="login-password">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => alert('Para la cuenta demo la clave es: password123')}
                className="btn-forgot-password"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="input-password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                className="form-input-pastel with-icon-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn-toggle-eye"
                aria-label="Mostrar u ocultar contraseña"
              >
                {showPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
              </button>
            </div>
          </div>

          <div className="form-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Recordar mi sesión en este navegador</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-auth-submit primary"
          >
            <LockIcon size={16} />
            <span>{isLoading ? 'Verificando datos...' : 'Ingresar a mi Organizador'}</span>
          </button>
        </form>

        {/* Footer links */}
        <div className="auth-card-footer">
          <p className="auth-switch-text">
            ¿Todavía no tenés cuenta?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="link-highlight"
            >
              Registrate gratis acá
            </button>
          </p>

          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="btn-return-home"
          >
            ← Volver a la página principal
          </button>
        </div>
      </div>
    </div>
  );
}
