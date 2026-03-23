import * as ProbEngine from '../../domain/probability_engine.js';
import * as Rules from '../../domain/game_rules.js';

let gameState = {
    chips: 100,
    rounds: 0,
    history: [],
    selectedColor: null,
    currentBet: 10,
    isAnimating: false,
    gameOver: false
};

let ui = {};

export const initGame2 = () => {
    cacheDOM();
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
    ui.statLastPayout.className = `stat-value ${payout >= 0 ? 'text-neon-green' : 'text-neon-red'}`;
    
    updateUI();

    // Comprobar bancarrota o límites
    if (gameState.chips <= -1000) {
        showConclusion(true);
    }

    gameState.isAnimating = false;
    ui.btnSpin.disabled = false;
    ui.btnWithdraw.disabled = false;
};

const animateWheel = (result) => {
    return new Promise((resolve) => {
        ui.wheel.style.transition = 'transform 3s cubic-bezier(0.1, 0, 0.1, 1)';
        const randomRotation = 1440 + Math.random() * 360; // Mínimo 4 vueltas
        ui.wheel.style.transform = `rotate(${randomRotation}deg)`;

        setTimeout(() => {
            ui.resultNumber.textContent = result.number;
            ui.resultColorText.textContent = result.color.toUpperCase();
            ui.resultColorText.className = `color-${result.color}`;
            // Reset rotación suavemente para el siguiente tiro
            ui.wheel.style.transition = 'none';
            ui.wheel.style.transform = 'rotate(0deg)';
            resolve();
        }, 3100);
    });
};

const updateUI = () => {
    ui.statChips.textContent = gameState.chips;
    ui.statChips.className = `stat-value ${gameState.chips < 0 ? 'text-neon-red' : 'text-neon-blue'}`;
    ui.statRounds.textContent = gameState.rounds;

    // Historial (últimos 15)
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
    ui.btnSpin.disabled = true;
    ui.btnWithdraw.disabled = true;

    const houseEdgeText = "La ruleta tiene 37 espacios. Al pagar 35 a 1 por el verde, o 1 a 1 por rojo/negro, el casino se queda con una ventaja del 2.7% (el espacio verde).";
    
    if (isBankruptcy) {
        ui.conclusionText.innerHTML = `<strong>Has llegado al límite de deuda.</strong> <br><br> ${houseEdgeText} A largo plazo, la "Esperanza Matemática" de este juego es de aproximadamente -0.027 por cada ficha apostada. Esto significa que, estadísticamente, el casino siempre ganará si juegas lo suficiente.`;
    } else {
        ui.conclusionText.innerHTML = `<strong>Te has retirado con ${gameState.chips} fichas.</strong> <br><br> ${houseEdgeText} Aunque puedas ganar en el corto plazo por pura varianza, la ley de los grandes números dicta que mientras más juegues, más te acercarás a la pérdida teórica del 2.7%.`;
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
        gameOver: false
    };
    ui.conclusion.classList.add('hidden');
    ui.btnSpin.disabled = true;
    ui.btnWithdraw.disabled = false;
    ui.statLastPayout.textContent = "0";
    ui.resultNumber.textContent = "--";
    ui.resultColorText.textContent = "Gira la ruleta";
    ui.colorButtons.forEach(btn => btn.classList.remove('active-selection'));
    updateUI();
};
