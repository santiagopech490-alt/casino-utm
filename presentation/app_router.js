/**
 * =========================================
 * SPA ROUTER - CASINO UTM (Versión 2.0)
 * Manejo de navegación y carga dinámica.
 * =========================================
 */

const ROUTES = {
    welcome: {
        title: 'Bienvenida',
        view: 'presentation/views/welcome.html',
        controller: null, // No necesita controlador complejo
        css: null,
        init: 'initWelcome'
    },
    game1: {
        title: 'La Falacia del Jugador',
        view: 'presentation/views/game1_falacia.html',
        controller: './controllers/game1_controller.js', // Singular
        css: 'assets/css/game1.css',
        init: 'initGame1'
    },
    game2: {
        title: '¿Puedes ganarle al casino?',
        view: 'presentation/views/game2_ruleta.html',
        controller: './controllers/game2_controller.js',
        css: 'assets/css/game2.css',
        init: 'initGame2'
    }
    };

let currentCSSLink = null;

export const loadRoute = async (routeKey) => {
    const route = ROUTES[routeKey];
    if (!route) return;

    const mainContent = document.getElementById('main-content');
    const gameTitle = document.getElementById('current-game-title');

    try {
        // 1. CSS
        if (currentCSSLink) currentCSSLink.remove();
        if (route.css) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${route.css}?v=${new Date().getTime()}`;
            document.head.appendChild(link);
            currentCSSLink = link;
        }

        // 2. HTML
        const response = await fetch(route.view);
        const html = await response.text();
        mainContent.innerHTML = html;

        // 3. UI
        gameTitle.textContent = route.title;
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === routeKey);
        });

        // 4. Controlador
        if (routeKey === 'welcome') {
            initWelcome();
        } else if (route.controller) {
            const module = await import(`${route.controller}?v=${new Date().getTime()}`);
            if (module[route.init]) module[route.init]();
        }

    } catch (error) {
        console.error('[Router Error]', error);
        mainContent.innerHTML = `<div class="error-panel">Error: ${error.message}</div>`;
    }
};

/**
 * Inicializador específico para la pantalla de bienvenida
 */
const initWelcome = () => {
    const btnStart = document.getElementById('btn-start-game1');
    if (btnStart) {
        btnStart.onclick = () => loadRoute('game1');
    }
};

export const initRouter = () => {
    // Delegación de eventos para los botones laterales
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-btn');
        if (btn) {
            const target = btn.getAttribute('data-target');
            loadRoute(target);
        }
    });

    // Carga inicial: Pantalla de Bienvenida
    loadRoute('welcome');
};
