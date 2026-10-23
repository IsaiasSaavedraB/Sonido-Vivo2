import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import usePagina from '../hooks/usePagina';
import css from '../styles/login.css?inline';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  usePagina(css, 'Login · Sonido Vivo');
  const { usuarios, iniciarSesion } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = { email: '', password: '' };
    let valid = true;

    if (!email.trim() || !emailRegex.test(email.trim())) {
      nuevos.email = 'Correo inválido.';
      valid = false;
    }
    if (!password.trim() || password.trim().length < 8) {
      nuevos.password = 'Mínimo 8 caracteres.';
      valid = false;
    }

    if (valid) {
      const usuario = usuarios.find(
        (u) => u.email === email.trim() && u.password === password.trim()
      );
      if (usuario) {
        iniciarSesion({
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol || 'user',
        });
        alert('✅ Bienvenido, ' + usuario.nombre + '!');
        navigate('/');
        return;
      }
      nuevos.email = 'Credenciales incorrectas.';
      nuevos.password = 'Intenta de nuevo.';
    }
    setErrores(nuevos);
  };

  return (
    <main>
      <section className="formulario">
        <h2><i className="fas fa-sign-in-alt"></i> Iniciar sesión</h2>
        <form id="form-login" noValidate onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="email"><i className="fas fa-envelope"></i> Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="error" id="email-error">{errores.email}</span>
          </div>
          <div className="campo">
            <label htmlFor="password"><i className="fas fa-lock"></i> Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="error" id="password-error">{errores.password}</span>
          </div>
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-sign-in-alt"></i> Ingresar
          </button>
          <p className="enlace-form">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
          <p className="enlace-form">
            <Link to="/"><i className="fas fa-arrow-left"></i> Volver al inicio</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
