export const CATEGORIAS_ENTERAS = [2, 3, 6];
export const WHATSAPP_NUMERO = '5492346555664';
// export const WHATSAPP_NUMERO = '5492346589991';

const formatterARS = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  export function formatearPrecio(valor) {
    const numero = Number(valor) || 0;
    return `$${formatterARS.format(numero)}`;
  }