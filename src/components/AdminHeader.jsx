import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const claseNav = ({ isActive }) => (isActive ? 'activo' : undefined);

export default function AdminHeader() {
  const { cerrarSesion } = useStore();
  const navigate = useNavigate();

  const handleCerrarSesion = (e) => {
    e.preventDefault();
    cerrarSesion();
    navigate('/');
  };

  return (
    <header>
      <div className="logo">
        <i className="fas fa-music"></i>
        <h1>Sonido Vivo</h1>
        <span>Panel Admin</span>
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
            <NavLink to="/admin" end className={claseNav}>
              <i className="fas fa-cog"></i> Admin
            </NavLink>
          </li>
          <li>
            <a href="#" onClick={handleCerrarSesion}>
              <i className="fas fa-sign-out-alt"></i> Cerrar sesión
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
