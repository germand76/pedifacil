import { initCategoriasMenu } from './modules/categoriasMenu.js';
import { setProductoEnPedido } from './modules/pedidoStore.js';
import { actualizarBadgePedido } from './modules/uiPedido.js';
import { obtenerPedido } from './modules/pedidoStore.js';
import { getProductos } from './modules/dataCache.js';

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================
     PRECARGA DE PRODUCTOS (NO BLOQUEANTE)
  ===================================== */

  // Dispara la descarga apenas entra a la página
  // No usamos await para no frenar el render
  getProductos().catch(() => {
    // Silencioso: si falla, se volverá a pedir cuando haga falta
  });

  /* =====================================
     CATEGORÍAS
  ===================================== */

  const categoriaGuardada = sessionStorage.getItem('categoriaActiva');

  initCategoriasMenu({
    categoriasContainer: document.getElementById('categorias'),
    categoriaInicial: categoriaGuardada ? Number(categoriaGuardada) : null
  });

  actualizarBadgePedido();

  /* =====================================
     INTERACCIONES PRODUCTOS
  ===================================== */

  const contenedorProductos = document.getElementById('productos');
  if (!contenedorProductos) return;

  // Botones + / -
  contenedorProductos.addEventListener('click', (e) => {
    const btnMas = e.target.closest('.btn-mas');
    const btnMenos = e.target.closest('.btn-menos');
    if (!btnMas && !btnMenos) return;

    const card = e.target.closest('.producto');
    if (!card) return;

    const span = card.querySelector('.cantidad');
    if (!span) return;

    let cantidad = Number(span.textContent) || 0;
    cantidad = btnMas ? cantidad + 1 : Math.max(0, cantidad - 1);
    span.textContent = String(cantidad);

    const producto = {
      id: card.dataset.id,
      nombre: card.querySelector('h6')?.textContent || '',
      descripcion: card.querySelector('.descripcion')?.textContent || '',
      precio: Number(
        (card.querySelector('.precio')?.textContent || '0')
          .replace('$', '')
          .replace(/\./g, '')
          .replace(',', '.')
      ),
      id_categoria: Number(card.dataset.categoria)
    };

    setProductoEnPedido(producto, cantidad);
    actualizarBadgePedido();
  });

  // Select de cantidades
  contenedorProductos.addEventListener('change', (e) => {
    if (!e.target.classList.contains('select-cantidad')) return;

    const card = e.target.closest('.producto');
    if (!card) return;

    const cantidad = Number(e.target.value) || 0;

    const producto = {
      id: card.dataset.id,
      nombre: card.querySelector('h6')?.textContent || '',
      descripcion: card.querySelector('.descripcion')?.textContent || '',
      precio: Number(
        (card.querySelector('.precio')?.textContent || '0')
          .replace('$', '')
          .replace(/\./g, '')
          .replace(',', '.')
      ),
      id_categoria: Number(card.dataset.categoria)
    };

    setProductoEnPedido(producto, cantidad);
    actualizarBadgePedido();
  });
});

/* =====================================
   BOTÓN "MI PEDIDO"
===================================== */

const btnPedido = document.getElementById('btn-pedido');

if (btnPedido) {
  btnPedido.addEventListener('click', (e) => {
    const pedido = obtenerPedido();
    const cantidadItems = Object.values(pedido)
      .reduce((acc, p) => acc + Number(p.cantidad), 0);

    if (cantidadItems === 0) {
      e.preventDefault();

      Swal.fire({
        icon: 'info',
        title: 'Pedido vacío',
        text: 'Todavía no elegiste ningún producto.',
        confirmButtonText: 'Entendido',
        allowOutsideClick: false,
      });
    }
  });
}
