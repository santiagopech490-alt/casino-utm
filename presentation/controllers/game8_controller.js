/**
 * =========================================
 * GAME 8 CONTROLLER - La Ilusión de la Precisión
 * =========================================
 */

import { SlotEngine } from '../../domain/slot_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';

let engine = null;
let ui = {};
let isSpinning = false;
const SPIN_COST = 50;

export const initGame8 = () => {
    engine = new SlotEngine();
    cacheDOM();
    bindEvents();
};

const cacheDOM = () => {
    const container = document.querySelector('.game8-layout');
    if (!container) return;

    ui = {
        reels: [
            container.querySelector('#reel-1'),
            container.querySelector('#reel-2'),
            container.querySelector('#reel-3')
        ],
        btnSpin: container.querySelector('#btn-spin-slots'),
        feedback: container.querySelector('#slot-feedback'),
        feedbackIcon: container.querySelector('#feedback-icon'),
        feedbackMsg: container.querySelector('#feedback-message'),
        modalBankruptcy: container.querySelector('#slot-bankruptcy-modal'),
        btnReset: container.querySelector('#btn-slot-reset')
    };
};

const bindEvents = () => {
    if (ui.btnSpin) ui.btnSpin.onclick = handleSpin;
    if (ui.btnReset) ui.btnReset.onclick = () => {
        ui.modalBankruptcy.classList.add('hidden');
    };
};

const handleSpin = async () => {
    if (isSpinning) return;

    // 1. Validar Economía
    if (!Wallet.hasEnoughChips(SPIN_COST)) {
        if (Wallet.getBalance() < SPIN_COST) {
            ui.modalBankruptcy.classList.remove('hidden');
        }
        return;
    }

    isSpinning = true;
    ui.btnSpin.disabled = true;
    ui.feedback.classList.add('hidden');
    
    // Limpiar clases de animaciones previas
    ui.reels.forEach(r => r.classList.remove('highlight-win', 'highlight-near'));

    // Cobrar
    Wallet.subtractChips(SPIN_COST);

    // 2. Generar Resultado
    const result = engine.generateResult();

    // 3. Animación de los rodillos
    await animateSpin(result);

    // 4. Procesar Resultado y Feedback
    processOutcome(result);

    isSpinning = false;
    ui.btnSpin.disabled = false;
};

const animateSpin = async (result) => {
    // Todos empiezan a girar
    ui.reels.forEach(r => r.classList.add('spinning'));

    // Función para mostrar emojis random durante el giro
    const updateRandomSymbols = (reelIndex) => {
        const reel = ui.reels[reelIndex];
        const symbolDiv = reel.querySelector('.reel-symbols');
        const randomSymbol = engine.symbols[Math.floor(Math.random() * engine.symbols.length)];
        symbolDiv.textContent = randomSymbol.icon;
    };

    // Intervalos para cambiar símbolos rápidamente
    const intervals = ui.reels.map((_, i) => setInterval(() => updateRandomSymbols(i), 100));

    // Parar uno por uno con retraso
    for (let i = 0; i < ui.reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 + i * 600));
        clearInterval(intervals[i]);
        ui.reels[i].classList.remove('spinning');
        ui.reels[i].querySelector('.reel-symbols').textContent = engine.getSymbolIcon(result.rodillos[i]);
    }
};

const processOutcome = (result) => {
    ui.feedback.classList.remove('hidden');

    if (result.tipoResultado === 'win') {
        Wallet.addChips(result.premio);
        ui.reels.forEach(r => r.classList.add('highlight-win'));
        
        ui.feedbackIcon.textContent = '🎉';
        ui.feedbackMsg.innerHTML = `<strong>¡Ganaste ${result.premio} fichas!</strong> <br> Pero cuidado: las probabilidades de este giro eran exactamente iguales a las de cualquier otro. El azar no tiene memoria.`;
    } 
    else if (result.tipoResultado === 'near-miss') {
        ui.reels[0].classList.add('highlight-near');
        ui.reels[1].classList.add('highlight-near');
        
        ui.feedbackIcon.textContent = '👀';
        ui.feedbackMsg.innerHTML = `<strong>¡Casi!</strong> Sacar dos iguales NO significa que la máquina esté "a punto" de pagar. Es una ilusión visual diseñada para que sigas apostando.`;
    } 
    else {
        ui.feedbackIcon.textContent = '💡';
        ui.feedbackMsg.innerHTML = `Nada esta vez. Recuerda que cada rodillo es un evento independiente.`;
    }
};
