import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';
import { SunIcon, MoonIcon, SaveIcon } from '../components/ui/Icons2';
import { LogOutIcon } from '../components/Icons';

export default function ConfiguracionPage({ onNavigate }) {
  const { user, logout, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.university || '',
    career: user?.career || '',
    semester: user?.semester || '',
  });
  const [_pwForm, _setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [_pwError, _setPwError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    updateUserProfile(form);
    toast('Perfil actualizado ✓');
  };

  const handleLogout = () => { logout(); onNavigate('landing'); };

  return (
    <div className="page-config">
      <div className="config-layout">
        {/* Profile section */}
        <div className="config-card">
          <h2 className="config-section-title">👤 Perfil de estudiante</h2>

          {/* Avatar */}
          <div className="config-avatar-row">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}`}
              alt={user?.name}
              className="config-avatar"
            />
            <div>
              <p className="config-avatar-name">{user?.name}</p>
              <p className="config-avatar-email">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="form-v2">
            <div className="form-row-2">
              <label className="form-field"><span>Nombre completo</span><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tu nombre" /></label>
              <label className="form-field"><span>Correo electrónico</span><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@email.com" /></label>
            </div>
            <label className="form-field"><span>Universidad</span><input value={form.university} onChange={e => set('university', e.target.value)} placeholder="UBA, UTN, UNLP..." /></label>
            <div className="form-row-2">
              <label className="form-field"><span>Carrera</span><input value={form.career} onChange={e => set('career', e.target.value)} placeholder="Ingeniería en Informática..." /></label>
              <label className="form-field"><span>Cuatrimestre / Año</span><input value={form.semester} onChange={e => set('semester', e.target.value)} placeholder="2° Cuatrimestre 2026" /></label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary"><SaveIcon size={16} /> Guardar cambios</button>
            </div>
          </form>
        </div>

        {/* Appearance */}
        <div className="config-card">
          <h2 className="config-section-title">🎨 Apariencia</h2>
          <div className="config-theme-row">
            <div>
              <p className="config-option-label">Tema de la interfaz</p>
              <p className="config-option-desc">Elegí el modo que más te guste para estudiar.</p>
            </div>
            <button className={`theme-toggle-btn ${theme === 'dark' ? 'dark' : 'light'}`} onClick={toggleTheme}>
              {theme === 'dark' ? <><SunIcon size={18} /> Modo claro</> : <><MoonIcon size={18} /> Modo oscuro</>}
            </button>
          </div>
        </div>

        {/* Academic settings */}
        <div className="config-card">
          <h2 className="config-section-title">📐 Configuración académica</h2>
          <div className="config-info-box">
            <p className="config-rule-title">⚠️ Regla de notas universitaria (Argentina)</p>
            <p className="config-rule-desc">
              Las notas <strong>NO se promedian</strong>. Para <strong>Promocionar</strong> (sin final) necesitás ≥7 en <em>cada</em> parcial por separado. 
              Para <strong>Regularizar</strong> (ir a final) necesitás ≥4 en cada parcial. Un 10 en un parcial <strong>no compensa</strong> un 3 en otro.
            </p>
          </div>
        </div>

        {/* Account */}
        <div className="config-card">
          <h2 className="config-section-title">🔐 Cuenta</h2>
          <div className="config-info-box info">
            <p>Los datos se guardan localmente en tu dispositivo con <code>localStorage</code>. No hay conexión a un servidor externo.</p>
          </div>
          <div className="config-danger-zone">
            <p className="config-danger-title">Zona de peligro</p>
            <button className="btn-danger" onClick={handleLogout}>
              <LogOutIcon size={16} /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
