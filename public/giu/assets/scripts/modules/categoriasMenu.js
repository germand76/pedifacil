import { renderProductos } from './productosRenderer.js';
import { CATEGORIAS_ENTERAS } from './config.js';
import { getCategorias, getProductos } from './dataCache.js';

/* =================================================
   INIT CATEGORÍAS
================================================= */

export async function initCategoriasMenu(config) {
  const { categoriasContainer, categoriaInicial } = config;

  let categorias = [];

  try {
    categorias = await getCategorias();
  } catch (err) {
    console.error('Error cargando categorías', err);
    return;
  }

  categorias = categorias
    .filter(cat => cat.activo)
    .sort((a, b) => a.orden - b.orden);

  categoriasContainer.innerHTML = '';

  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'categoria-btn';
    btn.textContent = cat.nombre;
    btn.dataset.id = cat.id;

    btn.addEventListener('click', () => {
      seleccionarCategoria(cat.id);
    });

    categoriasContainer.appendChild(btn);
  });

  const inicial = categoriaInicial ?? categorias[0]?.id;
  if (inicial) seleccionarCategoria(inicial);
}

/* =================================================
   SELECCIONAR CATEGORÍA
================================================= */

async function seleccionarCategoria(idCategoria) {
  marcarCategoriaActiva(idCategoria);

  const tipoCantidad = CATEGORIAS_ENTERAS.includes(Number(idCategoria))
    ? 'entera'
    : 'fraccionada';

  let productos = [];

  try {
    productos = await getProductos();
  } catch (err) {
    console.error('Error cargando productos', err);
    return;
  }

  const productosFiltrados = productos.filter(prod =>
    Number(prod.id_categoria) === Number(idCategoria) && prod.activo
  );

  renderProductos(
    productosFiltrados,
    document.getElementById('productos'),
    tipoCantidad
  );

  const btn = document.querySelector(
    `.categoria-btn[data-id="${idCategoria}"]`
  );

  if (btn) {
    document.getElementById('titulo-categoria').textContent = btn.textContent;
  }

  sessionStorage.setItem('categoriaActiva', String(idCategoria));
}

/* =================================================
   UI CATEGORÍA ACTIVA
================================================= */

function marcarCategoriaActiva(idCategoria) {
  document.querySelectorAll('.categoria-btn').forEach(btn => {
    btn.classList.toggle(
      'activa',
      Number(btn.dataset.id) === Number(idCategoria)
    );
  });
}
