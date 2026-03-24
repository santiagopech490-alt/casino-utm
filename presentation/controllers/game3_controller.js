import * as Rules from '../../domain/game_rules.js';
import * as Wallet from '../../domain/wallet_manager.js';

let gameState = {
    betNumber: null,
    betAmount: 10,
    history: [],
    isAnimating: false,
    gameEnded: false,
    gridDeck: [],
    selectedCardIndex: null,
};

let ui = {};

export const initGame3 = () => {
    cacheDOM();
    if (ui.container) {
        bindEvents();
        resetGameState();
    }
};

const cacheDOM = () => {
    const container = document.querySelector('.game-container');
    if (!container) return;

    ui = {
        container,
        grid: container.querySelector('#cards-grid'),
        betInput: container.querySelector('#bet-input'),
        betAmountInput: container.querySelector('#bet-amount-input'),
        btnBetPlus: container.querySelector('#btn-bet-plus'),
        btnBetMinus: container.querySelector('#btn-bet-minus'),
        btnDraw: container.querySelector('#btn-draw'),
        btnRiskyBet: container.querySelector('#btn-risky-bet'),
        historyHotbar: container.querySelector('#history-hotbar'),
        victoryModal: container.querySelector('#victory-modal'),
        prizeAmount: container.querySelector('#prize-amount'),
        btnPlayAgain: container.querySelector('#btn-play-again'),
        resultCardInner: container.querySelector('#result-card-inner'),
        resultCardFront: container.querySelector('#result-card-front'),
    };
};

const bindEvents = () => {
    if (ui.grid) ui.grid.onclick = handleSelectCard;
    if (ui.btnDraw) ui.btnDraw.onclick = handleDrawCard;
    if (ui.btnRiskyBet) ui.btnRiskyBet.onclick = handleRiskyBet;
    if (ui.betInput) ui.betInput.oninput = handleBetInputChange;
    if (ui.btnBetPlus) ui.btnBetPlus.onclick = () => updateBet(10);
    if (ui.btnBetMinus) ui.btnBetMinus.onclick = () => updateBet(-10);
    if (ui.btnPlayAgain) ui.btnPlayAgain.onclick = resetGameState;
};

const generateGridDeck = () => {
    gameState.gridDeck = Array.from({ length: 20 }, () => Math.floor(Math.random() * 20) + 1);
};

const renderCardsGrid = () => {
    if (!ui.grid) return;
    ui.grid.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const card = document.createElement('div');
        card.className = 'mini-card';
        card.dataset.index = i;
        card.innerHTML = `?`; // Initial back of card look
        ui.grid.appendChild(card);
    }
};

const handleBetInputChange = () => {
    const num = parseInt(ui.betInput.value, 10);
    const isValid = !isNaN(num) && num >= 1 && num <= 20 && Number.isInteger(parseFloat(ui.betInput.value));

    if (ui.betInput.value !== '' && !isValid) {
        gameState.betNumber = null;
        ui.betInput.style.borderColor = '#ff4d4d';
    } else {
        gameState.betNumber = isValid ? num : null;
        ui.betInput.style.borderColor = isValid ? '#ffd700' : '';
    }
    setControls(true);
};

const updateBet = (amount) => {
    let currentBet = parseInt(ui.betAmountInput.value) + amount;
    const balance = Wallet.getBalance();
    if (currentBet < 10) currentBet = 10;
    if (currentBet > balance) currentBet = balance;
    if (currentBet > 500) currentBet = 500;
    
    ui.betAmountInput.value = currentBet;
    gameState.betAmount = currentBet;
};

const handleSelectCard = (event) => {
    if (gameState.isAnimating || gameState.gameEnded) return;

    const card = event.target.closest('.mini-card');
    if (!card || card.classList.contains('used')) return;

    const previouslySelected = ui.grid.querySelector('.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    if (previouslySelected !== card) {
        card.classList.add('selected');
        gameState.selectedCardIndex = parseInt(card.dataset.index, 10);
    } else {
        gameState.selectedCardIndex = null;
    }
    
    setControls(true);
};

const handleDrawCard = () => {
    if (gameState.isAnimating || gameState.gameEnded || gameState.selectedCardIndex === null || !gameState.betNumber) return;

    // Validación de economía con modal centralizado
    if (!Wallet.hasEnoughChips(gameState.betAmount)) {
        return;
    }

    gameState.isAnimating = true;
    setControls(false);
    Wallet.subtractChips(gameState.betAmount);

    const cardIndex = gameState.selectedCardIndex;
    const revealedNumber = gameState.gridDeck[cardIndex];
    const won = revealedNumber === gameState.betNumber;

    ui.resultCardFront.textContent = revealedNumber;
    ui.resultCardInner.classList.add('is-flipped');

    const gridCard = ui.grid.querySelector(`.mini-card[data-index='${cardIndex}']`);
    gridCard.classList.remove('selected');
    gridCard.classList.add('used');
    gridCard.textContent = revealedNumber; // Show number on used card

    if (won) {
        gameState.gameEnded = true;
        const prize = gameState.betAmount * 2;
        Wallet.addChips(prize);
        ui.resultCardFront.classList.add('win');
        setTimeout(() => endGame(prize, `¡Enhorabuena! Ganaste <strong>${prize}</strong> fichas.`), 1500);
    } else {
        gameState.history.push(revealedNumber);
        updateHotbar();
        ui.resultCardFront.classList.add('loss');

        setTimeout(() => {
            ui.resultCardInner.classList.remove('is-flipped');
            ui.resultCardFront.classList.remove('loss');
            gameState.isAnimating = false;
            gameState.selectedCardIndex = null;
            setControls(true);
        }, 2000);
    }
    updateUI();
};

const handleRiskyBet = () => {
    if (gameState.isAnimating || gameState.gameEnded || !gameState.betNumber) return;

    const cost = gameState.betAmount * 2;
    
    // Validación de economía con modal centralizado
    if (!Wallet.hasEnoughChips(cost)) {
        return;
    }

    gameState.isAnimating = true;
    gameState.gameEnded = true;
    setControls(false);
    Wallet.subtractChips(cost);

    const won = gameState.gridDeck.includes(gameState.betNumber);
    
    ui.grid.querySelectorAll('.mini-card').forEach((card, index) => {
        const number = gameState.gridDeck[index];
        card.textContent = number;
        card.classList.add('used');
        if (number === gameState.betNumber) {
            card.classList.add('win');
        }
    });

    if (won) {
        const prize = gameState.betAmount * 3;
        Wallet.addChips(prize);
        setTimeout(() => endGame(prize, `¡Tu número estaba! Ganaste <strong>${prize}</strong> fichas.`), 2000);
    } else {
        setTimeout(() => endGame(0, "Tu número no estaba en la baraja."), 2000);
    }

    updateUI();
};

const updateHotbar = () => {
    if (!ui.historyHotbar) return;
    ui.historyHotbar.innerHTML = '';
    const last5 = gameState.history.slice(-5);
    last5.forEach(num => {
        const card = document.createElement('div');
        card.className = 'hotbar-card loss';
        card.textContent = num;
        ui.historyHotbar.appendChild(card);
    });
};

const endGame = (prize, message) => {
    if (ui.prizeAmount) ui.prizeAmount.textContent = prize;
    const p = ui.victoryModal.querySelector('p');
    if (p) p.innerHTML = message;
    const h2 = ui.victoryModal.querySelector('h2');
    if (h2) h2.textContent = prize > 0 ? "¡Has Ganado!" : "Fin de la Ronda";

    if (ui.victoryModal) ui.victoryModal.style.display = 'flex';
};

const updateUI = () => {
    Wallet.updateUI();
};

const setControls = (enabled) => {
    const canPlay = enabled && !gameState.gameEnded;
    const hasBetNumber = gameState.betNumber !== null;
    const hasSelectedCard = gameState.selectedCardIndex !== null;

    if (ui.btnDraw) ui.btnDraw.disabled = !canPlay || !hasBetNumber || !hasSelectedCard;
    if (ui.btnRiskyBet) ui.btnRiskyBet.disabled = !canPlay || !hasBetNumber;
    if (ui.betInput) ui.betInput.disabled = !canPlay;
    if (ui.btnBetPlus) ui.btnBetPlus.disabled = !canPlay;
    if (ui.btnBetMinus) ui.btnBetMinus.disabled = !canPlay;
    
    ui.grid.style.pointerEvents = canPlay ? 'auto' : 'none';
};

const resetGameState = () => {
    gameState = {
        betNumber: null,
        betAmount: 10,
        history: [],
        isAnimating: false,
        gameEnded: false,
        gridDeck: [],
        selectedCardIndex: null,
    };
    
    if (ui.betInput) {
        ui.betInput.value = '';
        ui.betInput.style.borderColor = '';
    }
    if (ui.betAmountInput) ui.betAmountInput.value = 10;
    if (ui.victoryModal) ui.victoryModal.style.display = 'none';

    if (ui.resultCardInner) ui.resultCardInner.classList.remove('is-flipped');
    if (ui.resultCardFront) {
        ui.resultCardFront.classList.remove('win', 'loss');
        ui.resultCardFront.textContent = '--';
    }
    
    generateGridDeck();
    renderCardsGrid();
    updateHotbar();
    setControls(true);
    updateUI();
};
