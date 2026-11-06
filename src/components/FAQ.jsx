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
      a: 'Sí. TiempoFacu fue concebido para la realidad de universidades y terciarios de Latinoamérica y España (UBA, UTN, UNC, UNLP, ITBA, UADE, UNAM, PUC, etc.). Permite configurar escalas del 1 al 10, del 1 al 7 (Chile), del 0 al 20 (Perú), letras o porcentajes, además de ponderaciones personalizadas de TPs y laboratorios.'
    },
    {
      q: '¿Qué pasa si en el aula de la facultad no tengo señal ni wifi?',
      a: 'Diseñamos la app con arquitectura Offline-First. Sabemos que las aulas magnas y los subsuelos de las facultades son agujeros negros de señal. Podés consultar tus horarios, ver en qué aula cursás o anotar recordatorios sin conexión. Cuando volvés a tener señal, se sincroniza automáticamente.'
    },
    {
      q: '¿Puedo armar grupos para no pelearnos por WhatsApp con los TPs?',
      a: 'Totalmente. Con la función de TPs Grupales podés crear un tablero de trabajo, asignar qué parte redacta cada integrante y definir entregas internas (ej. "Entrega de borrador 3 días antes de la fecha final del campus"). Nadie se queda con la duda de quién tiene el archivo o el código.'
    },
    {
      q: '¿Cómo me llegan las alertas de exámenes para no colapsar a último momento?',
      a: 'Podés recibir notificaciones en tu celular, computadora y opcionalmente por Telegram o WhatsApp. El sistema usa alertas inteligentes escalonadas: 1 semana antes para empezar el repaso, 48 horas antes para consultar dudas y 3 horas antes del cierre del campus virtual.'
    },
    {
      q: '¿Puedo exportar mi horario para tenerlo de fondo de pantalla en el celular?',
      a: '¡Sí! Podés descargar tu horario semanal en una imagen estética con colores pasteles, en alta resolución y con el formato exacto para la pantalla de bloqueo de tu teléfono.'
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
