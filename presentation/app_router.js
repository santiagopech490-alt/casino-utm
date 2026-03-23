/**
 * =========================================
 * SPA ROUTER - CASINO UTM (Versión de Alto Rendimiento)
 * Forzado de caché para reflejar cambios inmediatos.
 * =========================================
 */

const ROUTES = {
    game1: {
        title: 'La Falacia del Jugador',
        view: 'presentation/views/game1_falacia.html',
        controller: './controllers/game1_controller.js', // Singular
        css: 'assets/css/game1.css',
        init: 'initGame1'
    }
};

let currentCSSLink = null;

export const loadRoute = async (routeKey) => {
    const route = ROUTES[routeKey];
    if (!route) return;

    const mainContent = document.getElementById('main-content');
    const gameTitle = document.getElementById('current-game-title');

    try {
        // 1. Limpiar y Forzar CSS
        if (currentCSSLink) currentCSSLink.remove();
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${route.css}?v=${new Date().getTime()}`; // Romper caché de CSS
        document.head.appendChild(link);
        currentCSSLink = link;

        // 2. Inyectar HTML
        const response = await fetch(route.view);
        const html = await response.text();
        mainContent.innerHTML = html;

        // 3. UI
        gameTitle.textContent = route.title;
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === routeKey);
        });

        // 4. Importar Controlador con Marca de Tiempo (Rompe caché de JS)
        const module = await import(`${route.controller}?v=${new Date().getTime()}`);
        if (module[route.init]) {
            module[route.init]();
            console.log(`[Router] ${route.title} cargado y ejecutado correctamente.`);
        }

    } catch (error) {
        console.error('[Router Critical Error]', error);
        mainContent.innerHTML = `<div style="padding:20px; color:#ff4d4d;">Error al cargar: ${error.message}</div>`;
    }
};

export const initRouter = () => {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-btn');
        if (btn) {
            const target = btn.getAttribute('data-target');
            loadRoute(target);
        }
    });

    // Carga inicial
    loadRoute('game1');
};
