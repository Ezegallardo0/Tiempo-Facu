import { useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon } from './Icons';

export default function TaskManagerDemo() {
  const [filterSubject, setFilterSubject] = useState('Todas');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Análisis Matemático II');
  const [newTaskPriority, setNewTaskPriority] = useState('Alta');

  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: 'Resolver ejercicios pares de la Guía 4 (Integrales Múltiples)',
      subject: 'Análisis Matemático II',
      priority: 'Alta',
      dueDate: 'Mañana, 18:00 hs',
      completed: false
    },
    {
      id: 2,
      text: 'Subir repositorio de GitHub con el TP de Árboles AVL al Campus',
      subject: 'Estructuras de Datos',
      priority: 'Alta',
      dueDate: 'En 3 días',
      completed: true
    },
    {
      id: 3,
      text: 'Redactar conclusiones del informe de laboratorio de circuitos',
      subject: 'Física II',
      priority: 'Media',
      dueDate: 'Viernes, 23:59 hs',
      completed: false
    },
    {
      id: 4,
      text: 'Resumir capítulo 5 sobre jerarquía de memoria y caché',
      subject: 'Arquitectura',
      priority: 'Baja',
      dueDate: 'Próxima semana',
      completed: false
    },
    {
      id: 5,
      text: 'Coordinar videollamada con el grupo de TP de Legislación',
      subject: 'Legislación',
      priority: 'Media',
      dueDate: 'Sábado, 15:00 hs',
      completed: true
    }
  ]);

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      subject: newTaskSubject,
      priority: newTaskPriority,
      dueDate: 'Esta semana',
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setNewTaskText('');
  };

  const subjects = ['Todas', 'Análisis Matemático II', 'Estructuras de Datos', 'Física II', 'Arquitectura', 'Legislación'];

  const filteredTasks = filterSubject === 'Todas'
    ? tasks
    : tasks.filter(t => t.subject === filterSubject);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <section id="tareas" className="taskdemo-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">ORGANIZADOR DE TAREAS</span>
        <h2 className="section-heading">Tu lista de pendientes para la semana</h2>
        <p className="section-subheading">
          Anotá entregas del campus, lecturas y trabajos grupales. Andá tachando lo que terminás para que no se te acumule todo el domingo a la noche.
        </p>
      </div>

      <div className="taskdemo-card-pastel">
        {/* Top summary row */}
        <div className="taskdemo-summary-row">
          <div className="summary-left-group">
            <span className="summary-pill-mint">
              <CheckCircleIcon size={16} />
              <span><strong>{completedCount}</strong> de <strong>{tasks.length}</strong> tareas listas</span>
            </span>
            <span className="summary-encourage-text font-hand">
              {progressPercent >= 50 ? '¡Vas con gran ritmo esta semana! ☕' : 'Paso a paso, cada tarea suma 💪'}
            </span>
          </div>

          <div className="summary-progress-wrap">
            <div className="summary-progress-track">
              <div className="summary-progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="summary-progress-perc font-mono">{progressPercent}%</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="task-filters-bar">
          <span className="filter-label">Materia:</span>
          <div className="filter-pills-scroll">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setFilterSubject(sub)}
                className={`task-filter-pill ${filterSubject === sub ? 'active' : ''}`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="add-task-form-pastel">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Escribí una tarea nueva (ej. Repasar ejercicios de integrales)..."
            className="add-task-input-pastel"
          />
          <div className="add-task-options-group">
            <select
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              className="add-task-select-pastel"
            >
              <option value="Análisis Matemático II">Análisis Matemático II</option>
              <option value="Estructuras de Datos">Estructuras de Datos</option>
              <option value="Física II">Física II</option>
              <option value="Arquitectura">Arquitectura</option>
              <option value="Legislación">Legislación</option>
            </select>

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="add-task-select-pastel"
            >
              <option value="Alta">Prioridad Alta 🔥</option>
              <option value="Media">Prioridad Media ⚡</option>
              <option value="Baja">Prioridad Baja 🍃</option>
            </select>

            <button type="submit" className="btn-add-task">
              <PlusIcon size={16} />
              <span>Anotar</span>
            </button>
          </div>
        </form>

        {/* Task Items List */}
        <div className="tasks-paper-list">
          {filteredTasks.length === 0 ? (
            <div className="tasks-empty-state">
              <p className="font-hand" style={{ fontSize: '1.2rem' }}>
                ¡No tenés tareas pendientes para esta materia! Momento de descansar o tomarse unos mates 🧉
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`task-item-card ${task.completed ? 'is-completed' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="task-checkbox-wrap">
                  <div className={`pastel-checkbox ${task.completed ? 'checked' : ''}`}>
                    {task.completed && <span>✓</span>}
                  </div>
                </div>

                <div className="task-info-wrap">
                  <span className={`task-title-text ${task.completed ? 'completed-strike' : ''}`}>
                    {task.text}
                  </span>
                  <div className="task-badges-row">
                    <span className="badge-task-subject">{task.subject}</span>
                    <span className="badge-task-due">📅 {task.dueDate}</span>
                    <span className={`badge-task-priority ${task.priority.toLowerCase()}`}>
                      {task.priority === 'Alta' ? '🔥 Alta' : task.priority === 'Media' ? '⚡ Media' : '🍃 Baja'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="btn-task-trash"
                  title="Eliminar tarea"
                >
                  <TrashIcon size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
