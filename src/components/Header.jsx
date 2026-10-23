import { NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const claseNav = ({ isActive }) => (isActive ? 'activo' : undefined);

export default function Header({ simple = false }) {
  const { usuarioActual, cantidadCarrito, abrirCarrito } = useStore();
  const esAdmin = !simple && usuarioActual?.rol === 'admin';

  return (
    <header>
      <div className="logo">
        <i className="fas fa-music"></i>
        <h1>Sonido Vivo</h1>
        <span>Instrumentos &amp; Equipos</span>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end className={claseNav}>
              <i className="fas fa-home"></i> Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/productos" className={claseNav}>
              <i className="fas fa-store"></i> Catálogo
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className={claseNav}>
              <i className="fas fa-sign-in-alt"></i> Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/registro" className={claseNav}>
              <i className="fas fa-user-plus"></i> Registro
            </NavLink>
          </li>
          {esAdmin && (
            <li>
              <NavLink to="/admin" className={claseNav}>
                <i className="fas fa-cog"></i> Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      {!simple && (
        <div className="cart-icon" id="cart-icon" onClick={abrirCarrito}>
          <i className="fas fa-shopping-bag"></i>
          <span id="cart-count">{cantidadCarrito}</span>
        </div>
      )}
    </header>
  );
}
