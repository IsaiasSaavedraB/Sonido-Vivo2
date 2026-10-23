
import { createContext, useContext, useEffect, useState } from 'react';
import { productosData } from '../data/productosData';

const StoreContext = createContext(null);

function leer(clave, porDefecto) {
  try {
    const valor = JSON.parse(localStorage.getItem(clave));
    return valor ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function initProductos() {
  return leer('productos', null) || productosData;
}

function initUsuarios() {
  const usuarios = leer('usuarios', []);
  const adminExists = usuarios.some((u) => u.email === 'admin@sonidovivo.cl');
  if (!adminExists) {
    usuarios.push({
      id: Date.now() - 1000,
      nombre: 'Administrador',
      apellido: 'SonidoVivo',
      email: 'admin@sonidovivo.cl',
      password: 'admin123',
      rol: 'admin',
      fechaNacimiento: '1990-01-01',
      carrito: [],
      pedidos: [],
    });
  }
  return usuarios;
}

export function StoreProvider({ children }) {
  const [productos, setProductos] = useState(initProductos);
  const [usuarios, setUsuarios] = useState(initUsuarios);
  const [usuarioActual, setUsuarioActual] = useState(() => leer('usuarioActual', null));
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => guardar('productos', productos), [productos]);
  useEffect(() => guardar('usuarios', usuarios), [usuarios]);
  useEffect(() => {
    if (usuarioActual) guardar('usuarioActual', usuarioActual);
    else localStorage.removeItem('usuarioActual');
  }, [usuarioActual]);


  const getProducto = (id) => productos.find((p) => p.id === id);

  const usuarioCompleto = usuarioActual
    ? usuarios.find((u) => u.id === usuarioActual.id) || null
    : null;

  const carrito = usuarioCompleto?.carrito || [];
  const cantidadCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalCarrito = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const actualizarUsuario = (actualizado) => {
    setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
    setUsuarioActual({
      id: actualizado.id,
      email: actualizado.email,
      nombre: actualizado.nombre,
      rol: actualizado.rol || 'user',
    });
  };


  const iniciarSesion = (usuario) => setUsuarioActual(usuario);
  const cerrarSesion = () => setUsuarioActual(null);

  const registrarUsuario = (nuevoUsuario) => setUsuarios((prev) => [...prev, nuevoUsuario]);

  const agregarAlCarrito = (productoId, cantidad = 1) => {
    if (!usuarioCompleto) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return false;
    }
    const producto = getProducto(productoId);
    if (!producto) return false;
    if (producto.stock <= 0) {
      alert('Lo sentimos, este producto no tiene stock disponible.');
      return false;
    }
    const existente = carrito.find((item) => item.id === productoId);
    const cantidadActual = existente ? existente.cantidad : 0;
    if (cantidadActual + cantidad > producto.stock) {
      alert('No hay suficiente stock. Disponible: ' + producto.stock);
      return false;
    }

    const nuevoCarrito = existente
      ? carrito.map((item) =>
          item.id === productoId ? { ...item, cantidad: item.cantidad + cantidad } : item
        )
      : [...carrito, { id: productoId, cantidad, precio: producto.precio, nombre: producto.nombre }];

    actualizarUsuario({ ...usuarioCompleto, carrito: nuevoCarrito });
    return true;
  };

  const actualizarStock = (id, nuevoStock) =>
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p)));

  const eliminarDelCarrito = (productoId) => {
    if (!usuarioCompleto) return;
    actualizarUsuario({
      ...usuarioCompleto,
      carrito: carrito.filter((item) => item.id !== productoId),
    });
  };

  const vaciarCarrito = () => {
    if (!usuarioCompleto) return;
    actualizarUsuario({ ...usuarioCompleto, carrito: [] });
  };

  const realizarPedido = () => {
    if (!usuarioCompleto) {
      alert('Debes iniciar sesión para finalizar la compra.');
      return;
    }
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    for (const item of carrito) {
      const producto = getProducto(item.id);
      if (!producto || producto.stock < item.cantidad) {
        alert(
          'El producto "' + item.nombre + '" no tiene suficiente stock. Disponible: ' +
            (producto ? producto.stock : 0)
        );
        return;
      }
    }

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const pedido = {
      fecha: new Date().toISOString(),
      total,
      items: carrito.map((item) => ({ ...item })),
    };

    setProductos((prev) =>
      prev.map((p) => {
        const item = carrito.find((i) => i.id === p.id);
        return item ? { ...p, stock: p.stock - item.cantidad } : p;
      })
    );
    actualizarUsuario({
      ...usuarioCompleto,
      pedidos: [...(usuarioCompleto.pedidos || []), pedido],
      carrito: [],
    });

    alert('✅ Pedido realizado con éxito. Total: $' + total.toLocaleString());
  };

  const value = {
    productos,
    setProductos,
    usuarios,
    setUsuarios,
    usuarioActual,
    usuarioCompleto,
    carrito,
    cantidadCarrito,
    totalCarrito,
    carritoAbierto,
    abrirCarrito: () => setCarritoAbierto(true),
    cerrarCarrito: () => setCarritoAbierto(false),
    getProducto,
    iniciarSesion,
    cerrarSesion,
    registrarUsuario,
    actualizarStock,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    realizarPedido,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}
