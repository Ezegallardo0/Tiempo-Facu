import { useState } from 'react';
import { CheckIcon } from './Icons';

export default function Pricing({ onOpenAuth }) {
  const [billingCycle, setBillingCycle] = useState('cuatri'); // 'mensual' or 'cuatri'

  const plans = [
    {
      name: 'Estudiante Libre',
      tagline: 'Ideal para comenzar y ordenar tus materias este cuatri.',
      price: '$0',
      period: 'Gratis para siempre',
      popular: false,
      color: 'card-free',
      ctaText: 'Comenzar Gratis',
      features: [
        'Hasta 5 materias activas simultáneas',
        'Horario semanal con detector de solapamientos',
        'Calendario de parciales con cuenta regresiva',
        'Simulador básico de notas de promoción',
        'Acceso web y móvil con modo offline',
        'Exportación de horario en imagen para el celular'
      ]
    },
    {
      name: 'Promoción Directa',
      tagline: 'Para quienes quieren asegurar la regularidad y no perder tiempo.',
      price: billingCycle === 'cuatri' ? '$1.800' : '$2.400',
      period: billingCycle === 'cuatri' ? 'ARS / mes (plan cuatrimestre)' : 'ARS / mes',
      popular: true,
      color: 'card-popular',
      badge: 'MÁS ELEGIDO 🎒',
      ctaText: 'Probar 14 días gratis',
      features: [
        'Materias y cuatrimestres ilimitados',
        'Alertas por WhatsApp & Telegram antes del campus',
        'Calculadora de notas con ponderaciones personalizadas',
        'Árbol interactivo de correlativas de tu carrera',
        'Sincronización con Google Calendar y Canvas',
        'Grupos de TP con tareas asignadas a compañeros',
        'Historial de promedios con y sin aplazos para becas',
        'Sin publicidad y soporte prioritario'
      ]
    },
    {
      name: 'Grupo de Estudio',
      tagline: 'Diseñado para amigos, comisiones y equipos de TP.',
      price: billingCycle === 'cuatri' ? '$3.900' : '$4.900',
      period: 'ARS / mes (hasta 6 amigos)',
      popular: false,
      color: 'card-group',
      ctaText: 'Crear Grupo de Estudio',
      features: [
        'Todo lo del Plan Promoción Directa',
        'Hasta 6 cuentas incluidas en un solo pago',
        'Calendario compartido de la comisión de cursada',
        'Asignación colaborativa de partes de trabajos prácticos',
        'Espacio compartido para links de Drive y resúmenes',
        'Exportación de cronograma para WhatsApp del grupo'
      ]
    }
  ];

  return (
    <section id="precios" className="pricing-section">
      <div className="section-header-compact">
        <span className="section-eyebrow">PRECIOS ACCESIBLES</span>
        <h2 className="section-heading">Pensado para el bolsillo del estudiante</h2>
        <p className="section-subheading">
          Empezá 100% gratis. Si más adelante querés funciones avanzadas de WhatsApp y correlativas, actualizás cuando quieras. Sin trampas ni letra chica.
        </p>

        {/* Billing Switch */}
        <div className="billing-switch-pastel">
          <span className={`billing-label ${billingCycle === 'mensual' ? 'active' : ''}`}>
            Pago Mensual
          </span>
          <button
            type="button"
            className={`switch-toggle-pastel ${billingCycle === 'cuatri' ? 'active' : ''}`}
            onClick={() => setBillingCycle(billingCycle === 'cuatri' ? 'mensual' : 'cuatri')}
            aria-label="Alternar ciclo de facturación"
          >
            <span className="switch-slider"></span>
          </button>
          <span className={`billing-label ${billingCycle === 'cuatri' ? 'active' : ''}`}>
            Plan Cuatrimestral <span className="discount-pill-pastel">30% OFF 🎓</span>
          </span>
        </div>
      </div>

      <div className="pricing-cards-grid-pastel">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`pricing-card-pastel ${plan.color} ${plan.popular ? 'is-popular' : ''}`}
          >
            {plan.popular && (
              <div className="popular-badge-pill">
                <span>{plan.badge}</span>
              </div>
            )}

            <div className="pricing-header-pastel">
              <h3 className="plan-name-text">{plan.name}</h3>
              <p className="plan-tagline-text">{plan.tagline}</p>
              <div className="price-number-row">
                <span className="price-big font-mono">{plan.price}</span>
                <span className="price-freq">{plan.period}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('register')}
              className={`btn-plan-action ${plan.popular ? 'primary' : 'secondary'}`}
            >
              {plan.ctaText}
            </button>

            <div className="plan-perks-list">
              <span className="perks-title">Qué incluye:</span>
              {plan.features.map((feat, fIdx) => (
                <div key={fIdx} className="perk-item-row">
                  <span className="check-dot-mint">
                    <CheckIcon size={12} />
                  </span>
                  <span className="perk-text">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="guarantee-box-pastel">
        <span className="guarantee-emoji">🛡️</span>
        <div className="guarantee-desc">
          <strong>Garantía de tranquilidad estudiantil:</strong> Si probás cualquier plan de pago y no te ayuda a organizar mejor tus parciales, te devolvemos el 100% de tu dinero en los primeros 30 días sin hacer preguntas.
        </div>
      </div>
    </section>
  );
}
