import * as ProbEngine from '../../domain/probability_engine.js';

let gameState = { 
    history: [], 
    userCurrentChoice: null, 
    userHits: 0, 
    userMisses: 0, 
    isAnimating: false 
};

let ui = {};

/**
 * Función: Inicializa el Juego 1.
 * Vincula el controlador con la vista inyectada en el DOM.
 */
export const initGame1 = () => {
    cacheDOM();
    if (!ui.container) {
        console.error('[Game1 Controller] No se encontró .game-container en el DOM.');
        return;
    }
    bindEvents();
    resetGame();
    console.log('[Game1 Controller] Listo y vinculado con rastreo de fallos.');
};

const cacheDOM = () => {
    const container = document.querySelector('.game-container');
    if (!container) return;

    ui = {
        container,
        coin: container.querySelector('#coin'),
        timeline: container.querySelector('#sequence-timeline'),
        btnCara: container.querySelector('[data-choice="cara"]'),
        btnCruz: container.querySelector('[data-choice="cruz"]'),
        btnFlip1: container.querySelector('#btn-flip-1'),
        btnFlip20: container.querySelector('#btn-flip-20'),
        stats: {
            total: container.querySelector('#stat-total'),
            caras: container.querySelector('#stat-caras'),
            cruces: container.querySelector('#stat-cruces'),
            percCaras: container.querySelector('#perc-caras'),
            percCruces: container.querySelector('#perc-cruces'),
            hits: container.querySelector('#stat-hits'),
            misses: container.querySelector('#stat-misses')
        },
        conclusion: container.querySelector('#game-conclusion'),
        conclusionText: container.querySelector('#conclusion-text')
    };
};

const bindEvents = () => {
    if (!ui.btnCara || !ui.btnCruz) return;

    ui.btnCara.onclick = () => selectChoice('cara');
    ui.btnCruz.onclick = () => selectChoice('cruz');
    ui.btnFlip1.onclick = handleSingleFlip;
    ui.btnFlip20.onclick = handleBatchSimulation;
};

const selectChoice = (choice) => {
    gameState.userCurrentChoice = choice;
    ui.btnCara.classList.toggle('active-selection', choice === 'cara');
    ui.btnCruz.classList.toggle('active-selection', choice === 'cruz');
    ui.btnFlip1.disabled = false;
};

const handleSingleFlip = async () => {
    if (gameState.isAnimating || !gameState.userCurrentChoice) return;
    gameState.isAnimating = true;
    ui.btnFlip1.disabled = true;

    const result = ProbEngine.flipCoinPure();
    gameState.history.push(result);

    // Lógica de Acierto vs Fallo
    if (result === gameState.userCurrentChoice) {
        gameState.userHits++;
    } else {
        gameState.userMisses++;
    }

    await animateCoin(result);
    updateUI();
    
    gameState.isAnimating = false;
    ui.btnFlip1.disabled = false;
};

const handleBatchSimulation = () => {
    if (gameState.isAnimating) return;
    const batchResults = ProbEngine.simulateBatchFlips(20);
    gameState.history.push(...batchResults);
    updateUI(true);
};

const animateCoin = (result) => {
    return new Promise((resolve) => {
        ui.coin.className = 'coin';
        void ui.coin.offsetWidth; 
        ui.coin.classList.add(result === 'cara' ? 'animate-flip-cara' : 'animate-flip-cruz');
        setTimeout(resolve, 1200);
    });
};

const updateUI = (isBatch = false) => {
    const stats = ProbEngine.calculateCoinStats(gameState.history);
    
    // Actualizar Dashboard
    ui.stats.total.textContent = stats.total;
    ui.stats.caras.textContent = stats.caras;
    ui.stats.cruces.textContent = stats.cruces;
    ui.stats.percCaras.textContent = `${stats.percCaras}%`;
    ui.stats.percCruces.textContent = `${stats.percCruces}%`;
    ui.stats.hits.textContent = gameState.userHits;
    ui.stats.misses.textContent = gameState.userMisses;

    // Actualizar Línea de tiempo
    ui.timeline.innerHTML = '';
    gameState.history.slice(-10).forEach(res => {
        const bubble = document.createElement('div');
        bubble.className = `timeline-bubble ${res === 'cara' ? 'bubble-cara' : 'bubble-cruz'}`;
        bubble.textContent = res === 'cara' ? 'C' : 'X';
        ui.timeline.appendChild(bubble);
    });

    // Romper el mito tras 15 lanzamientos
    if (stats.total >= 15 && ui.conclusion.classList.contains('hidden')) {
        ui.conclusion.classList.remove('hidden');
        ui.conclusionText.innerHTML = `Tras <strong>${stats.total}</strong> lanzamientos... cada lanzamiento es <strong>independiente</strong>. La probabilidad es siempre <strong>50/50</strong>.`;
    }
};

const resetGame = () => {
    gameState = { 
        history: [], 
        userCurrentChoice: null, 
        userHits: 0, 
        userMisses: 0, 
        isAnimating: false 
    };
    ui.conclusion.classList.add('hidden');
    ui.btnFlip1.disabled = true;
    updateUI();
};
