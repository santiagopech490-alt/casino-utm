import * as ProbEngine from '../../domain/probability_engine.js';
import * as Rules from '../../domain/game_rules.js';

let gameState = {
    chips: 100,
    rounds: 0,
    history: [],
    selectedColor: null,
    currentBet: 10,
    isAnimating: false,
    gameOver: false,
    totalRotation: 0 // Para que la rotación sea acumulativa y no salte
};

let ui = {};

export const initGame2 = () => {
    cacheDOM();
    if (!ui.container) return;
    
    bindEvents();
    resetGameState();
    updateUI();
};

const cacheDOM = () => {
    const container = document.querySelector('.game-container');
    if (!container) return;

    ui = {
        container,
        wheel: container.querySelector('#roulette-wheel'),
        resultNumber: container.querySelector('#result-number'),
        resultColorText: container.querySelector('#result-color-text'),
        betRange: container.querySelector('#bet-range'),
        betDisplay: container.querySelector('#bet-display'),
        btnSpin: container.querySelector('#btn-spin'),
        btnWithdraw: container.querySelector('#btn-withdraw'),
        statChips: container.querySelector('#stat-chips'),
        statRounds: container.querySelector('#stat-rounds'),
        statLastPayout: container.querySelector('#stat-last-payout'),
        historyContainer: container.querySelector('#history-container'),
        conclusion: container.querySelector('#game-conclusion'),
        conclusionText: container.querySelector('#conclusion-text'),
        btnRestart: container.querySelector('#btn-restart-game2'),
        colorButtons: container.querySelectorAll('.btn-bet-color')
    };
};

const bindEvents = () => {
    ui.betRange.oninput = (e) => {
        gameState.currentBet = parseInt(e.target.value);
        ui.betDisplay.textContent = gameState.currentBet;
    };

    ui.colorButtons.forEach(btn => {
        btn.onclick = () => selectColor(btn.getAttribute('data-color'));
    });

    ui.btnSpin.onclick = handleSpin;
    ui.btnWithdraw.onclick = () => showConclusion(false);
    ui.btnRestart.onclick = resetGameState;
};

const selectColor = (color) => {
    if (gameState.isAnimating || gameState.gameOver) return;
    gameState.selectedColor = color;
    ui.colorButtons.forEach(btn => {
        btn.classList.toggle('active-selection', btn.getAttribute('data-color') === color);
    });
    ui.btnSpin.disabled = false;
};

const handleSpin = async () => {
    if (gameState.isAnimating || gameState.gameOver) return;

    const validation = Rules.validateBet(gameState.chips, gameState.currentBet);
    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    gameState.isAnimating = true;
    ui.btnSpin.disabled = true;
    ui.btnWithdraw.disabled = true;

    // Obtener resultado matemático
    const result = ProbEngine.spinRoulette();
    const payout = ProbEngine.calculatePayout(gameState.currentBet, gameState.selectedColor, result.color);

    // Animación visual
    await animateWheel(result);

    // Actualizar estado
    gameState.chips += payout;
    gameState.rounds++;
    gameState.history.push(result.color);
    
    // UI
    ui.statLastPayout.textContent = payout > 0 ? `+${payout}` : payout;
    ui.statLastPayout.className = `stat-value ${payout > 0 ? 'text-neon-green' : (payout < 0 ? 'text-neon-red' : '')}`;
    
    updateUI();

    // Comprobar bancarrota
    if (gameState.chips <= -1000) {
        showConclusion(true);
    }

    gameState.isAnimating = false;
    ui.btnSpin.disabled = false;
    ui.btnWithdraw.disabled = false;
};

const animateWheel = (result) => {
    return new Promise((resolve) => {
        // La rotación siempre aumenta para que gire hacia adelante
        // 1800 grados = 5 vueltas completas mínimas
        gameState.totalRotation += 1800 + Math.random() * 360; 
        
        ui.wheel.style.transition = 'transform 3s cubic-bezier(0.1, 0, 0.1, 1)';
        ui.wheel.style.transform = `rotate(${gameState.totalRotation}deg)`;

        // Mostramos el resultado al final de la animación
        setTimeout(() => {
            ui.resultNumber.textContent = result.number;
            ui.resultColorText.textContent = result.color;
            ui.resultColorText.className = `color-${result.color}`;
            resolve();
        }, 3000);
    });
};

const updateUI = () => {
    ui.statChips.textContent = gameState.chips;
    ui.statChips.classList.toggle('text-neon-red', gameState.chips < 0);
    ui.statChips.classList.toggle('text-neon-blue', gameState.chips >= 0);
    
    ui.statRounds.textContent = gameState.rounds;

    // Historial
    ui.historyContainer.innerHTML = '';
    gameState.history.slice(-15).forEach(color => {
        const dot = document.createElement('div');
        dot.className = `history-dot bg-${color}`;
        ui.historyContainer.appendChild(dot);
    });
};

const showConclusion = (isBankruptcy) => {
    gameState.gameOver = true;
    ui.conclusion.classList.remove('hidden');
    ui.conclusion.classList.add('animate-slide-up');
    
    const houseEdgeMsg = "Matemáticamente, el casino siempre tiene la ventaja debido al espacio verde (0).";
    
    if (isBankruptcy) {
        ui.conclusionText.innerHTML = `<strong>¡Bancarrota!</strong> Has alcanzado el límite de deuda. <br><br> ${houseEdgeMsg} Mientras más juegas, más probable es que la ventaja de la casa del 2.7% consuma tus fichas.`;
    } else {
        ui.conclusionText.innerHTML = `<strong>Te has retirado con ${gameState.chips} fichas.</strong> <br><br> ${houseEdgeMsg} La ley de los grandes números demuestra que la única forma segura de no perder dinero en un casino es no jugar.`;
    }
};

const resetGameState = () => {
    gameState = {
        chips: 100,
        rounds: 0,
        history: [],
        selectedColor: null,
        currentBet: 10,
        isAnimating: false,
        gameOver: false,
        totalRotation: 0
    };
    
    ui.wheel.style.transition = 'none';
    ui.wheel.style.transform = 'rotate(0deg)';
    
    ui.conclusion.classList.add('hidden');
    ui.btnSpin.disabled = true;
    ui.btnWithdraw.disabled = false;
    ui.resultNumber.textContent = "--";
    ui.resultColorText.textContent = "Gira la ruleta";
    ui.resultColorText.className = "";
    ui.statLastPayout.textContent = "0";
    
    ui.colorButtons.forEach(btn => btn.classList.remove('active-selection'));
    updateUI();
};
