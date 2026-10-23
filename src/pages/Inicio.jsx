import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import usePagina from '../hooks/usePagina';
import { imgSrc } from '../utils/imgSrc';
import css from '../styles/index.css?inline';

const ITEM_WIDTH = 220 + 16;

const VIDEO_HERO = '/img/guitar-hero.mp4';

function Carrusel({ destacados }) {
  const [indice, setIndice] = useState(0);
  const [visibles, setVisibles] = useState(1);
  const contenedor = useRef(null);

  useLayoutEffect(() => {
    const calcular = () =>
      setVisibles(Math.floor(contenedor.current.offsetWidth / ITEM_WIDTH) || 1);
    calcular();
    window.addEventListener('resize', calcular);
    return () => window.removeEventListener('resize', calcular);
  }, []);

  const maxIndice = Math.max(0, destacados.length - visibles);
  const actual = Math.min(indice, maxIndice); 
  return (
    <div className="carrusel" ref={contenedor}>
      <div
        className="carrusel-track"
        id="carrusel-track"
        style={{ transform: `translateX(-${actual * ITEM_WIDTH}px)` }}
      >
        {destacados.map((p) => (
          <div className="producto-card" key={p.id}>
            <img src={imgSrc(p.imagenes[0])} alt={p.nombre} />
            <h4>{p.nombre}</h4>
            <p>${p.precio.toLocaleString()}</p>
            <Link
              to={`/producto/${p.id}`}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.3rem 1rem' }}
            >
              Ver
            </Link>
          </div>
        ))}
      </div>
      <button
        className="carrusel-btn prev"
        id="prev-btn"
        onClick={() => actual > 0 && setIndice(actual - 1)}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button
        className="carrusel-btn next"
        id="next-btn"
        onClick={() => actual < maxIndice && setIndice(actual + 1)}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}

export default function Inicio() {
  usePagina(css, 'Sonido Vivo · Inicio');
  const { usuarioActual, productos, cerrarSesion } = useStore();
  const navigate = useNavigate();

  const handleCerrarSesion = (e) => {
    e.preventDefault();
    cerrarSesion();
    navigate('/');
  };

  return (
    <main>
      <section className="hero">
        <video autoPlay muted loop playsInline id="hero-video">
          <source src={VIDEO_HERO} type="video/mp4" />
          Tu navegador no soporta video.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2>Encuentra tu <span>sonido</span></h2>
          <p>Más de 340 referencias en instrumentos y equipos de audio.</p>
          <Link to="/productos" className="btn btn-primary">
            Explorar catálogo <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      <section className="presentacion">
        <div className="presentacion-contenido">
          <h2>Sobre Sonido Vivo</h2>
          <p className="presentacion-intro">
            Desde 2015, <strong>Sonido Vivo</strong> es el punto de encuentro de músicos y amantes del sonido en Viña del Mar.
          </p>
          <div className="presentacion-grid">
            <div className="presentacion-item">
              <i className="fas fa-store"></i>
              <h3>Tienda física</h3>
              <p>Atendemos personalmente en nuestro local del centro de Viña del Mar, con más de 340 referencias en instrumentos y equipos.</p>
            </div>
            <div className="presentacion-item">
              <i className="fas fa-guitar"></i>
              <h3>Expertos en música</h3>
              <p>Nuestro equipo está formado por músicos y técnicos que te asesorarán con conocimiento y pasión.</p>
            </div>
            <div className="presentacion-item">
              <i className="fas fa-tools"></i>
              <h3>Servicio técnico</h3>
              <p>Ofrecemos reparación de instrumentos de cuerda y mantenimiento de equipos de sonido.</p>
            </div>
            <div className="presentacion-item">
              <i className="fas fa-shipping-fast"></i>
              <h3>Envíos a todo Chile</h3>
              <p>Realizamos despachos a través de Starken y Chilexpress, para que recibas tu pedido donde estés.</p>
            </div>
          </div>
          <p className="presentacion-cierre">
            <strong>Más de 11 años</strong> conectando a músicos con su sonido ideal. ¡Visítanos o compra en línea con total confianza!
          </p>
        </div>
      </section>

      <section className="destacados">
        <h3>🎸 Productos destacados</h3>
        <Carrusel destacados={productos.slice(0, 5)} />
      </section>
      <div id="welcome-container">
        {usuarioActual && (
          <div className="welcome-message">
            <p>
              👋 Bienvenido, <strong>{usuarioActual.nombre}</strong>{' '}
              <a href="#" onClick={handleCerrarSesion}>Cerrar sesión</a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
