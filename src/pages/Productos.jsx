import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import usePagina from '../hooks/usePagina';
import { imgSrc } from '../utils/imgSrc';
import css from '../styles/productos.css?inline';

const CATEGORIAS = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'guitarra', etiqueta: '🎸 Guitarras' },
  { valor: 'bajo', etiqueta: '🎸 Bajos' },
  { valor: 'bateria', etiqueta: '🥁 Baterías' },
  { valor: 'teclado', etiqueta: '🎹 Teclados' },
  { valor: 'amplificador', etiqueta: '🔊 Amplificadores' },
  { valor: 'microfono', etiqueta: '🎤 Micrófonos' },
];

export default function Productos() {
  usePagina(css, 'Catálogo · Sonido Vivo');
  const { productos, agregarAlCarrito } = useStore();

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [orden, setOrden] = useState('nombre-asc');
  
  // 1. ESTADO NECESARIO PARA LOS BOTONES VERDES
  const [agregadosRecientes, setAgregadosRecientes] = useState([]);

  // 2. FUNCIÓN PARA MANEJAR EL AGREGADO AL CARRITO Y EL CAMBIO DE COLOR
  const handleAnadir = (p) => {
    if (agregarAlCarrito(p.id)) {
      setAgregadosRecientes((prev) => [...prev, p.id]);

      setTimeout(() => {
        setAgregadosRecientes((prev) => prev.filter((id) => id !== p.id));
      }, 1500);
    }
  };

  const filtrados = useMemo(() => {
    const search = busqueda.toLowerCase();

    const resultado = productos.filter((p) => {
      const matchCategoria = categoria === 'todos' || p.categoria === categoria;
      const matchSearch =
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search);
      return matchCategoria && matchSearch;
    });

    switch (orden) {
      case 'nombre-asc': resultado.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      case 'nombre-desc': resultado.sort((a, b) => b.nombre.localeCompare(a.nombre)); break;
      case 'precio-asc': resultado.sort((a, b) => a.precio - b.precio); break;
      case 'precio-desc': resultado.sort((a, b) => b.precio - a.precio); break;
      default: break;
    }
    return resultado;
  }, [productos, busqueda, categoria, orden]);

  return (
    <main>
      <h2>Nuestros productos</h2>

      <div className="filtros">
        <div className="busqueda">
          <i className="fas fa-search"></i>
          <input
            type="text"
            id="search-input"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="categorias">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.valor}
              className={`filtro-btn${categoria === cat.valor ? ' active' : ''}`}
              onClick={() => setCategoria(cat.valor)}
            >
              {cat.etiqueta}
            </button>
          ))}
        </div>

        <div className="ordenamiento">
          <label htmlFor="sort-select">Ordenar:</label>
          <select id="sort-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="nombre-asc">Nombre A-Z</option>
            <option value="nombre-desc">Nombre Z-A</option>
            <option value="precio-asc">Precio menor</option>
            <option value="precio-desc">Precio mayor</option>
          </select>
        </div>
      </div>

      <section className="catalogo" id="productos-container">
        {filtrados.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No se encontraron productos.
          </p>
        ) : (
          filtrados.map((p) => {
            const agotado = p.stock <= 0;
            // 3. EVALUACIÓN DE SI EL PRODUCTO FUE AGREGADO RECIENTEMENTE
            const fueAgregado = agregadosRecientes.includes(p.id);

            return (
              <article className="producto-card" key={p.id}>
                <img src={imgSrc(p.imagenes[0])} alt={p.nombre} />
                <h3>{p.nombre}</h3>
                <p className="descripcion">{p.descripcion.substring(0, 70)}...</p>
                <p className="precio">${p.precio.toLocaleString()}</p>
                <p className={`stock${agotado ? ' agotado' : ''}`}>
                  {agotado ? '❌ Agotado' : '📦 Stock: ' + p.stock}
                </p>
                <Link to={`/producto/${p.id}`} className="btn btn-secondary">
                  Ver detalle
                </Link>
                <button
                  onClick={() => handleAnadir(p)}
                  className={`btn btn-primary ${fueAgregado ? 'agregado' : ''}`}
                  style={{ marginTop: '0.3rem' }}
                  disabled={agotado}
                >
                  {fueAgregado ? (
                    <>
                      <i className="fas fa-check"></i> ¡Agregado!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cart-plus"></i> Añadir
                    </>
                  )}
                </button>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}