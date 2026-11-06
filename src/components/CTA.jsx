import { ArrowRightIcon, SmartphoneIcon } from './Icons';

export default function CTA({ onOpenAuth }) {
  return (
    <section className="cta-banner-section">
      <div className="cta-banner-card-pastel">
        <div className="cta-content-wrap">
          <div className="cta-badge-pill">
            <span>✨ El mejor momento para organizarte es hoy</span>
          </div>

          <h2 className="cta-title-text">
            Tu próximo cuatrimestre <br />
            <span className="highlighter-mint">puede ser mucho más tranquilo.</span>
          </h2>

          <p className="cta-desc-text">
            Dejá de adivinar con cuánto promocionás o de correr a medianoche para subir un archivo. 
            Sumate gratis a TiempoFacu y recuperá tus fines de semana.
          </p>

          <div className="cta-buttons-wrap">
            <button onClick={() => onOpenAuth('register')} className="btn-cta-primary-pastel group">
              <span>Empezar Gratis Ahora</span>
              <ArrowRightIcon size={18} className="btn-icon-shift" />
            </button>
            <button onClick={() => onOpenAuth('demo')} className="btn-cta-secondary-pastel">
              <SmartphoneIcon size={18} />
              <span>Ver App en el Celular</span>
            </button>
          </div>

          <div className="cta-reassurances-row">
            <span>✓ Sin tarjeta de crédito</span>
            <span>✓ Se configura en 2 minutos</span>
            <span>✓ Compatible con cualquier carrera</span>
          </div>
        </div>
      </div>
    </section>
  );
}
