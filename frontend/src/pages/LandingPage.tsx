import { Link } from 'react-router'
import { Icon } from '../shared/ui/Icon'

export function LandingPage() {
  return (
    <main className="landing">
      <section className="landing__hero">
        <div className="landing__copy">
          <span className="announcement"><Icon name="building" size={17} /> Portal comunitario oficial</span>
          <h1>SGI-Curime:<br /><span>Tu portal comunitario</span></h1>
          <p>Facilitamos la participación ciudadana y la transparencia en Curime desde un espacio digital claro, cercano y seguro.</p>
          <div className="button-row">
            <Link className="button button--primary" to="/solicitar-cuenta">Solicitar una cuenta <Icon name="arrow" size={18} /></Link>
            <a className="button button--outline" href="#acerca"><Icon name="info" size={18} /> Conocer la ADI</a>
          </div>
        </div>
        <div className="community-grid" aria-label="Comunidad, gestión digital y transparencia">
          <div className="community-card community-card--main"><Icon name="people" size={42} /><strong>Comunidad</strong><span>Participación que nos conecta</span></div>
          <div className="community-card community-card--digital"><Icon name="dashboard" size={36} /><strong>Gestión digital</strong></div>
          <div className="community-card community-card--trust"><Icon name="shield" size={42} /><strong>Transparencia</strong></div>
        </div>
      </section>
      <section className="landing__about" id="acerca">
        <span className="eyebrow">Asociación de Desarrollo Integral</span>
        <h2>Una herramienta para fortalecer Curime</h2>
        <p>Esta primera etapa habilita el acceso seguro y la base para incorporar trámites, afiliación y gestión administrativa de forma progresiva.</p>
      </section>
    </main>
  )
}
