import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function useAccesoAdmin(mensaje = 'Acceso denegado.') {
  const { usuarioActual } = useStore();
  const navigate = useNavigate();
  const esAdmin = usuarioActual?.rol === 'admin';
  const avisado = useRef(false);

  useEffect(() => {
    if (!esAdmin && !avisado.current) {
      avisado.current = true;
      alert(mensaje);
      navigate('/', { replace: true });
    }
  }, []);

  return esAdmin;
}
