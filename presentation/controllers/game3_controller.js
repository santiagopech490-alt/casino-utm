/**
 * =========================================
 * GAME 3 CONTROLLER - La Carta que Nunca Sale (Refactorizado)
 * =========================================
 */
import * as ProbEngine from '../../domain/probability_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';
import { playSound } from '../../domain/sound_manager.js';
import { showVictory } from '../components/victory_modal.js';

let gameState = {
    mode: '1x1', // '1x1' | 'full20'
    targetNumber: 7,
    lastTarget: 7,
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
    const container = document.querySelector('.game-container');
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
        hintText: container.querySelector('#hint-text'),
        conclusion: container.querySelector('#game-conclusion'),
        conclusionText: container.querySelector('#conclusion-text'),
        btnPlayAgain: container.querySelector('#btn-play-again-cards')
    };
};

const bindEvents = () => {
    ui.inputTarget.onchange = (e) => {
        const val = parseInt(e.target.value);
        if (val !== gameState.targetNumber) {
            gameState.abandonedTarget = gameState.targetNumber;
            gameState.targetNumber = val;
        }
        playSound('click');
    };

    ui.btnBetPlus.onclick = () => changeBet(10);
    ui.btnBetMinus.onclick = () => changeBet(-10);
    
    ui.btnRevealAction.onclick = () => {
        if (gameState.mode === '1x1') handleDraw1x1();
        else handleDrawFull20();
    };

    ui.btnRevealAll.onclick = handleDrawFull20; // Compatibility if needed
    
    ui.btnReset.onclick = () => {
        // Reset stats
        gameState.hits = 0;
        gameState.missedOpportunities = 0;
        for (let i = 1; i <= 20; i++) gameState.frequencies[i] = 0;
        renderFrequencies();
        updateUI();
        resetBoard();
    };

    ui.mode1x1.onclick = () => setMode('1x1');
    ui.modeFull20.onclick = () => setMode('full20');
    
    if (ui.btnPlayAgain) {
        ui.btnPlayAgain.onclick = resetBoard;
    }
};

const setMode = (mode) => {
    gameState.mode = mode;
    ui.mode1x1.classList.toggle('active', mode === '1x1');
    ui.modeFull20.classList.toggle('active', mode === 'full20');
    
    if (mode === 'full20') {
        ui.hintText.textContent = "Se generarán 20 resultados simultáneos";
    } else {
        ui.hintText.textContent = "Selecciona tu carta y presiona Jugar";
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
    ui.conclusion.classList.add('hidden');
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
    if (gameState.gameEnded) resetBoard();
    
    // Draw one number
    const result = Math.floor(Math.random() * 20) + 1;
    gameState.gameEnded = true;

    // Process result
    processResult(result, 0); // 0 is the card index to reveal (middle one or first one)
    
    // Visual: flip only one card (e.g. the first one for simplicity or a random one)
    const cards = ui.cardsGrid.querySelectorAll('.mini-card');
    const randomIndex = Math.floor(Math.random() * 20);
    revealCard(cards[randomIndex], result, result === gameState.targetNumber);
};

const handleDrawFull20 = () => {
    if (gameState.gameEnded) resetBoard();
    
    gameState.gameEnded = true;
    const results = ProbEngine.generateDeck(20, 1, 20);
    const cards = ui.cardsGrid.querySelectorAll('.mini-card');
    let batchHits = 0;

    results.forEach((res, i) => {
        setTimeout(() => {
            const isWin = res === gameState.targetNumber;
            revealCard(cards[i], res, isWin);
            
            // Actualizar lógica interna
            gameState.frequencies[res]++;
            gameState.history.push(res);
            if (gameState.history.length > 100) gameState.history.shift();

            if (isWin) {
                batchHits++;
                gameState.hits++;
                Wallet.addChips(10);
            } else {
                Wallet.subtractChips(10);
            }

            // Al llegar a la última carta del lote
            if (i === 19) {
                updateUI();
                renderFrequencies();
                if (batchHits > 0) {
                    setTimeout(() => {
                        showVictory('¡Número Encontrado!', 10 * batchHits, '🃏', () => {
                            // Al cerrar el modal, NO reseteamos nada del estado persistente
                        });
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
    playSound(isWin ? 'victory' : 'miss');
};

const processResult = (result, index, isBatch = false) => {
    if (isBatch) return; // Full 20 se gestiona en su propia función

    // Update Frequencies (PERSISTENT)
    gameState.frequencies[result]++;
    gameState.history.push(result);
    if (gameState.history.length > 100) gameState.history.shift();
    
    // Check Missed Opportunity
    if (gameState.abandonedTarget === result) {
        gameState.missedOpportunities++;
        gameState.abandonedTarget = null;
        playSound('error');
    }

    // Economy
    if (result === gameState.targetNumber) {
        gameState.hits++;
        Wallet.addChips(10);
        updateUI();
        renderFrequencies();
        showVictory('¡Acierto!', 10, '🃏', () => {
            // No resetear aquí automáticamente
        });
    } else {
        Wallet.subtractChips(10);
        updateUI();
        renderFrequencies();
    }
};

const checkHotCold = () => {
    // No limpiar el banner si no es necesario, solo actualizarlo basado en el historial persistente
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
    ui.statHits.textContent = gameState.hits;
    ui.statMissed.textContent = gameState.missedOpportunities;
    Wallet.updateUI();
};
