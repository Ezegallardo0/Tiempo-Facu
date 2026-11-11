import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { GraduationCapIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, SparklesIcon } from '../components/Icons';

export default function RegisterPage({ onNavigate }) {
  const { register, loginAsDemo } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: 'UBA (Universidad de Buenos Aires)',
    career: '',
    semester: '2do Cuatrimestre 2026',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage('Por favor completá los campos obligatorios.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Verificalas.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Por favor aceptá los compromisos de estudio.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register({
        name: formData.name,
        email: formData.email,
        university: formData.university,
        career: formData.career,
        semester: formData.semester,
        password: formData.password
      });

      setIsLoading(false);
      if (res.success) {
        onNavigate('dashboard');
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  return (
    <div className="auth-page-container">
      {/* Decorative Pastel Background Blobs */}
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>

      <div className="auth-page-card register-wide animate-scale-up">
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

          <h2 className="auth-title">Creá tu Cuenta Estudiantil</h2>
          <p className="auth-subtitle">
            100% gratis • Organizá tus comisiones, exámenes y tareas sin publicidad molesta.
          </p>
        </div>

        {/* Demo Fast Access Pill */}
        <div className="demo-access-banner">
          <div className="demo-access-info">
            <span className="demo-emoji">⚡</span>
            <div>
              <strong>¿Solo estás mirando cómo funciona el panel?</strong>
              <p>Podés saltearte el formulario y explorar con un solo clic.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              loginAsDemo();
              onNavigate('dashboard');
            }}
            className="btn-demo-fast"
          >
            <SparklesIcon size={15} />
            <span>Ver Panel Demo</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="auth-error-banner animate-fade-in">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">
              Nombre y Apellido *
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              required
              autoFocus
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Sofía Rodríguez"
              className="form-input-pastel"
            />
          </div>

          <div className="form-row-dual">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-uni">
                Universidad o Terciario
              </label>
              <select
                id="reg-uni"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="form-input-pastel"
              >
                <option value="UBA (Universidad de Buenos Aires)">UBA (Buenos Aires)</option>
                <option value="UTN (Universidad Tecnológica Nacional)">UTN (Nacional)</option>
                <option value="UNC (Universidad Nacional de Córdoba)">UNC (Córdoba)</option>
                <option value="UNLP (Universidad Nacional de La Plata)">UNLP (La Plata)</option>
                <option value="UNR (Universidad Nacional de Rosario)">UNR (Rosario)</option>
                <option value="ITBA (Instituto Tecnológico)">ITBA</option>
                <option value="UADE (Universidad Argentina de la Empresa)">UADE</option>
                <option value="UNSAM (San Martín)">UNSAM</option>
                <option value="UNLAM (La Matanza)">UNLAM</option>
                <option value="UNCUYO (Cuyo)">UNCUYO</option>
                <option value="PUC (Chile)">PUC (Chile)</option>
                <option value="UNAM (México)">UNAM (México)</option>
                <option value="Otra Universidad / Instituto">Otra institución</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-career">
                Carrera / Especialidad
              </label>
              <input
                id="reg-career"
                name="career"
                type="text"
                value={formData.career}
                onChange={handleChange}
                placeholder="Ej. Abogacía, Medicina, Sistemas..."
                className="form-input-pastel"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Correo Electrónico (Facultad o Personal) *
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="sofia@facu.edu.ar o personal"
              className="form-input-pastel"
            />
          </div>

          <div className="form-row-dual">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-pass">
                Contraseña (mínimo 6 caracteres) *
              </label>
              <div className="input-password-wrapper">
                <input
                  id="reg-pass"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Creá una clave segura"
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

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">
                Repetir Contraseña *
              </label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repetí tu contraseña"
                className="form-input-pastel"
              />
            </div>
          </div>

          <div className="form-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>Prometo no dejar las entregas de TP para las 23:58 hs del campus ☕</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-auth-submit primary"
          >
            <span>{isLoading ? 'Creando tu espacio...' : 'Crear mi Cuenta Gratis'}</span>
            <ArrowRightIcon size={16} />
          </button>
        </form>

        {/* Footer links */}
        <div className="auth-card-footer">
          <p className="auth-switch-text">
            ¿Ya tenés una cuenta registrada?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="link-highlight"
            >
              Iniciá sesión acá
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
