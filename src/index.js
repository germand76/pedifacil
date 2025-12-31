export default {
    async fetch(request, env) {
      const url = new URL(request.url);
  
      // Rutas limpias -> archivos .html
      const rewrites = new Map([
        ["/giu/menu", "/giu/menu.html"],
        ["/giu/pedido", "/giu/pedido.html"],
        ["/giu/checkout", "/giu/checkout.html"],
        ["/giu/post-pedido", "/giu/post-pedido.html"],
        ["/giu/finalizar-pedido", "/giu/finalizar-pedido.html"],
        ["/giu", "/giu/menu.html"],
        ["/", "/giu/menu.html"], // opcional: raíz al menú
      ]);
  
      const target = rewrites.get(url.pathname);
      if (target) {
        url.pathname = target;
        return env.ASSETS.fetch(new Request(url.toString(), request));
      }
  
      // fallback: assets normales
      return env.ASSETS.fetch(request);
    }
  };
  