/**
 * =========================================
 * GAME 1 CONTROLLER - LA FALACIA DEL JUGADOR
 * =========================================
 */
import * as Probability from '../../domain/probability_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';
import * as Rules from '../../domain/game_rules.js';
import { playSound } from '../../domain/sound_manager.js';
import { showVictory } from '../components/victory_modal.js';

// Estado local encapsulado
let state = {
    history: [],
    currentBet: 10,
    userChoice: null,
    wins: 0,
    losses: 0,
    isFlipping: false
};

/**
 * Inicializa el juego reiniciando el estado y vinculando eventos.
 */
export const initGame1 = () => {
    console.log('[Game1] Reiniciando estado e inicializando...');
    
    state = {
        history: [],
        currentBet: 10,
        userChoice: null,
        wins: 0,
        losses: 0,
        isFlipping: false
    };

    setupEventListeners();
    updateUI();
};

const setupEventListeners = () => {
    const btnFlip1 = document.getElementById('btn-flip-1');
    const btnFlip20 = document.getElementById('btn-flip-20');
    const btnReset = document.getElementById('btn-reset');
    const inputBet = document.getElementById('input-bet-amount');
    const btnBetPlus = document.getElementById('btn-bet-plus');
    const btnBetMinus = document.getElementById('btn-bet-minus');

    // Selección Cara/Cruz
    document.querySelectorAll('.btn-choice').forEach(btn => {
        btn.onclick = (e) => {
            state.userChoice = e.currentTarget.dataset.choice;
            document.querySelectorAll('.btn-choice').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            if (btnFlip1) btnFlip1.disabled = false;
            playSound('click');
        };
    });

    if (inputBet) {
        inputBet.oninput = (e) => {
            let val = parseInt(e.target.value);
            if (!isNaN(val) && val >= 1) {
                state.currentBet = val;
            }
        };
        inputBet.onblur = (e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1) val = 1;
            state.currentBet = val;
            e.target.value = val;
        };
    }

    if (btnBetPlus) {
        btnBetPlus.onclick = () => {
            state.currentBet += 10;
            if (inputBet) inputBet.value = state.currentBet;
            playSound('click');
        };
    }

    if (btnBetMinus) {
        btnBetMinus.onclick = () => {
            if (state.currentBet > 10) {
                state.currentBet -= 10;
            } else if (state.currentBet > 1) {
                state.currentBet = 1;
            }
            if (inputBet) inputBet.value = state.currentBet;
            playSound('click');
        };
    }

    if (btnFlip1) btnFlip1.onclick = handleFlip;
    if (btnFlip20) btnFlip20.onclick = handleBatchSimulation;
    if (btnReset) btnReset.onclick = () => {
        playSound('click');
        initGame1();
    };
};

const handleFlip = async () => {
    if (state.isFlipping || !state.userChoice) return;

    // Validar apuesta
    const validation = Rules.validateBet(Wallet.getBalance(), state.currentBet);
    if (!validation.isValid) {
        Wallet.showError("Apuesta no válida", validation.message);
        playSound('error');
        return;
    }

    state.isFlipping = true;
    Wallet.subtractChips(state.currentBet);
    playSound('chip_bet');

    const coinEl = document.getElementById('coin');
    const result = Probability.flipCoinPure();
    
    // Animación de la moneda (Sincronizada con CSS)
    if (coinEl) {
        coinEl.classList.remove('animate-flip-cara', 'animate-flip-cruz');
        void coinEl.offsetWidth; // Force reflow
        coinEl.classList.add(result === 'cara' ? 'animate-flip-cara' : 'animate-flip-cruz');
    }
    
    // Tiempo de la animación (coincidir con CSS: 1.2s + margen)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Lógica de Ganancia
    state.history.push(result);
    const won = state.userChoice === result;
    if (won) {
        state.wins++;
        const prize = state.currentBet * 2;
        Wallet.addChips(prize);
        showVictory('La Falacia del Jugador', prize, '🪙');
    } else {
        state.losses++;
        playSound('miss'); 
    }

    state.isFlipping = false;
    updateUI();
    checkMythBreakdown();
};

const handleBatchSimulation = () => {
    const batchResults = Probability.simulateBatch(20);
    state.history.push(...batchResults);
    
    playSound('reveal');
    updateUI();
    checkMythBreakdown(true);
};

const updateUI = () => {
    const statTotal = document.getElementById('stat-total');
    const statCaras = document.getElementById('stat-caras');
    const statCruces = document.getElementById('stat-cruces');
    const percCaras = document.getElementById('perc-caras');
    const percCruces = document.getElementById('perc-cruces');
    const statHits = document.getElementById('stat-hits');
    const statMisses = document.getElementById('stat-misses');
    const timeline = document.getElementById('sequence-timeline');
    const inputBet = document.getElementById('input-bet-amount');

    const stats = Probability.calculateStats(state.history);
    
    if (statTotal) statTotal.textContent = stats.total;
    if (statCaras) statCaras.textContent = stats.caraCount;
    if (statCruces) statCruces.textContent = stats.cruzCount;
    if (percCaras) percCaras.textContent = `${stats.caraPct}%`;
    if (percCruces) percCruces.textContent = `${stats.cruzPct}%`;
    if (statHits) statHits.textContent = state.wins;
    if (statMisses) statMisses.textContent = state.losses;
    
    // Solo actualizar el input si no está enfocado (para evitar interrumpir al usuario)
    if (inputBet && document.activeElement !== inputBet) {
        inputBet.value = state.currentBet;
    }

    if (timeline) {
        timeline.innerHTML = '';
        state.history.slice(-15).forEach(res => {
            const bubble = document.createElement('div');
            bubble.className = `timeline-bubble ${res === 'cara' ? 'bubble-cara' : 'bubble-cruz'}`;
            bubble.textContent = res === 'cara' ? 'C' : 'X';
            timeline.appendChild(bubble);
        });
    }
};

const checkMythBreakdown = (isBatch = false) => {
    const total = state.history.length;
    const analysisEl = document.getElementById('analysis-text');
    const conclusionPanel = document.getElementById('game-conclusion');
    const conclusionText = document.getElementById('conclusion-text');
    
    if (total >= 5 && analysisEl) {
        analysisEl.innerHTML = Probability.getMythBreakdownText();
    }

    if ((total >= 15 || isBatch) && conclusionPanel && conclusionText) {
        conclusionPanel.classList.remove('hidden');
        conclusionText.innerHTML = `Tras ${total} lanzamientos, los porcentajes tienden al <strong>50/50</strong>. 
        Incluso con rachas previas, la probabilidad del siguiente lanzamiento sigue siendo independiente (0.5). 
        La moneda "no tiene memoria".`;
    }
};
