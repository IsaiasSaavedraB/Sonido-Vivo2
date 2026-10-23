import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import usePagina from '../hooks/usePagina';
import css from '../styles/registro.css?inline';

const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VACIO = {
  nombre: '', apellido: '', email: '', password: '', confirm: '', nacimiento: '',
};

export default function Registro() {
  usePagina(css, 'Registro · Sonido Vivo');
  const { usuarios, registrarUsuario } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState(VACIO);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  // Variables booleanas para saber si cada campo es válido
  const esNombreValido = form.nombre.trim() && letrasRegex.test(form.nombre.trim());
  const esApellidoValido = form.apellido.trim() && letrasRegex.test(form.apellido.trim());
  const esEmailValido = form.email.trim() && emailRegex.test(form.email.trim()) && !usuarios.some((u) => u.email === form.email.trim());
  const esPasswordValido = form.password.trim() && form.password.trim().length >= 8;
  const esConfirmValido = form.confirm.trim() && form.confirm.trim() === form.password.trim();
  
  let esNacimientoValido = false;
  if (form.nacimiento) {
    const fechaNac = new Date(form.nacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
    if (fechaNac <= hoy && edad <= 120) esNacimientoValido = true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = { ...VACIO };
    let valid = true;

    if (!esNombreValido) { err.nombre = 'Solo letras.'; valid = false; }
    if (!esApellidoValido) { err.apellido = 'Solo letras.'; valid = false; }
    if (!esEmailValido) {
      err.email = !form.email.trim() ? 'Correo inválido.' : 'Este correo ya está registrado.';
      valid = false;
    }
    if (!esPasswordValido) { err.password = 'Mínimo 8 caracteres.'; valid = false; }
    if (!esConfirmValido) { err.confirm = 'No coinciden.'; valid = false; }
    if (!form.nacimiento || !esNacimientoValido) {
      err.nacimiento = 'Fecha o edad no válida.';
      valid = false;
    }

    setErrores(err);

    if (valid) {
      registrarUsuario({
        id: Date.now(),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        rol: 'user',
        fechaNacimiento: form.nacimiento,
        carrito: [],
        pedidos: [],
      });
      alert('✅ Registro exitoso. Ahora inicia sesión.');
      navigate('/login');
    }
  };

  return (
    <main>
      <section className="formulario">
        <h2><i className="fas fa-user-plus"></i> Crear cuenta</h2>
        <form id="form-registro" noValidate onSubmit={handleSubmit}>
          
          {/* Usamos la clase condicional 'valido' si el campo cumple con la regla */}
          <div className={`campo ${esNombreValido ? 'valido' : ''}`}>
            <label htmlFor="nombre"><i className="fas fa-user"></i> Nombre</label>
            <input type="text" id="nombre" placeholder="Solo letras" value={form.nombre} onChange={cambiar('nombre')} />
            <span className="error" id="nombre-error">{errores.nombre}</span>
          </div>

          <div className={`campo ${esApellidoValido ? 'valido' : ''}`}>
            <label htmlFor="apellido"><i className="fas fa-user"></i> Apellido</label>
            <input type="text" id="apellido" placeholder="Solo letras" value={form.apellido} onChange={cambiar('apellido')} />
            <span className="error" id="apellido-error">{errores.apellido}</span>
          </div>

          <div className={`campo ${esEmailValido ? 'valido' : ''}`}>
            <label htmlFor="email-reg"><i className="fas fa-envelope"></i> Correo electrónico</label>
            <input type="email" id="email-reg" placeholder="tucorreo@ejemplo.com" value={form.email} onChange={cambiar('email')} />
            <span className="error" id="email-reg-error">{errores.email}</span>
          </div>

          <div className={`campo ${esPasswordValido ? 'valido' : ''}`}>
            <label htmlFor="password-reg"><i className="fas fa-lock"></i> Contraseña</label>
            <input type="password" id="password-reg" placeholder="Mínimo 8 caracteres" value={form.password} onChange={cambiar('password')} />
            <span className="error" id="password-reg-error">{errores.password}</span>
          </div>

          <div className={`campo ${esConfirmValido ? 'valido' : ''}`}>
            <label htmlFor="password-confirm"><i className="fas fa-check-circle"></i> Confirmar contraseña</label>
            <input type="password" id="password-confirm" placeholder="Repite la contraseña" value={form.confirm} onChange={cambiar('confirm')} />
            <span className="error" id="password-confirm-error">{errores.confirm}</span>
          </div>

          <div className={`campo ${esNacimientoValido ? 'valido' : ''}`}>
            <label htmlFor="nacimiento"><i className="fas fa-calendar-alt"></i> Fecha de nacimiento</label>
            <input type="date" id="nacimiento" value={form.nacimiento} onChange={cambiar('nacimiento')} />
            <span className="error" id="nacimiento-error">{errores.nacimiento}</span>
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Registrarse
          </button>
          
          <p className="enlace-form">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
          <p className="enlace-form">
            <Link to="/"><i className="fas fa-arrow-left"></i> Volver al inicio</Link>
          </p>
        </form>
      </section>
    </main>
  );
}