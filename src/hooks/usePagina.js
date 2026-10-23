import { useLayoutEffect } from 'react';

export default function usePagina(css, titulo) {
  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => style.remove();
  }, [css]);

  useLayoutEffect(() => {
    document.title = titulo;
  }, [titulo]);
}
