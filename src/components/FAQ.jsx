import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: '¿Es realmente gratis? ¿Me van a pedir tarjeta al registrarme?',
      a: 'El Plan Estudiante Libre es 100% gratis para siempre. No te pedimos tarjeta de crédito ni ningún dato bancario. Podés usar tu horario de cursada, el gestor de tareas, el calendario de exámenes y la calculadora de notas sin pagar un centavo.'
    },
    {
      q: '¿Sirve para mi facultad aunque tenga un sistema propio de correlativas o notas?',
      a: 'Podés registrar materias, comisiones, horarios y notas. El estado académico usa la escala del 1 al 10 (7 o más para promocionar y 4 o más para regularizar); verificá siempre el reglamento oficial de tu institución.'
    },
    {
      q: '¿Qué pasa si en el aula de la facultad no tengo señal ni wifi?',
      a: 'Tus datos se guardan en el almacenamiento local del navegador. No se sincronizan automáticamente entre dispositivos; usá el mismo navegador y evitá borrar sus datos para conservar tu información.'
    },
    {
      q: '¿Puedo armar grupos para no pelearnos por WhatsApp con los TPs?',
      a: 'Por ahora las tareas, materias y apuntes son personales; todavía no hay tableros compartidos ni asignación de tareas a otros integrantes.'
    },
    {
      q: '¿Cómo me llegan las alertas de exámenes para no colapsar a último momento?',
      a: 'Los exámenes y eventos próximos se muestran en el calendario y el panel. El temporizador Pomodoro puede enviar una notificación del navegador al terminar una sesión si habilitás ese permiso; no se envían alertas por Telegram o WhatsApp.'
    },
    {
      q: '¿Puedo exportar mi horario o mis datos?',
      a: 'La exportación de horarios o datos todavía no está disponible. Tus materias, tareas, eventos, exámenes y apuntes permanecen en el almacenamiento local de este navegador.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">DUDAS HABITUALES</span>
        <h2 className="section-heading">Preguntas Frecuentes</h2>
        <p className="section-subheading">
          Todo lo que necesitás saber antes de empezar a usar TiempoFacu este cuatrimestre.
        </p>
      </div>

      <div className="faq-accordion-pastel">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`faq-item-pastel ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="faq-btn-trigger"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
              >
                <span className="faq-trigger-text">{item.q}</span>
                <span className="faq-arrow-circle">
                  {isOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="faq-answer-content animate-fade-in">
                  <p className="faq-answer-body">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
