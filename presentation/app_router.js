/**
 * =========================================
 * SPA ROUTER - CASINO UTM (Versión Sin CORS)
 * Compatible con protocolo file://
 * =========================================
 */

// Registro de Vistas (Templates HTML como strings para evitar fetch)
const VIEW_TEMPLATES = {
    game1: `
    <div class="glass-panel game-container animate-fade-in">
        <header class="game-header">
            <h1 class="text-neon-purple">La Falacia del Jugador</h1>
            <div class="myth-box glass-panel-dark">
                <p><strong>El Mito:</strong> "Si algo ha pasado muchas veces seguidas, ahora es menos probable que vuelva a pasar."</p>
            </div>
        </header>
        <div class="coin-section">
            <div class="coin-wrapper">
                <div id="coin" class="coin">
                    <div class="side-a">C</div> <div class="side-b">X</div>
                </div>
            </div>
            <div id="sequence-timeline" class="timeline-flex"></div>
        </div>
        <div class="game-controls glass-panel-dark">
            <h3>Predecir siguiente lanzamiento:</h3>
            <div class="selection-group">
                <button class="glass-btn btn-choice" data-choice="cara"><span class="coin-icon">C</span> Cara</button>
                <button class="glass-btn btn-choice" data-choice="cruz"><span class="coin-icon">X</span> Cruz</button>
            </div>
            <div class="action-group">
                <button id="btn-flip-1" class="glass-btn primary-btn" disabled>Lanzar 1x1</button>
                <button id="btn-flip-20" class="glass-btn secondary-btn">Simular 20 lanzamientos</button>
            </div>
        </div>
        <section class="stats-tracker">
            <div class="glass-panel-dark stat-card"><span class="stat-label">Total</span><strong id="stat-total" class="stat-value text-neon-blue">0</strong></div>
            <div class="glass-panel-dark stat-card"><span class="stat-label">Caras</span><strong id="stat-caras" class="stat-value">0</strong><span id="perc-caras" class="stat-perc">0%</span></div>
            <div class="glass-panel-dark stat-card"><span class="stat-label">Cruces</span><strong id="stat-cruces" class="stat-value">0</strong><span id="perc-cruces" class="stat-perc">0%</span></div>
            <div class="glass-panel-dark stat-card success-card"><span class="stat-label">Aciertos</span><strong id="stat-hits" class="stat-value text-neon-green">0</strong></div>
        </section>
        <footer id="game-conclusion" class="conclusion-box glass-panel-dark hidden">
            <h3 class="text-neon-green">¡Mito Rompido!</h3>
            <p id="conclusion-text"></p>
        </footer>
    </div>`
};

const ROUTES = {
    game1: {
        title: 'La Falacia del Jugador',
        css: 'assets/css/game1.css'
    }
};

let currentCSSLink = null;

export const loadRoute = async (routeKey) => {
    const route = ROUTES[routeKey];
    const template = VIEW_TEMPLATES[routeKey];
    if (!route || !template) return;

    const mainContent = document.getElementById('main-content');
    const gameTitle = document.getElementById('current-game-title');

    // 1. Cargar CSS (Esto sí funciona en local en la mayoría de navegadores)
    if (currentCSSLink) currentCSSLink.remove();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = route.css;
    document.head.appendChild(link);
    currentCSSLink = link;

    // 2. Inyectar HTML desde el string (Sin fetch)
    mainContent.innerHTML = template;
    gameTitle.textContent = route.title;

    // 3. Inicializar Controlador (Carga estática)
    // Importamos el controlador normalmente (requiere servidor) 
    // o lo llamamos si ya está cargado.
    try {
        const module = await import('./controllers/game1_controllers.js');
        module.initGame1();
    } catch (e) {
        console.warn("Error de CORS detectado. Para funcionalidad completa, usa un servidor local.");
        // Si estás en file://, esto fallará. La solución real es usar Live Server.
    }
};

export const initRouter = () => {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => loadRoute(btn.getAttribute('data-target'));
    });
    loadRoute('game1');
};
