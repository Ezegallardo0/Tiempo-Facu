import { useState, useEffect } from 'react';
import { AuthContext } from './auth-context-base';

const DEMO_USER = {
  id: 'usr_demo_101',
  name: 'Martín Gómez',
  email: 'demo@estudiante.edu',
  university: 'UBA (Universidad de Buenos Aires)',
  career: 'Ingeniería en Informática',
  semester: '2do Cuatrimestre 2026',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
  createdAt: '2026-08-15'
};

const INITIAL_USERS = [
  {
    ...DEMO_USER,
    password: 'password123'
  }
];

export function AuthProvider({ children }) {
  const [rememberSession, setRememberSession] = useState(() => {
    try {
      return Boolean(localStorage.getItem('tiempofacu_current_user'));
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tiempofacu_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('tiempofacu_registered_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Save users when registeredUsers change
  useEffect(() => {
    try {
      localStorage.setItem('tiempofacu_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Error saving users to storage', e);
    }
  }, [registeredUsers]);

  // Save current user session
  useEffect(() => {
    try {
      if (user && rememberSession) {
        localStorage.setItem('tiempofacu_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('tiempofacu_current_user');
      }
    } catch (e) {
      console.error('Error saving current session', e);
    }
  }, [user, rememberSession]);

  const login = (email, password, remember = true) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Match registered users exactly; the demo password is handled separately.
    const found = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    );

    if (found) {
      const { password: _, ...safeUser } = found;
      setRememberSession(remember);
      setUser(safeUser);
      return { success: true };
    }

    // If it's the demo account
    if (cleanEmail === 'demo@estudiante.edu' && (cleanPass === 'password123' || cleanPass === 'demo')) {
      setRememberSession(remember);
      setUser(DEMO_USER);
      return { success: true };
    }

    return {
      success: false,
      message: 'Correo electrónico o contraseña incorrectos. Podés usar la cuenta de prueba.'
    };
  };

  const loginAsDemo = (remember = true) => {
    setRememberSession(remember);
    setUser(DEMO_USER);
    return { success: true };
  };

  const register = (data) => {
    const cleanEmail = data.email.trim().toLowerCase();

    // Check if already registered
    const exists = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return {
        success: false,
        message: 'Este correo electrónico ya está registrado. Probá iniciar sesión.'
      };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      university: data.university || 'Universidad Nacional',
      career: data.career?.trim() || 'Estudiante Universitario',
      semester: data.semester || '2do Cuatrimestre 2026',
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=e0e7ff,fef3c7,dcfce7`,
      createdAt: new Date().toISOString()
    };

    setRegisteredUsers(prev => [...prev, newUser]);

    const { password: _, ...safeUser } = newUser;
    setRememberSession(true);
    setUser(safeUser);

    return { success: true };
  };

  const logout = () => {
    setRememberSession(false);
    setUser(null);
  };

  const updateUserProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, ...updatedFields } : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
