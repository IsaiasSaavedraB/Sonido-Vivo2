import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import usePagina from '../hooks/usePagina';
import useAccesoAdmin from '../hooks/useAccesoAdmin';
import css from '../styles/admin.css?inline';

export default function AdminPedidos() {
  usePagina(css, 'Admin · Pedidos · Sonido Vivo');
  const esAdmin = useAccesoAdmin();
  const { usuarios } = useStore();
  if (!esAdmin) return null;

  const filas = usuarios.flatMap((u) =>
    (u.pedidos || []).map((p, i) => ({ usuario: u, pedido: p, key: `${u.id}-${i}` }))
  );

  return (
    <main>
      <Link to="/admin" className="volver-link">
        <i className="fas fa-arrow-left"></i> Volver al panel
      </Link>
      <h2>Historial de Pedidos</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" id="tabla-pedidos">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody id="pedidos-tbody">
            {filas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  No hay pedidos realizados aún.
                </td>
              </tr>
            ) : (
              filas.map(({ usuario, pedido, key }) => (
                <tr key={key}>
                  <td><strong>{usuario.nombre}</strong> ({usuario.email})</td>
                  <td>{new Date(pedido.fecha).toLocaleString('es-CL')}</td>
                  <td>${pedido.total.toLocaleString()}</td>
                  <td>
                    {pedido.items.map((item) => item.nombre + ' (x' + item.cantidad + ')').join(', ')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
