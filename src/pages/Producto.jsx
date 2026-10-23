import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import usePagina from '../hooks/usePagina';
import { imgSrc } from '../utils/imgSrc';
import css from '../styles/producto.css?inline';

function DetalleProducto({ producto }) {
  const { agregarAlCarrito } = useStore();
  const [imgPrincipal, setImgPrincipal] = useState(producto.imagenes[0]);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState({ texto: '', visible: false });
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const mostrarMensaje = (texto) => {
    clearTimeout(timer.current);
    setMensaje({ texto, visible: true });
    timer.current = setTimeout(() => setMensaje((m) => ({ ...m, visible: false })), 3000);
  };

  const agotado = producto.stock <= 0;

  const handleAgregar = () => {
    const n = parseInt(cantidad, 10);
    if (agregarAlCarrito(producto.id, n > 0 ? n : 1)) {
      mostrarMensaje('¡Producto agregado al carrito!');
    }
  };

  return (
    <>
      <div className="imagenes">
        <img src={imgSrc(imgPrincipal)} alt={producto.nombre} id="img-principal" />
        <div className="miniatura">
          {producto.imagenes.map((img, index) => (
            <img
              key={index}
              src={imgSrc(img)}
              alt={`Vista ${index + 1}`}
              onClick={() => setImgPrincipal(img)}
            />
          ))}
        </div>
      </div>
      <div className="info">
        <h2>{producto.nombre}</h2>
        <p className="precio-detalle">${producto.precio.toLocaleString()}</p>
        <p className={`stock-detalle${agotado ? ' agotado' : ''}`}>
          {agotado ? '❌ Agotado' : '📦 Stock disponible: ' + producto.stock}
        </p>
        <p className="descripcion-detalle">{producto.descripcion}</p>
        <ul className="especificaciones">
          {(producto.especificaciones || []).map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
        <div className="acciones">
          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            min="1"
            max={agotado ? 1 : producto.stock}
            disabled={agotado}
            onChange={(e) => setCantidad(e.target.value)}
          />
          <button onClick={handleAgregar} className="btn btn-primary" disabled={agotado}>
            <i className="fas fa-cart-plus"></i> Agregar al carrito
          </button>
        </div>
        <p
          id="mensaje-interaccion"
          className={mensaje.visible ? 'mensaje-visible' : 'mensaje-oculto'}
        >
          {mensaje.texto}
        </p>
        <Link to="/productos" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          <i className="fas fa-arrow-left"></i> Volver al catálogo
        </Link>
      </div>
    </>
  );
}

export default function Producto() {
  usePagina(css, 'Detalle · Sonido Vivo');
  const { productos } = useStore();
  const { id: idRuta } = useParams();
  const [query] = useSearchParams();

  const id = parseInt(idRuta ?? query.get('id'), 10);
  const producto = productos.find((p) => p.id === id);

  return (
    <main>
      <section id="detalle-container" className="detalle-producto">
        {!producto ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Producto no encontrado.</p>
        ) : (
          <DetalleProducto key={producto.id} producto={producto} />
        )}
      </section>
    </main>
  );
}
