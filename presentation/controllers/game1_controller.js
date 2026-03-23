import * as ProbEngine from '../../domain/probability_engine.js';

let gameState = { 
    history: [], 
    userCurrentChoice: null, 
    userHits: 0, 
    userMisses: 0, 
    isAnimating: false 
};

let ui = {};

export const initGame1 = () => {
    const setup = () => {
        cacheDOM();
        if (ui.container) {
            bindEvents();
            gameState.isAnimating = false;
            updateUI();
            if (gameState.userCurrentChoice) {
                ui.btnFlip1.disabled = false;
                selectChoice(gameState.userCurrentChoice);
            }
            console.log('[Game1] Vinculación exitosa.');
        } else {
            setTimeout(setup, 50);
        }
    };
    setup();
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
        btnReset: container.querySelector('#btn-reset'),
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
    ui.btnReset.onclick = resetGame;
};

const selectChoice = (choice) => {
    if (gameState.isAnimating) return;
    gameState.userCurrentChoice = choice;
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
    if (result === gameState.userCurrentChoice) gameState.userHits++;
    else gameState.userMisses++;
    await animateCoin(result);
    updateUI();
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
        ui.coin.className = 'coin';
        void ui.coin.offsetWidth; 
        ui.coin.classList.add(result === 'cara' ? 'animate-flip-cara' : 'animate-flip-cruz');
        setTimeout(resolve, 1200);
    });
};

const updateUI = () => {
    if (!ui.stats) return;
    const stats = ProbEngine.calculateCoinStats(gameState.history);
    ui.stats.total.textContent = stats.total;
    ui.stats.caras.textContent = stats.caras;
    ui.stats.cruces.textContent = stats.cruces;
    ui.stats.percCaras.textContent = `${stats.percCaras}%`;
    ui.stats.percCruces.textContent = `${stats.percCruces}%`;
    ui.stats.hits.textContent = gameState.userHits;
    ui.stats.misses.textContent = gameState.userMisses;
    ui.timeline.innerHTML = '';
    gameState.history.slice(-10).forEach(res => {
        const bubble = document.createElement('div');
        bubble.className = `timeline-bubble ${res === 'cara' ? 'bubble-cara' : 'bubble-cruz'}`;
        bubble.textContent = res === 'cara' ? 'C' : 'X';
        ui.timeline.appendChild(bubble);
    });
    if (stats.total >= 15) {
        ui.conclusion.classList.remove('hidden');
        ui.conclusion.classList.add('animate-slide-up');
        ui.conclusionText.innerHTML = `Tras <strong>${stats.total}</strong> lanzamientos... cada tiro es una probabilidad <strong>independiente de 50/50</strong>.`;
    }
};

export const resetGame = () => {
    gameState = { history: [], userCurrentChoice: null, userHits: 0, userMisses: 0, isAnimating: false };
    if (ui.conclusion) ui.conclusion.classList.add('hidden');
    if (ui.btnFlip1) ui.btnFlip1.disabled = true;
    updateUI();
};
