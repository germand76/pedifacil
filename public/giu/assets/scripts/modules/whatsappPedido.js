import { obtenerPedido } from './pedidoStore.js';
import { formatearPrecio, WHATSAPP_NUMERO } from './config.js';

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


export function generarMensajeWhatsApp(datosCliente) {
  const pedido = obtenerPedido();

  let mensaje = '';
  mensaje += `🛒 *NUEVO PEDIDO*\n\n`;

  mensaje += `👤 *CLIENTE:*\n`;
  mensaje += `${datosCliente.apeynomb}\n\n`;

  mensaje += `🏷️ *MESA: ${datosCliente.nromesa}*\n\n`;

  mensaje += `📋 *PEDIDO:*\n`;

  let total = 0;

  Object.values(pedido).forEach((prod) => {
    const precio = Number(prod.precio) || 0;
    const cantidad = Number(prod.cantidad) || 0;
    const subtotal = precio * cantidad;
    total += subtotal;

    let titulo = prod.nombre;
    let detalle = '';
    let cantidadTexto = cantidad;

    /* ===== Ajustes por categoría ===== */

    if (Number(prod.id_categoria) === 1) {
      // Pizza
      titulo = 'Pizza';
      detalle = prod.nombre;
      cantidadTexto = formatearCantidadPizza(cantidad);
    } else if (Number(prod.id_categoria) === 4) {
      // Empanadas
      titulo = 'Empanadas';
      detalle = prod.nombre;
      cantidadTexto = formatearCantidadEmpanadas(cantidad);
    } else {
      // Resto (promos, hamburguesas, etc.)
      titulo = prod.nombre;
      detalle = prod.descripcion;
      cantidadTexto = cantidad;
    }

    /* ===== Render línea ===== */

    mensaje += `• *${titulo}*\n`;

    if (detalle) {
      mensaje += `  - ${detalle}\n`;
    }

    mensaje += `  Cantidad: ${cantidadTexto}\n\n`;
  });

  mensaje += `💰 *Total del Pedido:* ${formatearPrecio(total)}\n`;

  return mensaje;
}

export function generarMensajeCuentaWhatsApp(datosCliente) {
    const pedido = obtenerPedido();
  
    let total = 0;
    Object.values(pedido).forEach(p => {
      total += Number(p.precio) * Number(p.cantidad);
    });
  
    // let mensaje = '';
    // mensaje += `🧾 *SOLICITUD DE CUENTA*\n\n`;
    // mensaje += `👤 Cliente: ${datosCliente.apeynomb}\n`;
    // mensaje += `🪑 Mesa: ${datosCliente.nromesa}\n`;
    // mensaje += `💳 Forma de pago: ${datosCliente.formaPago}\n`;
    // mensaje += `💰 Total: ${formatearPrecio(total)}\n`;


    const mensaje =
    `🧾 *SOLICITUD PAGO DE LA CUENTA* \n\n
    👤 *CLIENTE:* ${datosCliente.apeynomb} \n
    🪑 *NÚMERO DE MESA:* ${datosCliente.nromesa} \n
    💳 *FORMA DE PAGO:* ${datosCliente.formaPago} \n
    💰 *TOTAL A PAGAR:* ${formatearPrecio(total)}
    `;
  
    return mensaje;
  }

export function enviarPedidoPorWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje);
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
  window.open(url, '_blank', 'noopener');
}
