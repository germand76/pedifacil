const CACHE_KEYS = {
    categorias: 'cache_categorias_v1',
    productos: 'cache_productos_v1'
  };
  
  let categoriasMem = null;
  let productosMem = null;
  
  /**
   * Descarga y cachea categorías.
   * - Primero intenta memoria
   * - Luego sessionStorage
   * - Luego fetch
   */
  export async function getCategorias() {
    if (categoriasMem) return categoriasMem;
  
    const guardado = sessionStorage.getItem(CACHE_KEYS.categorias);
    if (guardado) {
      categoriasMem = JSON.parse(guardado);
      return categoriasMem;
    }
  
    const res = await fetch('data/categorias.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo cargar categorias.json');
  
    categoriasMem = await res.json();
    sessionStorage.setItem(CACHE_KEYS.categorias, JSON.stringify(categoriasMem));
  
    return categoriasMem;
  }
  
  /**
   * Descarga y cachea productos.
   * - Primero intenta memoria
   * - Luego sessionStorage
   * - Luego fetch
   */
  export async function getProductos() {
    if (productosMem) return productosMem;
  
    const guardado = sessionStorage.getItem(CACHE_KEYS.productos);
    if (guardado) {
      productosMem = JSON.parse(guardado);
      return productosMem;
    }
  
    const res = await fetch('data/productos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo cargar productos.json');
  
    productosMem = await res.json();
    sessionStorage.setItem(CACHE_KEYS.productos, JSON.stringify(productosMem));
  
    return productosMem;
  }
  
  /**
   * Si actualizás JSON y querés forzar reload sin recargar la página.
   */
  export function limpiarCacheData() {
    categoriasMem = null;
    productosMem = null;
    sessionStorage.removeItem(CACHE_KEYS.categorias);
    sessionStorage.removeItem(CACHE_KEYS.productos);
  }
  