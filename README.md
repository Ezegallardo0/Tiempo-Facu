# TiempoFacu 🎓 — Landing Page, Autenticación y Contenido Protegido

Organizador integral y moderno para la vida universitaria y la gestión de tareas, con diseño cálido y colores pasteles (lavanda, menta, manteca, durazno y cielo).

---

## 🚀 Nuevas Funcionalidades: Registro, Login y Contenido Protegido

### 1. 📝 Página de Registro (`#registro`)
- Registro de estudiante con Nombre, Universidad (UBA, UTN, UNC, UNLP, ITBA, etc.), Carrera, Cuatrimestre, Email y Contraseña.
- Botón de ver/ocultar contraseña.
- Acceso directo con cuenta demo en 1 solo clic.
- Validación de contraseñas y persistencia de cuentas registradas en `localStorage`.

### 2. 🔑 Página de Login (`#login`)
- Inicio de sesión con correo y contraseña.
- Botón *"Entrar con Demo"* para probar la app sin esperas (cuenta preconfigurada: `demo@estudiante.edu` / `password123`).
- Opción de "Recordarme" y enlaces para recuperar o registrarse.

### 3. 🔒 Contenido Protegido (Dashboard del Estudiante - `#dashboard`)
- **Control de Acceso (Gatekeeper)**: Si un usuario no autenticado intenta ingresar a `#dashboard`, se bloquea el acceso mostrando la pantalla de protección con candado y opciones para identificarse.
- **Panel Privado del Estudiante**:
  - **Perfil Universitario**: Saludo personalizado con nombre, avatar, universidad, carrera y cuatrimestre actual.
  - 📅 **Mi Horario Semanal**: Visualizador de cursada con filtro por día, botón modal para **Agregar Materia** (nombre, horario, aula, cátedra y color pastel) y botón para eliminarla.
  - 📝 **Mis Tareas & Entregas**: Gestor privado de pendientes con prioridades (Alta, Media, Baja), checkboxes interactivos y contador de avance.
  - 🎓 **Notas & Promedios en Vivo**: Tabla interactiva donde el estudiante ingresa notas de 1° Parcial, 2° Parcial y TPs, calculando en tiempo real el promedio y mostrando el estado de cursada (*Promocionada*, *Regular a Final*, *Recuperatorio*).
  - 📌 **Pizarra de Post-its**: Tablero de notas adhesivas con colores pasteles y tipografía manuscrita (*Caveat*) para no olvidar trámites ni avisos de la facultad.
  - **Persistencia en LocalStorage**: Todo cambio que hace el estudiante queda guardado en su navegador.

---

## 🛠️ Tecnologías

- **React 19**
- **Vite 8**
- **AuthContext** (Gestión de sesión, persistencia y estado)
- **CSS Pastel & Paper Aesthetic** (Variables CSS nativas, sin dependencias pesadas)
- **Tipografías**: *Plus Jakarta Sans* y *Caveat* (manuscrita)

---

## 💻 Comandos

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar producción
npm run build

# Linter de código
npm run lint
```
