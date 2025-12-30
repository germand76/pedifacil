import { generarOpcionesCantidadHTML } from './cantidades.js';
import { obtenerPedido } from './pedidoStore.js';
import { formatearPrecio } from './config.js';

/* =================================================
   RENDER PRODUCTOS
================================================= */

export function renderProductos(productos, contenedor, tipoCantidad) {
  if (!contenedor) return;

  // Limpieza eficiente
  contenedor.textContent = '';

  if (!productos || productos.length === 0) {
    contenedor.appendChild(renderEmptyState());
    return;
  }

  const pedido = obtenerPedido(); // restaurar cantidades
  const fragment = document.createDocumentFragment();

  productos.forEach(producto => {
    fragment.appendChild(
      crearCardProducto(producto, tipoCantidad, pedido)
    );
  });

  // 🔥 Un solo append → un solo reflow
  contenedor.appendChild(fragment);
}

/* =================================================
   CARD PRODUCTO
================================================= */

function crearCardProducto(producto, tipoCantidad, pedido) {
  const {
    id,
    nombre,
    descripcion,
    precio,
    id_categoria
  } = producto;

  const enPedido = pedido[String(id)];
  const cantidadInicial = enPedido ? Number(enPedido.cantidad) : 0;

  const card = document.createElement('article');
  card.className = 'producto';
  card.dataset.id = id;
  card.dataset.categoria = id_categoria;
  card.dataset.tipoCantidad = tipoCantidad;

  /* ---------- TÍTULO ---------- */
  const titulo = document.createElement('h6');
  titulo.textContent = nombre;

  /* ---------- DESCRIPCIÓN ---------- */
  if (descripcion) {
    const desc = document.createElement('p');
    desc.className = 'descripcion';
    desc.textContent = descripcion;
    card.appendChild(desc);
  }

  /* ---------- PRECIO ---------- */
  const precioEl = document.createElement('p');
  precioEl.className = 'precio';
  precioEl.textContent = formatearPrecio(precio);

  /* ---------- CONTROLES ---------- */
  const controles = tipoCantidad === 'entera'
    ? crearControlEntero(cantidadInicial)
    : crearControlFraccionado(cantidadInicial);

  card.append(
    titulo,
    precioEl,
    controles
  );

  return card;
}

/* =================================================
   CONTADOR ENTERO
================================================= */

function crearControlEntero(cantidadInicial) {
  const wrapper = document.createElement('div');
  wrapper.className = 'contador';

  const btnMenos = document.createElement('button');
  btnMenos.type = 'button';
  btnMenos.className = 'btn-menos';
  btnMenos.textContent = '-';

  const spanCantidad = document.createElement('span');
  spanCantidad.className = 'cantidad';
  spanCantidad.textContent = String(cantidadInicial);

  const btnMas = document.createElement('button');
  btnMas.type = 'button';
  btnMas.className = 'btn-mas';
  btnMas.textContent = '+';

  wrapper.append(
    btnMenos,
    spanCantidad,
    btnMas
  );

  return wrapper;
}

/* =================================================
   SELECT FRACCIONADO
================================================= */

function crearControlFraccionado(cantidadInicial) {
  const label = document.createElement('label');
  label.className = 'label-cantidad';
  label.textContent = 'Cantidad';

  const select = document.createElement('select');
  select.className = 'select-cantidad';

  // Usamos tu helper (HTML → DOM)
  select.innerHTML = `
    <option value="0">0</option>
    ${generarOpcionesCantidadHTML()}
  `;

  select.value = String(cantidadInicial);

  label.appendChild(select);

  return label;
}

/* =================================================
   EMPTY STATE
================================================= */

function renderEmptyState() {
  const p = document.createElement('p');
  p.className = 'sin-productos';
  p.textContent = 'No hay productos disponibles.';
  return p;
}
