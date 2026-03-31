/**
 * =========================================
 * GAME 3 CONTROLLER - La Carta que Nunca Sale (Refactorizado)
 * =========================================
 */
import * as Wallet from '../../domain/wallet_manager.js';
import { playSound } from '../../domain/sound_manager.js';
import { showVictory } from '../components/victory_modal.js';

let gameState = {
    mode: '1x1', // '1x1' | 'full20'
    targetNumber: null,
    lastTarget: null,
    abandonedTarget: null,
    betAmount: 10,
    hits: 0,
    missedOpportunities: 0,
    frequencies: {}, // { number: count }
    history: [], // Recent results
    gameEnded: false,
    deck: []
};

let ui = {};

export const initGame3 = () => {
    cacheDOM();
    if (!ui.container) return;
    
    // Initialize frequencies
    for (let i = 1; i <= 20; i++) gameState.frequencies[i] = 0;
    
    bindEvents();
    renderFrequencies();
    resetBoard();
};

const cacheDOM = () => {
    const container = document.querySelector('.game6-layout') || document.querySelector('.game-container'); // Safety check for layout
    if (!container) return;

    ui = {
        container,
        cardsGrid: container.querySelector('#cards-grid'),
        inputTarget: container.querySelector('#input-target-number'),
        betDisplay: container.querySelector('#card-bet-display'),
        btnBetPlus: container.querySelector('#btn-card-bet-plus'),
        btnBetMinus: container.querySelector('#btn-card-bet-minus'),
        btnRevealAction: container.querySelector('#btn-reveal-action'),
        btnRevealAll: container.querySelector('#btn-reveal-all'),
        btnReset: container.querySelector('#btn-reset-cards'),
        statHits: container.querySelector('#stat-cards-hits'),
        statMissed: container.querySelector('#stat-missed-opp'),
        freqList: container.querySelector('#frequency-list'),
        hotColdBanner: container.querySelector('#hot-cold-banner'),
        hotColdText: container.querySelector('#hot-cold-text'),
        mode1x1: container.querySelector('#btn-mode-1x1'),
        modeFull20: container.querySelector('#btn-mode-full20'),
        hintText: container.querySelector('#hint-text')
    };
};

const bindEvents = () => {
    ui.inputTarget.onchange = (e) => {
        const val = parseInt(e.target.value);
        if (isNaN(val) || val < 1 || val > 20) {
            gameState.targetNumber = null;
        } else {
            if (val !== gameState.targetNumber) {
                gameState.abandonedTarget = gameState.targetNumber;
                gameState.targetNumber = val;
            }
        }
        playSound('click');
    };

    ui.btnBetPlus.onclick = () => changeBet(10);
    ui.btnBetMinus.onclick = () => changeBet(-10);
    
    ui.btnRevealAction.onclick = () => {
        if (!validateInput()) return;
        if (gameState.mode === '1x1') handleDraw1x1();
        else handleDrawFull20();
    };

    ui.btnRevealAll.onclick = () => {
        if (!validateInput()) return;
        // Revelar todas fuerza el modo Full 20 temporalmente si estamos en 1x1? 
        // El usuario dijo "no elimines el boton", así que lo haré funcional.
        handleDrawFull20();
    };

    ui.btnReset.onclick = () => {
        gameState.hits = 0;
        gameState.missedOpportunities = 0;
        for (let i = 1; i <= 20; i++) gameState.frequencies[i] = 0;
        renderFrequencies();
        updateUI();
        resetBoard();
    };

    ui.mode1x1.onclick = () => setMode('1x1');
    ui.modeFull20.onclick = () => setMode('full20');
};

const validateInput = () => {
    if (gameState.targetNumber === null || isNaN(gameState.targetNumber)) {
        alert("Por favor, selecciona un número entre 1 y 20.");
        return false;
    }
    return true;
};

const setMode = (mode) => {
    gameState.mode = mode;
    ui.mode1x1.classList.toggle('active', mode === '1x1');
    ui.modeFull20.classList.toggle('active', mode === 'full20');
    
    if (mode === 'full20') {
        ui.hintText.textContent = "Se generará un mazo completo (1-20) sin repeticiones";
    } else {
        ui.hintText.textContent = "Modo con reposición: la misma carta puede repetirse";
    }
    playSound('click');
    resetBoard();
};

const changeBet = (amount) => {
    const nextBet = gameState.betAmount + amount;
    if (nextBet >= 10 && nextBet <= 1000) {
        gameState.betAmount = nextBet;
        ui.betDisplay.textContent = gameState.betAmount;
        playSound('click');
    }
};

const resetBoard = () => {
    gameState.gameEnded = false;
    ui.cardsGrid.classList.add('shuffling');
    setTimeout(() => ui.cardsGrid.classList.remove('shuffling'), 500);
    
    renderInitialCards();
    checkHotCold();
};

const renderInitialCards = () => {
    ui.cardsGrid.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const card = document.createElement('div');
        card.className = 'mini-card';
        card.innerHTML = `
            <div class="mini-card-inner">
                <div class="mini-card-back"></div>
                <div class="mini-card-front">?</div>
            </div>
        `;
        ui.cardsGrid.appendChild(card);
    }
};

const handleDraw1x1 = () => {
    if (gameState.gameEnded) {
        resetBoard();
        return;
    }
    
    if (!Wallet.hasEnoughChips(gameState.betAmount)) {
        alert("¡No tienes suficientes fichas!");
        return;
    }

    const result = Math.floor(Math.random() * 20) + 1;
    gameState.gameEnded = true;

    processResult(result);
    
    const cards = ui.cardsGrid.querySelectorAll('.mini-card');
    const randomIndex = Math.floor(Math.random() * 20);
    revealCard(cards[randomIndex], result, result === gameState.targetNumber);
};

const handleDrawFull20 = () => {
    if (gameState.gameEnded) {
        resetBoard();
        return;
    }

    if (!Wallet.hasEnoughChips(gameState.betAmount)) {
        alert("¡No tienes suficientes fichas!");
        return;
    }
    
    gameState.gameEnded = true;
    
    // Generar mazo de 20 números ÚNICOS
    const results = [];
    for (let i = 1; i <= 20; i++) results.push(i);
    for (let i = results.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [results[i], results[j]] = [results[j], results[i]];
    }

    const cards = ui.cardsGrid.querySelectorAll('.mini-card');
    let batchHits = 0;

    results.forEach((res, i) => {
        setTimeout(() => {
            const isWin = res === gameState.targetNumber;
            revealCard(cards[i], res, isWin);
            
            gameState.frequencies[res]++;
            gameState.history.push(res);
            if (gameState.history.length > 100) gameState.history.shift();

            if (isWin) {
                batchHits++;
                gameState.hits++;
                Wallet.addChips(gameState.betAmount);
            } else {
                Wallet.subtractChips(gameState.betAmount / 20);
            }

            if (i === 19) {
                updateUI();
                renderFrequencies();
                if (batchHits > 0) {
                    setTimeout(() => {
                        showVictory('¡Encontrada!', gameState.betAmount, '🃏');
                    }, 500);
                }
            }
        }, i * 50);
    });
};

const revealCard = (el, val, isWin) => {
    const front = el.querySelector('.mini-card-front');
    front.textContent = val;
    front.classList.add(isWin ? 'win' : 'loss');
    el.classList.add('is-flipped');
    playSound(isWin ? 'victory' : 'reveal');
};

const processResult = (result) => {
    gameState.frequencies[result]++;
    gameState.history.push(result);
    if (gameState.history.length > 100) gameState.history.shift();
    
    if (gameState.abandonedTarget === result) {
        gameState.missedOpportunities++;
        gameState.abandonedTarget = null;
        playSound('error');
    }

    if (result === gameState.targetNumber) {
        gameState.hits++;
        Wallet.addChips(gameState.betAmount);
        updateUI();
        renderFrequencies();
        showVictory('¡Acierto!', gameState.betAmount, '🃏');
    } else {
        Wallet.subtractChips(gameState.betAmount);
        updateUI();
        renderFrequencies();
        playSound('miss');
    }
};

const checkHotCold = () => {
    const coldNumbers = [];
    for (let i = 1; i <= 20; i++) {
        if (!gameState.history.slice(-20).includes(i)) {
            coldNumbers.push(i);
        }
    }

    if (coldNumbers.length > 0) {
        const selected = coldNumbers[Math.floor(Math.random() * coldNumbers.length)];
        ui.hotColdBanner.classList.remove('hidden');
        ui.hotColdText.innerHTML = `🔥 ¡La carta <strong>${selected}</strong> no ha salido! Si la eliges ahora, tus aciertos valen x2.`;
    } else {
        ui.hotColdBanner.classList.add('hidden');
    }
};

const renderFrequencies = () => {
    ui.freqList.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const item = document.createElement('div');
        item.className = 'freq-item';
        item.innerHTML = `№${i}<span class="val">${gameState.frequencies[i]}</span>`;
        ui.freqList.appendChild(item);
    }
};

const updateUI = () => {
    if (ui.statHits) ui.statHits.textContent = gameState.hits;
    if (ui.statMissed) ui.statMissed.textContent = gameState.missedOpportunities;
    Wallet.updateUI();
};
