import { obtenerPedido, guardarPedido } from './modules/pedidoStore.js';
import { formatearPrecio } from './modules/config.js';

document.addEventListener('DOMContentLoaded', () => {
  renderPedido();

  const lista = document.getElementById('pedido-lista');
  if (!lista) return;

  lista.addEventListener('click', (e) => {
    const pedido = obtenerPedido();

    if (e.target.classList.contains('btn-eliminar')) {
      const id = e.target.dataset.id;
      delete pedido[id];
      guardarPedido(pedido);
      renderPedido();
      return;
    }

    if (e.target.classList.contains('btn-modificar')) {
      const prod = pedido[e.target.dataset.id];
      if (!prod) return;

      sessionStorage.setItem('categoriaActiva', String(prod.id_categoria));
      window.location.href = 'menu.html';
    }
  });

  document.getElementById('btn-checkout').addEventListener('click', () => {
    const pedido = obtenerPedido();

    if (Object.keys(pedido).length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Pedido vacío',
        text: 'No hay productos en el pedido.'
      });
      return;
    }

    /* ==========================================
       VALIDACIÓN PIZZAS (CATEGORÍA 1)
    ========================================== */

    const pizzas = Object.values(pedido)
      .filter(p => Number(p.id_categoria) === 1);

    const totalPizzas = pizzas
      .reduce((acc, p) => acc + Number(p.cantidad), 0);

    if (!Number.isInteger(totalPizzas)) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad de Pizzas incorrecta',
        html: `
          <p>Las pizzas se venden por unidades completas.</p>
          <p>Podés combinar mitades de diferentes variedades.</p>
        `,
        allowOutsideClick: false,
        confirmButtonText: 'Entendido'
      });
      return;
    }

    window.location.href = 'checkout.html';
  });

  const btnAgregarMas = document.getElementById('btn-agregar-mas');

  if (btnAgregarMas) {
    btnAgregarMas.addEventListener('click', () => {
      window.location.href = 'menu.html';
    });
  }
});

/* ==========================================
   RENDER PEDIDO
========================================== */

function renderPedido() {
  const pedido = obtenerPedido();
  const contenedor = document.getElementById('pedido-lista');
  const totalEl = document.getElementById('pedido-total');

  if (!contenedor || !totalEl) return;

  contenedor.innerHTML = '';
  let total = 0;

  Object.values(pedido).forEach(prod => {
    const subtotal = Number(prod.precio) * Number(prod.cantidad);
    total += subtotal;

    /* ===== Nombre / descripción ===== */

    let nombreMostrar = prod.nombre;
    let descripcionMostrar = prod.descripcion;

    if (Number(prod.id_categoria) === 1) {
      nombreMostrar = 'Pizza';
      descripcionMostrar = prod.nombre;
    }

    if (Number(prod.id_categoria) === 4) {
      nombreMostrar = 'Empanadas';
      descripcionMostrar = prod.nombre;
    }

    /* ===== Cantidad ===== */

    let cantidadMostrar = prod.cantidad;

    if (Number(prod.id_categoria) === 1) {
      cantidadMostrar = formatearCantidadPizza(prod.cantidad);
    }

    if (Number(prod.id_categoria) === 4) {
      cantidadMostrar = formatearCantidadEmpanadas(prod.cantidad);
    }

    /* ===== Card ===== */

    const item = document.createElement('div');
    item.className = 'pedido-card';

    item.innerHTML = `
      <div class="pedido-info">
        <h6>${nombreMostrar}</h6>
        ${descripcionMostrar ? `<p class="desc">${descripcionMostrar}</p>` : ''}
        <p class="cantidad">Cantidad: ${cantidadMostrar}</p>
      </div>

      <div class="pedido-precio">
        <strong>${formatearPrecio(subtotal)}</strong>
        <button class="btn-eliminar" data-id="${prod.id}">
          Eliminar
        </button>
        <button class="btn-modificar" data-id="${prod.id}">
          Modificar
        </button>
      </div>
    `;

    contenedor.appendChild(item);
  });

  totalEl.textContent = formatearPrecio(total);
}


function formatearCantidadPizza(cantidad) {
  if (cantidad === 0.5) return '1/2';

  if (Number.isInteger(cantidad)) {
    return String(cantidad);
  }

  const enteros = Math.floor(cantidad);
  return `${enteros} y 1/2`;
}

function formatearCantidadEmpanadas(cantidad) {
  if (cantidad === 0.5) return '1/2 docena';

  if (Number.isInteger(cantidad)) {
    return cantidad === 1
      ? '1 docena'
      : `${cantidad} docenas`;
  }

  const enteros = Math.floor(cantidad);
  return `${enteros} docenas y 1/2`;
}
