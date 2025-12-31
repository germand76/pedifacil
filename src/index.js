export default {
    async fetch(request, env) {
      try {
        const url = new URL(request.url);
        const path = url.pathname.replace(/\/+$/, ""); // sin slash final
  
        // Split de ruta: /bar/accion
        const parts = path.split("/").filter(Boolean);
        const bar = parts[0];
        const page = parts[1] || "menu";
  
        // Si no hay bar → redirigir al default
        if (!bar) {
          return Response.redirect(`${url.origin}/giu/menu`, 302);
        }
  
        // Construir path al HTML
        const htmlPath = `/${bar}/${page}.html`;
        const assetUrl = new URL(htmlPath, url.origin);
  
        // Intentar servir el HTML
        const response = await env.ASSETS.fetch(assetUrl);
  
        // Si existe → devolverlo
        if (response.status !== 404) {
          return response;
        }
  
        // Si NO existe → fallback al menu del bar
        return Response.redirect(`${url.origin}/${bar}/menu`, 302);
  
      } catch (err) {
        // Nunca dejar caer el Worker
        return new Response("Internal Worker Error", { status: 500 });
      }
    }
  };
  