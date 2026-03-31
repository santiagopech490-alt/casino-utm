/**
 * =========================================
 * GAME 2 CONTROLLER - ¿PUEDES GANARLE AL CASINO?
 * =========================================
 */
import * as Probability from '../../domain/probability_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';
import * as Rules from '../../domain/game_rules.js';
import { playSound } from '../../domain/sound_manager.js';
import { showVictory } from '../components/victory_modal.js';

let state = {
    rounds: 0,
    sessionBalance: 0,
    currentBet: 10,
    selectedColor: null,
    isSpinning: false,
    history: [],
    rotation: 0
};

export const initGame2 = () => {
    console.log('[Game2] Inicializando...');
    state = {
        rounds: 0,
        sessionBalance: 0,
        currentBet: 10,
        selectedColor: null,
        isSpinning: false,
        history: [],
        rotation: 0
    };
    setupEventListeners();
    updateUI();
};

const setupEventListeners = () => {
    const btnSpin = document.getElementById('btn-spin');
    const betRange = document.getElementById('bet-range');
    const btnRestart = document.getElementById('btn-restart-game2');

    if (betRange) {
        betRange.oninput = (e) => {
            state.currentBet = parseInt(e.target.value);
            updateUI();
        };
    }

    document.querySelectorAll('.btn-bet-color').forEach(btn => {
        btn.onclick = (e) => {
            state.selectedColor = e.currentTarget.dataset.color;
            document.querySelectorAll('.btn-bet-color').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            if (btnSpin) btnSpin.disabled = false;
            playSound('click');
        };
    });

    if (btnSpin) btnSpin.onclick = handleSpin;
    if (btnRestart) btnRestart.onclick = () => {
        playSound('click');
        location.reload();
    };
};

const handleSpin = async () => {
    if (state.isSpinning || !state.selectedColor) return;

    const validation = Rules.validateBet(Wallet.getBalance(), state.currentBet);
    if (!validation.isValid) {
        Wallet.showError("Apuesta no válida", validation.message);
        playSound('error');
        return;
    }

    state.isSpinning = true;
    Wallet.subtractChips(state.currentBet);
    state.sessionBalance -= state.currentBet;
    playSound('chip_bet');

    const result = Probability.spinRoulette();
    const wheel = document.getElementById('roulette-wheel');
    const resultNum = document.getElementById('result-number');
    const resultColorTxt = document.getElementById('result-color-text');
    
    // Calcular rotación precisa para caer en el CENTRO del segmento
    const spins = 8 + Math.floor(Math.random() * 5); 
    const degPerSegment = 360 / 37;
    // landingRotation apunta al INICIO del segmento. Sumamos medio segmento para caer al CENTRO.
    const landingRotation = (result.number * degPerSegment) + (degPerSegment / 2);
    state.rotation += (spins * 360) - (state.rotation % 360) - landingRotation;
    
    if (wheel) {
        wheel.style.transform = `rotate(${state.rotation}deg)`;
        playSound('roulette_spin');
    }

    await new Promise(resolve => setTimeout(resolve, 4000));
    playSound('roulette_stop');
    
    if (resultNum) resultNum.textContent = result.number;
    if (resultColorTxt) {
        resultColorTxt.textContent = result.color.toUpperCase();
        resultColorTxt.style.color = result.color === 'verde' ? '#00ff88' : (result.color === 'rojo' ? '#ff4d4d' : '#ffffff');
    }

    const payout = Probability.calculatePayout(state.currentBet, state.selectedColor, result.color);
    const lastPayoutEl = document.getElementById('stat-last-payout');
    
    if (payout > 0) {
        Wallet.addChips(payout);
        state.sessionBalance += payout;
        if (lastPayoutEl) lastPayoutEl.textContent = `+${payout}`;
        showVictory('¿Puedes Ganarle al Casino?', payout, '🎡');
    } else {
        if (lastPayoutEl) lastPayoutEl.textContent = `-${state.currentBet}`;
        playSound('miss');
    }

    state.rounds++;
    state.history.push(result);
    state.isSpinning = false;
    
    updateUI();
    checkMythBreakdown();
};

const updateUI = () => {
    const betDisplay = document.getElementById('bet-display');
    const statChips = document.getElementById('stat-chips');
    const statRounds = document.getElementById('stat-rounds');
    const historyContainer = document.getElementById('history-container');

    if (betDisplay) betDisplay.textContent = state.currentBet;
    if (statChips) statChips.textContent = Wallet.getBalance();
    if (statRounds) statRounds.textContent = state.rounds;

    if (historyContainer) {
        historyContainer.innerHTML = '';
        state.history.slice(-15).reverse().forEach(res => {
            const item = document.createElement('div');
            item.className = `history-badge ${res.color}`; // Usando clase del diseño original
            // Como no tengo los estilos originales de badges, usaré inline para asegurar visibilidad
            item.style.width = '30px';
            item.style.height = '30px';
            item.style.borderRadius = '50%';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
            item.style.fontSize = '0.7rem';
            item.style.fontWeight = 'bold';
            item.style.background = res.color === 'verde' ? '#2ecc71' : (res.color === 'rojo' ? '#e74c3c' : '#2c3e50');
            item.style.color = 'white';
            item.textContent = res.number;
            historyContainer.appendChild(item);
        });
    }
};

const checkMythBreakdown = () => {
    const analysisEl = document.getElementById('roulette-analysis');
    const conclusionPanel = document.getElementById('game-conclusion');
    const conclusionText = document.getElementById('conclusion-text');
    
    if (state.rounds >= 5 && analysisEl) {
        analysisEl.innerHTML = Probability.getRouletteEdgeText();
    }

    const balance = Wallet.getBalance();
    if ((balance <= -1000 || state.rounds >= 20) && conclusionPanel) {
        conclusionPanel.classList.remove('hidden');
        conclusionText.innerHTML = `Tras ${state.rounds} rondas, tu balance de sesión es de <strong>${state.sessionBalance}</strong> fichas. 
        Incluso con rachas de suerte, la <strong>Esperanza Matemática de -2.7%</strong> garantiza que el casino sea el ganador neto. 
        El mito de que "terminarás ganando" es matemáticamente falso.`;
    }
};
