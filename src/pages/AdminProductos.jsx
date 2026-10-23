import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import usePagina from '../hooks/usePagina';
import useAccesoAdmin from '../hooks/useAccesoAdmin';
import css from '../styles/admin.css?inline';

export default function AdminProductos() {
  usePagina(css, 'Admin · Productos · Sonido Vivo');
  const esAdmin = useAccesoAdmin();
  const { productos, actualizarStock } = useStore();

  const [stocks, setStocks] = useState({});
  useEffect(() => {
    setStocks(Object.fromEntries(productos.map((p) => [p.id, String(p.stock)])));
  }, [productos]);

  if (!esAdmin) return null;

  const handleActualizar = (id) => {
    const nuevoStock = parseInt(stocks[id], 10);
    if (isNaN(nuevoStock) || nuevoStock < 0) {
      alert('Ingresa un número válido (0 o mayor).');
      return;
    }
    actualizarStock(id, nuevoStock);
    alert('✅ Stock actualizado correctamente.');
  };

  return (
    <main>
      <Link to="/admin" className="volver-link">
        <i className="fas fa-arrow-left"></i> Volver al panel
      </Link>
      <h2>Gestión de Productos y Stock</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" id="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock actual</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="productos-tbody">
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>${p.precio.toLocaleString()}</td>
                <td>
                  <input
                    type="number"
                    className="stock-input"
                    id={`stock-${p.id}`}
                    value={stocks[p.id] ?? String(p.stock)}
                    min="0"
                    onChange={(e) => setStocks({ ...stocks, [p.id]: e.target.value })}
                  />
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleActualizar(p.id)}>
                    <i className="fas fa-save"></i> Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
