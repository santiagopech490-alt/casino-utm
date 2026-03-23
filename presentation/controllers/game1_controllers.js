import * as ProbEngine from '../../domain/probability_engine.js';

// Estado global persistente mientras la vista esté cargada
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
 */
export const initGame1 = () => {
    cacheDOM();
    if (!ui.container) return;
    
    bindEvents();
    
    // Al reinicializar (ej. al volver a la pestaña), 
    // mantenemos el historial pero reseteamos el estado de animación
    gameState.isAnimating = false;
    
    // Reflejar estado actual en la UI
    updateUI();
    
    // Habilitar botón de lanzamiento si hay una elección previa
    if (gameState.userCurrentChoice) {
        ui.btnFlip1.disabled = false;
        selectChoice(gameState.userCurrentChoice);
    }

    console.log('[Game1 Controller] Inicializado correctamente.');
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
    if (!ui.btnCara) return;

    ui.btnCara.onclick = () => selectChoice('cara');
    ui.btnCruz.onclick = () => selectChoice('cruz');
    ui.btnFlip1.onclick = handleSingleFlip;
    ui.btnFlip20.onclick = handleBatchSimulation;
};

const selectChoice = (choice) => {
    if (gameState.isAnimating) return;
    
    gameState.userCurrentChoice = choice;
    
    // Estilo visual de selección
    ui.btnCara.classList.toggle('active-selection', choice === 'cara');
    ui.btnCruz.classList.toggle('active-selection', choice === 'cruz');
    
    ui.btnFlip1.disabled = false;
};

const handleSingleFlip = async () => {
    if (gameState.isAnimating || !gameState.userCurrentChoice) return;
    
    gameState.isAnimating = true;
    ui.btnFlip1.disabled = true;
    ui.btnFlip20.disabled = true;

    const result = ProbEngine.flipCoinPure();
    gameState.history.push(result);

    // Registrar acierto/fallo
    if (result === gameState.userCurrentChoice) {
        gameState.userHits++;
    } else {
        gameState.userMisses++;
    }

    // Ejecutar animación de la moneda
    await animateCoin(result);
    
    // Actualizar toda la interfaz
    updateUI();
    
    // Liberar controles
    gameState.isAnimating = false;
    ui.btnFlip1.disabled = false;
    ui.btnFlip20.disabled = false;
};

const handleBatchSimulation = () => {
    if (gameState.isAnimating) return;
    
    const batchResults = ProbEngine.simulateBatchFlips(20);
    gameState.history.push(...batchResults);
    
    updateUI();
};

const animateCoin = (result) => {
    return new Promise((resolve) => {
        // Reset clase para permitir repetir animación
        ui.coin.className = 'coin';
        
        // Forzar reflow
        void ui.coin.offsetWidth; 
        
        // Aplicar clase de giro
        const flipClass = result === 'cara' ? 'animate-flip-cara' : 'animate-flip-cruz';
        ui.coin.classList.add(flipClass);

        // Esperar tiempo de la animación CSS (1.2s en game1.css)
        setTimeout(() => {
            resolve();
        }, 1200);
    });
};

const updateUI = () => {
    if (!ui.stats) return;

    const stats = ProbEngine.calculateCoinStats(gameState.history);
    
    // 1. Números principales
    ui.stats.total.textContent = stats.total;
    ui.stats.caras.textContent = stats.caras;
    ui.stats.cruces.textContent = stats.cruces;
    ui.stats.percCaras.textContent = `${stats.percCaras}%`;
    ui.stats.percCruces.textContent = `${stats.percCruces}%`;
    
    // 2. Aciertos y Fallos
    ui.stats.hits.textContent = gameState.userHits;
    ui.stats.misses.textContent = gameState.userMisses;

    // 3. Timeline (Burbujas de historial)
    ui.timeline.innerHTML = '';
    const recent = gameState.history.slice(-10);
    recent.forEach(res => {
        const bubble = document.createElement('div');
        bubble.className = `timeline-bubble ${res === 'cara' ? 'bubble-cara' : 'bubble-cruz'}`;
        bubble.textContent = res === 'cara' ? 'C' : 'X';
        ui.timeline.appendChild(bubble);
    });

    // 4. Conclusión dinámica
    if (stats.total >= 15) {
        ui.conclusion.classList.remove('hidden');
        ui.conclusion.classList.add('animate-slide-up');
        ui.conclusionText.innerHTML = `Tras <strong>${stats.total}</strong> lanzamientos, la proporción es de <strong>${stats.percCaras}% Cara</strong> y <strong>${stats.percCruces}% Cruz</strong>. <br><br> La moneda no tiene memoria; cada tiro es una probabilidad <strong>independiente de 50/50</strong>, sin importar los resultados anteriores.`;
    }
};

/**
 * Función: Resetea el juego por completo.
 */
export const resetGame = () => {
    gameState = { 
        history: [], 
        userCurrentChoice: null, 
        userHits: 0, 
        userMisses: 0, 
        isAnimating: false 
    };
    if (ui.conclusion) ui.conclusion.classList.add('hidden');
    if (ui.btnFlip1) ui.btnFlip1.disabled = true;
    updateUI();
};
