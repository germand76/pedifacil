const STORAGE_KEY = 'pedido'; // único store

export function obtenerPedido() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
}

export function guardarPedido(pedido) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pedido));
}

export function setProductoEnPedido(producto, cantidad) {
  const pedido = obtenerPedido();

  const qty = Number(cantidad) || 0;

  if (qty <= 0) {
    delete pedido[producto.id];
  } else {
    pedido[producto.id] = {
      id: String(producto.id),
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: Number(producto.precio),
      cantidad: qty,
      id_categoria: Number(producto.id_categoria)
    };
  }

  guardarPedido(pedido);
}

export function totalItemsPedido() {
  const pedido = obtenerPedido();
  return Object.values(pedido).reduce((acc, p) => acc + Number(p.cantidad || 0), 0);
}
