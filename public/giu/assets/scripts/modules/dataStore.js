let categoriasCache = null;
let productosCache = null;

export async function getCategorias() {
  if (categoriasCache) return categoriasCache;

  const res = await fetch('data/categorias.json');
  categoriasCache = await res.json();
  return categoriasCache;
}

export async function getProductos() {
  if (productosCache) return productosCache;

  const res = await fetch('data/productos.json');
  productosCache = await res.json();
  return productosCache;
}
