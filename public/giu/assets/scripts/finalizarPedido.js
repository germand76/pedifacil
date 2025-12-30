document.addEventListener('DOMContentLoaded', () => {

    const btnFinalizar = document.getElementById('btn-finalizar');
  
    btnFinalizar.addEventListener('click', () => {
  
      sessionStorage.clear();
  
      Swal.fire({
        icon: 'success',
        title: 'Pedido Finalizado',
        html: '<p><strong>Gracias</strong> por Visitarnos!<p><p><strong>Gracias</strong> por Elegirnos!</p>',
        allowOutsideClick: false,
        confirmButtonText: 'Cerrar'
      }).then(() => {
        window.close();

        setTimeout(() => {
            window.location.href = 'menu.html';
          }, 300);
      });
  
    });
  
  });
  