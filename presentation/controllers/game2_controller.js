import * as ProbEngine from '../../domain/probability_engine.js';
import * as Rules from '../../domain/game_rules.js';
import * as Wallet from '../../domain/wallet_manager.js';

let gameState = {
    sessionProfit: 0, // Ganancia/Pérdida en la sesión actual del juego
    rounds: 0,
    history: [],
    selectedColor: null,
    currentBet: 10,
    isAnimating: false,
    gameOver: false,
    totalRotation: 0
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
    const rechargeBtn = document.getElementById('btn-recharge');

    if (!container) return;

    ui = {
        container,
        rechargeBtn,
        wheel: container.querySelector('#roulette-wheel'),
        resultNumber: container.querySelector('#result-number'),
        resultColorText: container.querySelector('#result-color-text'),
        betRange: container.querySelector('#bet-range'),
        betDisplay: container.querySelector('#bet-display'),
        btnSpin: container.querySelector('#btn-spin'),
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
    // Vincular recarga global
    if (ui.rechargeBtn) {
        ui.rechargeBtn.onclick = () => {
            Wallet.addChips(500);
            updateUI();
        };
    }

    ui.betRange.oninput = (e) => {
        gameState.currentBet = parseInt(e.target.value);
        ui.betDisplay.textContent = gameState.currentBet;
    };

    ui.colorButtons.forEach(btn => {
        btn.onclick = () => selectColor(btn.getAttribute('data-color'));
    });

    ui.btnSpin.onclick = handleSpin;
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

    // Validar contra el Wallet global
    if (!Wallet.hasEnoughChips(gameState.currentBet)) {
        return;
    }

    gameState.isAnimating = true;
    ui.btnSpin.disabled = true;

    // Restar apuesta del Wallet Global
    Wallet.subtractChips(gameState.currentBet);
    gameState.sessionProfit -= gameState.currentBet;

    // Obtener resultado matemático
    const result = ProbEngine.spinRoulette();
    // calculamos el premio (incluye devolver la apuesta si gana)
    const winAmount = ProbEngine.calculatePayout(gameState.currentBet, gameState.selectedColor, result.color);
    
    // Si gana, devolvemos la apuesta + el premio al Wallet
    let finalPayout = 0;
    if (winAmount > 0) {
        finalPayout = gameState.currentBet + winAmount;
        Wallet.addChips(finalPayout);
        gameState.sessionProfit += finalPayout;
    }

    // Animación visual
    await animateWheel(result);

    // Actualizar estado
    gameState.rounds++;
    gameState.history.push(result.color);
    
    // UI Local
    ui.statLastPayout.textContent = winAmount > 0 ? `+${winAmount}` : `-${gameState.currentBet}`;
    ui.statLastPayout.className = `stat-value ${winAmount > 0 ? 'text-neon-green' : 'text-neon-red'}`;
    
    updateUI();

    // Comprobar bancarrota global
    if (Wallet.getBalance() <= -1000) {
        showConclusion(true);
    }

    gameState.isAnimating = false;
    ui.btnSpin.disabled = false;
};

const animateWheel = (result) => {
    return new Promise((resolve) => {
        gameState.totalRotation += 1800 + Math.random() * 360; 
        ui.wheel.style.transition = 'transform 3s cubic-bezier(0.1, 0, 0.1, 1)';
        ui.wheel.style.transform = `rotate(${gameState.totalRotation}deg)`;

        setTimeout(() => {
            ui.resultNumber.textContent = result.number;
            ui.resultColorText.textContent = result.color.toUpperCase();
            ui.resultColorText.className = `color-${result.color}`;
            resolve();
        }, 3000);
    });
};

const updateUI = () => {
    // Mostramos el beneficio/pérdida de la sesión actual
    ui.statChips.textContent = gameState.sessionProfit;
    ui.statChips.classList.toggle('text-neon-red', gameState.sessionProfit < 0);
    ui.statChips.classList.toggle('text-neon-green', gameState.sessionProfit > 0);
    
    ui.statRounds.textContent = gameState.rounds;

    // Historial
    ui.historyContainer.innerHTML = '';
    gameState.history.slice(-15).forEach(color => {
        const dot = document.createElement('div');
        dot.className = `history-dot bg-${color}`;
        ui.historyContainer.appendChild(dot);
    });

    // Actualizar Wallet Global por si acaso
    Wallet.updateUI();
};

const showConclusion = (isBankruptcy) => {
    gameState.gameOver = true;
    ui.conclusion.classList.remove('hidden');
    ui.conclusion.classList.add('animate-slide-up');
    
    const houseEdgeMsg = "Matemáticamente, el casino siempre tiene la ventaja debido al espacio verde (2.7% de ventaja).";
    
    if (isBankruptcy) {
        ui.conclusionText.innerHTML = `<strong>¡Bancarrota Total!</strong> Has superado tu límite de crédito en el casino. <br><br> ${houseEdgeMsg} A largo plazo, el valor esperado de cada apuesta es negativo.`;
    } else {
        const balanceStatus = gameState.sessionProfit >= 0 ? 'ganancia' : 'pérdida';
        ui.conclusionText.innerHTML = `<strong>Sesión Finalizada.</strong> Te retiras con una ${balanceStatus} de ${Math.abs(gameState.sessionProfit)} fichas en esta mesa. <br><br> ${houseEdgeMsg} El casino no necesita suerte, solo tiempo y jugadores.`;
    }
};

const resetGameState = () => {
    gameState = {
        sessionProfit: 0,
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
    ui.resultNumber.textContent = "--";
    ui.resultColorText.textContent = "LISTO PARA GIRAR";
    ui.resultColorText.className = "";
    ui.statLastPayout.textContent = "0";
    
    ui.colorButtons.forEach(btn => btn.classList.remove('active-selection'));
    updateUI();
};
