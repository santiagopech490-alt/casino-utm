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
    },
    game3: {
        title: 'La carta que nunca sale',
        view: 'presentation/views/game3_cartas.html',
        controller: './controllers/game3_controller.js',
        css: 'assets/css/game3.css',
        init: 'initGame3'
    },
    game4: {
        title: 'Contagio en el Salón',
        view: 'presentation/views/game4_contagio.html',
        controller: './controllers/game4_controller.js',
        css: 'assets/css/game4.css',
        init: 'initGame4'
    },
    game5: {
        title: 'Tómbola de la Suerte',
        view: 'presentation/views/game5_tombola.html',
        controller: './controllers/game5_controller.js',
        css: 'assets/css/game5.css',
        init: 'initGame5'
    },
    game6: {
        title: 'Gacha Card Simulator',
        view: 'presentation/views/game6_gacha.html',
        controller: './controllers/game6_controller.js',
        css: 'assets/css/game6.css',
        init: 'initGame6'
    },
    game7: {
        title: 'Percepción de Patrones',
        view: 'presentation/views/game7_patrones.html',
        controller: './controllers/game7_controller.js',
        css: 'assets/css/game7.css',
        init: 'initGame7'
    },
    game8: {
        title: 'La Ilusión de la Precisión',
        view: 'presentation/views/game8_slots.html',
        controller: './controllers/game8_controller.js',
        css: 'assets/css/game8.css',
        init: 'initGame8'
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
