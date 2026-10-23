import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Registro from './Registro';
import { StoreContext } from '../context/StoreContext';

vi.mock('../hooks/usePagina', () => ({
  default: () => {},
}));

describe('Componente Registro - Vistos buenos y errores', () => {
  const renderRegistro = (storeValues = { usuarios: [], registrarUsuario: vi.fn() }) => {
    return render(
      <StoreContext.Provider value={storeValues}>
        <MemoryRouter>
          <Registro />
        </MemoryRouter>
      </StoreContext.Provider>
    );
  };

  it('muestra un icono de visto bueno en verde cuando el campo es completado correctamente', async () => {
    renderRegistro();

    // Escribimos un nombre válido
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Isaias' } });

    // Verificamos que aparezca el icono de visto bueno con el title 'Válido'
    await waitFor(() => {
      const iconosValidos = screen.getAllByTitle('Válido');
      expect(iconosValidos.length).toBeGreaterThan(0);
    });
  });

  it('permite completar todos los campos correctamente mostrando sus respectivos vistos buenos y registrando con éxito', async () => {
    const registrarMock = vi.fn();
    renderRegistro({ usuarios: [], registrarUsuario: registrarMock });

    // Rellenamos todos los campos correctamente
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Isaias' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Saavedra' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'is.saavedrab@duocuc.cl' } });
    fireEvent.change(screen.getByLabelText(/^contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), { target: { value: '2000-05-15' } });

    // Comprobamos que aparezcan varios indicadores de éxito (uno por cada campo válido)
    await waitFor(() => {
      const iconosValidos = screen.getAllByTitle('Válido');
      expect(iconosValidos.length).toBe(6); // 6 campos válidos en total
    });

    // Enviamos el formulario
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    // Validamos que se ejecutó el registro
    expect(registrarMock).toHaveBeenCalledTimes(1);
  });
});