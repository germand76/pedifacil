import { totalItemsPedido } from './pedidoStore.js';

export function actualizarBadgePedido() {
  const badge = document.getElementById('badge-pedido');
  if (!badge) return;

  const total = totalItemsPedido();
  badge.textContent = String(total);
  badge.style.display = total > 0 ? 'inline-flex' : 'none';
}
