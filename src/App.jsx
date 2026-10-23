import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import Producto from './pages/Producto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Admin from './pages/Admin';
import AdminProductos from './pages/AdminProductos';
import AdminPedidos from './pages/AdminPedidos';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/producto" element={<Producto />} />
      </Route>

      <Route element={<Layout simple />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
