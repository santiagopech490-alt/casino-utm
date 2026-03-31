/**
 * =========================================
 * GAME 7 CONTROLLER - Percepción de Patrones
 * =========================================
 */

import { PatternEngine } from '../../domain/pattern_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';
import { playSound } from '../../domain/sound_manager.js';
import { showVictory } from '../components/victory_modal.js';

let engine = null;
let ui = {};
let selectedNumber = null;
let isSpinning = false;
const BET_COST = 10;

export const initGame7 = () => {
    engine = new PatternEngine();
    cacheDOM();
    bindEvents();
    updateUI();
};

const cacheDOM = () => {
    const container = document.querySelector('.game7-layout');
    if (!container) return;

    ui = {
        numberBtns: container.querySelectorAll('.number-btn'),
        btnSpin: container.querySelector('#btn-spin-prediction'),
        statHits: container.querySelector('#stat-hits'),
        statMisses: container.querySelector('#stat-misses'),
        statStreak: container.querySelector('#stat-streak'),
        history: container.querySelector('#result-history'),
        histogram: container.querySelector('#histogram-container'),
        modal: container.querySelector('#pattern-education-modal'),
        modalText: container.querySelector('#edu-content'),
        btnCloseModal: container.querySelector('#btn-close-pattern-edu'),
        btnReset: container.querySelector('#btn-reset-patterns')
    };
};

const bindEvents = () => {
    ui.numberBtns.forEach(btn => {
        btn.onclick = () => selectNumber(parseInt(btn.dataset.num));
    });

    ui.btnSpin.onclick = handleSpin;
    ui.btnCloseModal.onclick = () => ui.modal.classList.add('hidden');
    if (ui.btnReset) ui.btnReset.onclick = resetStats;
};

const resetStats = () => {
    if (isSpinning) return;
    engine = new PatternEngine();
    selectedNumber = null;
    ui.numberBtns.forEach(btn => btn.classList.remove('selected'));
    ui.btnSpin.disabled = true;
    updateUI();
    playSound('click');
};

const selectNumber = (num) => {
    if (isSpinning) return;
    playSound('click');
    selectedNumber = num;
    ui.numberBtns.forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.num) === num);
    });
    ui.btnSpin.disabled = false;
};

const handleSpin = async () => {
    if (isSpinning || selectedNumber === null) return;

    // 1. Validar Economía
    if (!Wallet.hasEnoughChips(BET_COST)) {
        playSound('error');
        return;
    }

    isSpinning = true;
    ui.btnSpin.disabled = true;
    
    playSound('chip_bet');
    Wallet.subtractChips(BET_COST);

    // --- ANIMACIÓN DE GIRO ---
    const totalSpinTime = 2000; // 2 segundos de suspenso
    const intervalTime = 80;    // Cambio de luz cada 80ms
    const numButtons = ui.numberBtns.length;
    
    let elapsed = 0;
    const spinPromise = new Promise(resolve => {
        const interval = setInterval(() => {
            // Limpiar resaltado previo
            ui.numberBtns.forEach(btn => btn.classList.remove('spinning-highlight'));
            
            // Iluminar uno aleatorio (o secuencial para efecto ruleta)
            const randomIndex = Math.floor(Math.random() * numButtons);
            ui.numberBtns[randomIndex].classList.add('spinning-highlight');
            
            playSound('slot_spin');
            
            elapsed += intervalTime;
            if (elapsed >= totalSpinTime) {
                clearInterval(interval);
                ui.numberBtns.forEach(btn => btn.classList.remove('spinning-highlight'));
                resolve();
            }
        }, intervalTime);
    });

    await spinPromise;

    // 2. Lógica de Resultado
    const result = engine.roll();
    const isHit = result === selectedNumber;
    
    if (isHit) {
        const prize = BET_COST * 2;
        Wallet.addChips(prize); // Recupera 10 + gana 10
        
        showVictory('¿Qué número saldrá?', prize, '🔮', () => {
            // Callback opcional
        });
    } else {
        playSound('miss');
    }

    engine.registerResult(isHit);

    // 3. Actualizar UI
    updateUI();
    checkEducationalTriggers(isHit);

    isSpinning = false;
    selectedNumber = null;
    ui.numberBtns.forEach(btn => btn.classList.remove('selected'));
};

const updateUI = () => {
    // Stats
    ui.statHits.textContent = engine.hits;
    ui.statMisses.textContent = engine.misses;
    ui.statStreak.textContent = `${engine.streak} (${engine.streakType === 'hit' ? '✅' : '❌'})`;
    ui.statStreak.className = `value ${engine.streakType === 'hit' ? 'text-neon-green' : 'text-neon-red'}`;

    // History
    ui.history.innerHTML = '';
    engine.history.forEach(num => {
        const bubble = document.createElement('div');
        bubble.className = 'history-bubble';
        bubble.textContent = num;
        ui.history.appendChild(bubble);
    });

    // Histograma
    renderHistogram();
};

const renderHistogram = () => {
    ui.histogram.innerHTML = '';
    const data = engine.getFrequencyData();
    const maxCount = Math.max(...data.map(d => d.count), 1);

    data.forEach(item => {
        const height = (item.count / maxCount) * 100;
        const wrapper = document.createElement('div');
        wrapper.className = 'hist-bar-wrapper';
        wrapper.innerHTML = `
            <div class="hist-bar" style="height: ${height}%" data-count="${item.count}"></div>
            <span class="hist-label">${item.number}</span>
        `;
        ui.histogram.appendChild(wrapper);
    });
};

const checkEducationalTriggers = (isHit) => {
    // Disparador 1: Racha de errores larga
    if (engine.streakType === 'miss' && engine.streak >= 5) {
        showEducation("¿Sientes que el número 'ya debe salir'? Eso es la Falacia del Jugador. Cada tiro de la ruleta tiene exactamente un 10% de probabilidad, sin importar cuántas veces hayas fallado antes.");
    } 
    // Disparador 2: Después de 20 tiros
    else if ((engine.hits + engine.misses) === 20) {
        showEducation("Observa el Histograma. A corto plazo parece caótico, pero si sigues jugando, verás cómo las frecuencias de todos los números tienden a nivelarse. Es la Ley de los Grandes Números.");
    }
};

const showEducation = (message) => {
    playSound('pattern_reveal');
    ui.modalText.textContent = message;
    ui.modal.classList.remove('hidden');
};
