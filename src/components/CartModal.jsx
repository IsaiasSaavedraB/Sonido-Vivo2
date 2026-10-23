import { useStore } from '../context/StoreContext';

export default function CartModal() {
  const {
    carrito,
    totalCarrito,
    carritoAbierto,
    cerrarCarrito,
    eliminarDelCarrito,
    realizarPedido,
    getProducto,
  } = useStore();

  const handleCheckout = () => {
    realizarPedido();
    cerrarCarrito();
  };

  return (
    <div
      id="cart-modal"
      className={`cart-modal${carritoAbierto ? ' active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrarCarrito();
      }}
    >
      <div className="cart-content">
        <span className="close-cart" onClick={cerrarCarrito}>
          <i className="fas fa-times"></i>
        </span>
        <h2><i className="fas fa-shopping-bag"></i> Tu carrito</h2>

        <div id="cart-items">
          {carrito.length === 0 ? (
            <p style={{ color: '#999' }}>El carrito está vacío.</p>
          ) : (
            carrito.map((item) => {
              const prod = getProducto(item.id);
              const subtotal = item.precio * item.cantidad;
              return (
                <div className="cart-item" key={item.id}>
                  <span>{prod?.nombre ?? item.nombre} (x{item.cantidad})</span>
                  <span>${subtotal.toLocaleString()}</span>
                  <button onClick={() => eliminarDelCarrito(item.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-total">
          <strong>Total:</strong> <span id="cart-total-price">${totalCarrito.toLocaleString()}</span>
        </div>
        <button id="checkout-btn" className="btn btn-primary" onClick={handleCheckout}>
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
