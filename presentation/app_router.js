/**
 * =========================================
 * SPA ROUTER - CASINO UTM
 * =========================================
 */

const routes = {
    'welcome': {
        view: 'presentation/views/welcome.html',
        title: 'Casino UTM | Inicio',
        init: null
    },
    'game1': {
        view: 'presentation/views/game1_falacia.html',
        controller: 'presentation/controllers/game1_controller.js',
        css: 'assets/css/game1.css',
        title: 'La Falacia del Jugador',
        init: 'initGame1'
    },
    'game2': {
        view: 'presentation/views/game2_ruleta.html',
        controller: 'presentation/controllers/game2_controller.js',
        css: 'assets/css/game2.css',
        title: '¿Puedes Ganarle al Casino?',
        init: 'initGame2'
    },
    'game3': {
        view: 'presentation/views/game3_cartas.html',
        controller: 'presentation/controllers/game3_controller.js',
        css: 'assets/css/game3.css',
        title: 'La Carta que Nunca Sale',
        init: 'initGame3'
    },
    'game4': {
        view: 'presentation/views/game4_contagio.html',
        controller: 'presentation/controllers/game4_controller.js',
        css: 'assets/css/game4.css',
        title: 'Contagio en el Salón',
        init: 'initGame4'
    },
    'game5': {
        view: 'presentation/views/game5_tombola.html',
        controller: 'presentation/controllers/game5_controller.js',
        css: 'assets/css/game5.css',
        title: 'Suerte y N° de Intentos',
        init: 'initGame5'
    },
    'game6': {
        view: 'presentation/views/game6_gacha.html',
        controller: 'presentation/controllers/game6_controller.js',
        css: 'assets/css/game6.css',
        title: 'Gacha Card Simulator',
        init: 'initGame6'
    },
    'game7': {
        view: 'presentation/views/game7_patrones.html',
        controller: 'presentation/controllers/game7_controller.js',
        css: 'assets/css/game7.css',
        title: 'Percepción de Patrones',
        init: 'initGame7'
    },
    'game8': {
        view: 'presentation/views/game8_slots.html',
        controller: 'presentation/controllers/game8_controller.js',
        css: 'assets/css/game8.css',
        title: 'La Ilusión de la Precisión',
        init: 'initGame8'
    }
};

let currentCSS = null;

import * as Wallet from '../domain/wallet_manager.js';

export const navigateTo = async (routeId) => {
    // 0. Verificación de Deuda antes de cambiar
    const balance = Wallet.getBalance();
    if (balance < 0) {
        alert("No puedes irte le debes al casino. Salda tu deuda antes de cambiar de juego.");
        return;
    }

    const route = routes[routeId];
    if (!route) return;

    const mainContent = document.getElementById('main-content');
    const titleDisplay = document.getElementById('current-game-title');

    try {
        // 0. Limpieza: Detener loops de animación si existen
        if (window.currentGameStop && typeof window.currentGameStop === 'function') {
            window.currentGameStop();
            window.currentGameStop = null;
        }

        // 1. Cargar el fragmento HTML
        const response = await fetch(route.view);
        if (!response.ok) throw new Error('Error al cargar la vista');
        const html = await response.text();
        
        // 2. Limpiar y Cargar CSS dinámico
        unloadCSS();
        loadCSS(route.css);

        // 3. Inyectar HTML
        mainContent.innerHTML = html;
        if (titleDisplay) titleDisplay.textContent = route.title;

        // 4. Importar e inicializar el controlador (solo si existe función init)
        if (route.init) {
            const controller = await import(`./controllers/${routeId}_controller.js`);
            if (controller[route.init]) {
                controller[route.init]();
            }
        }

        // 5. Actualizar estado de navegación
        updateNavState(routeId);

    } catch (error) {
        console.error('[Router] Error:', error);
        mainContent.innerHTML = `<div class="error-message">Error al cargar el juego: ${error.message}</div>`;
    }
};

const loadCSS = (href) => {
    if (!href) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = 'dynamic-game-css';
    document.head.appendChild(link);
    currentCSS = link;
};

const unloadCSS = () => {
    const existingLink = document.getElementById('dynamic-game-css');
    if (existingLink) {
        existingLink.remove();
    }
};

const updateNavState = (routeId) => {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === routeId);
    });
};

export const initRouter = () => {
    // 1. Vincular botones de la barra lateral
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.target;
            navigateTo(target);
        });
    });

    // 2. Vincular botón de Salida al Menú Principal (con bloqueo de deuda)
    const btnExit = document.getElementById('btn-exit-to-welcome');
    if (btnExit) {
        btnExit.onclick = (e) => {
            e.preventDefault();
            const balance = Wallet.getBalance();
            if (balance < 0) {
                alert("No puedes irte le debes al casino");
                console.warn('[Security] Bloqueando regreso al menú por deuda:', balance);
                return;
            }
            navigateTo('welcome');
        };
    }

    // 3. Vincular clics delegados (para botones dentro de vistas dinámicas)
    document.getElementById('main-content').addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btn-start-game1') {
            navigateTo('game1');
        }
    });

    // 4. Navegar a la página de inicio por defecto
    navigateTo('welcome');
};
