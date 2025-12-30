import {
    generarMensajeWhatsApp,
    enviarPedidoPorWhatsApp
  } from './modules/whatsappPedido.js';
  
  document.addEventListener('DOMContentLoaded', () => {
    const btnEnviar = document.getElementById('btn-enviar');
    const btnVolver = document.getElementById('btn-volver');
  
    /* ===============================
       PRECARGAR DATOS SI EXISTEN
    =============================== */
    precargarDatosCheckout();
  
    /* ===============================
       VOLVER AL PEDIDO
    =============================== */
    btnVolver.addEventListener('click', () => {
      window.location.href = 'pedido.html';
    });
  
    /* ===============================
       VALIDAR Y ENVIAR
    =============================== */
    btnEnviar.addEventListener('click', () => {
      const nombre = document.getElementById('apeynomb').value.trim();
      const nromesa = document.getElementById('nromesa').value.trim();
      const pago = document.querySelector('input[name="forma_pago"]:checked');
  
      /* ---------- VALIDACIONES ---------- */
  
      if (!nombre) {
        return alertaError('Ingresá tu nombre');
      }
  
      if (!nromesa || Number(nromesa) <= 0) {
        return alertaError('Ingresá un número de mesa válido');
      }
  
      if (!pago) {
        return alertaError('Seleccioná una forma de pago');
      }
  
      /* ===============================
         GUARDAR EN SESSION STORAGE
      =============================== */
      sessionStorage.setItem('checkout_nombre', nombre);
      sessionStorage.setItem('checkout_mesa', nromesa);
      sessionStorage.setItem('checkout_pago', pago.value);
  
      const datosCliente = {
        apeynomb: nombre,
        nromesa,
        formaPago: pago.value
      };
  
      const mensaje = generarMensajeWhatsApp(datosCliente);
  
      Swal.fire({
        icon: 'success',
        title: 'PEDIDO LISTO',
        html: '<p>Por último, te vamos a redirigir a WhatsApp para que nos envíes el Pedido que armaste.</p><p>Lo único que tenes que hacer es presionar el botón de <strong>Enviar</strong> el mensaje para que nos llegue tu Pedido.</p><br><p><strong>NO CIERRES LA PÁGINA</strong> así podés modificar el pedido en caso de ser necesario o pedir la cuenta cuando tu quieras</p>',
        allowOutsideClick: false,
        confirmButtonText: 'Aceptar'
      }).then(() => {
        enviarPedidoPorWhatsApp(mensaje);
  
        setTimeout(() => {
          window.location.href = 'post-pedido.html';
        }, 300);
      });
    });
  });
  
  /* ===============================
     PRECARGA DE DATOS
  =============================== */
  function precargarDatosCheckout() {
    const nombreGuardado = sessionStorage.getItem('checkout_nombre');
    const mesaGuardada = sessionStorage.getItem('checkout_mesa');
    const pagoGuardado = sessionStorage.getItem('checkout_pago');
  
    if (nombreGuardado) {
      const inputNombre = document.getElementById('apeynomb');
      if (inputNombre) inputNombre.value = nombreGuardado;
    }
  
    if (mesaGuardada) {
      const inputMesa = document.getElementById('nromesa');
      if (inputMesa) inputMesa.value = mesaGuardada;
    }
  
    if (pagoGuardado) {
      const radioPago = document.querySelector(
        `input[name="forma_pago"][value="${pagoGuardado}"]`
      );
      if (radioPago) radioPago.checked = true;
    }
  }
  
  /* ===============================
     ALERTA ERROR
  =============================== */
  function alertaError(mensaje) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: mensaje,
      allowOutsideClick: false,
      confirmButtonText: 'Aceptar'
    });
  }
  