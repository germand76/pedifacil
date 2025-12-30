import {generarMensajeCuentaWhatsApp, enviarPedidoPorWhatsApp} from './modules/whatsappPedido.js';

document.addEventListener('DOMContentLoaded', () => {

  const btnModificar = document.getElementById('btn-modificar-pedido');
  const btnCuenta = document.getElementById('btn-quiero-cuenta');

  btnModificar.addEventListener('click', () => {
    window.location.href = 'pedido.html';
  });


  btnCuenta.addEventListener('click', () => {

    const nombre = sessionStorage.getItem('checkout_nombre');
    const mesa = sessionStorage.getItem('checkout_mesa');
    const formaPago = sessionStorage.getItem('checkout_pago');
    // const pedido = obtenerPedido();

    // if (!nombre || !mesa || !formaPago || !pedido || Object.keys(pedido).length === 0) {
    if (!nombre || !mesa || !formaPago) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'No se pudieron recuperar los datos necesarios para solicitar la cuenta.'
      });
      return;
    }

    const mensaje = generarMensajeCuentaWhatsApp({
        apeynomb: nombre,
        nromesa: mesa,
        formaPago: formaPago
    });

    Swal.fire({
      icon: 'info',
      title: 'Solicitar Pago de la Cuenta',
      html: `
        <p>Te vamos a redirigir a WhatsApp para que nos envíes tu solicitud de Pagar la cuenta.</p>
        <p>Lo único que tenes que hacer es presionar el botón de <strong>Enviar</strong> el mensaje para que nos llegue la notificación.</p><br>
        <p><strong>En breve te cobramos!</strong></p><br>
        <p><strong>POR FAVOR, NO CIERRES LA PÁGINA</strong> así finalizas el pedido</p>
      `,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then(() => {
        enviarPedidoPorWhatsApp(mensaje);

        setTimeout(() => {
          window.location.href = 'finalizar-pedido.html';
        }, 300);
    });
  });
});
