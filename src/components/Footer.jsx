export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <i className="fas fa-music"></i>
          <span>Sonido Vivo</span>
          <p>Viña del Mar, Chile</p>
        </div>
        <div className="footer-links">
          <a href="#">Nosotros</a>
          <a href="#">Contacto</a>
          <a href="#">Políticas</a>
        </div>
        <div className="footer-social">
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-whatsapp"></i></a>
          <a href="#"><i className="fab fa-facebook"></i></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Sonido Vivo · Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
