import { Link } from 'react-router-dom';
import usePagina from '../hooks/usePagina';
import useAccesoAdmin from '../hooks/useAccesoAdmin';
import css from '../styles/admin.css?inline';

export default function Admin() {
  usePagina(css, 'Admin · Sonido Vivo');
  const esAdmin = useAccesoAdmin('Acceso denegado. Necesitas permisos de administrador.');
  if (!esAdmin) return null;

  return (
    <main>
      <h2>Panel de Administración</h2>
      <div className="admin-grid">
        <Link to="/admin/productos" className="admin-card">
          <i className="fas fa-boxes"></i>
          <h3>Gestionar Productos</h3>
          <p>Ver y actualizar stock de productos.</p>
        </Link>
        <Link to="/admin/pedidos" className="admin-card">
          <i className="fas fa-shopping-cart"></i>
          <h3>Ver Pedidos</h3>
          <p>Lista de todos los pedidos realizados.</p>
        </Link>
      </div>
    </main>
  );
}
