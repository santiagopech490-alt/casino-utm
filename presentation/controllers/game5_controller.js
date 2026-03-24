/**
 * =========================================
 * GAME 5 CONTROLLER - Tómbola de la Suerte
 * =========================================
 */

import { TombolaEngine } from '../../domain/tombola_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';

let engine = null;
let ui = {};
let isSpinning = false;
let isAutoSpinning = false;
let autoInterval = null;
const SPIN_COST = 10;
const MAX_ATTEMPTS = 100;
const AUTO_SPEED = 300; // ms entre tiros en modo auto

export const initGame5 = () => {
    engine = new TombolaEngine();
    cacheDOM();
    bindEvents();
    updateUI();
};

const cacheDOM = () => {
    const container = document.querySelector('.game5-layout');
    if (!container) return;

    ui = {
        btnSpin: container.querySelector('#btn-spin-tombola'),
        btnReset: container.querySelector('#btn-reset-tombola'),
        btnAuto: container.querySelector('#btn-auto-spin'),
        btnStop: container.querySelector('#btn-stop-auto'),
        sphere: container.querySelector('#tombola-sphere'),
        thermoFill: container.querySelector('#thermometer-fill'),
        attemptCount: container.querySelector('#attempt-count'),
        log: container.querySelector('#spin-log'),
        modal: container.querySelector('#game-conclusion'),
        modalEmoji: container.querySelector('#conclusion-emoji'),
        modalTitle: container.querySelector('#conclusion-title'),
        modalText: container.querySelector('#conclusion-text'),
        btnCloseModal: container.querySelector('#btn-close-conclusion')
    };
};

const bindEvents = () => {
    if (ui.btnSpin) ui.btnSpin.onclick = () => handleSpin();
    if (ui.btnAuto) ui.btnAuto.onclick = startAutoSpin;
    if (ui.btnStop) ui.btnStop.onclick = stopAutoSpin;
    if (ui.btnReset) ui.btnReset.onclick = handleReset;
    if (ui.btnCloseModal) ui.btnCloseModal.onclick = () => ui.modal.classList.add('hidden');
};

const startAutoSpin = () => {
    if (isAutoSpinning || isSpinning || engine.attempts >= MAX_ATTEMPTS) return;
    
    isAutoSpinning = true;
    ui.btnAuto.style.display = 'none';
    ui.btnStop.style.display = 'block';
    ui.btnSpin.disabled = true;

    autoInterval = setInterval(async () => {
        const canContinue = await handleSpin(true);
        if (!canContinue) {
            stopAutoSpin();
        }
    }, AUTO_SPEED);
};

const stopAutoSpin = () => {
    isAutoSpinning = false;
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
    }
    if (ui.btnAuto) ui.btnAuto.style.display = 'block';
    if (ui.btnStop) ui.btnStop.style.display = 'none';
    if (ui.btnSpin && engine.attempts < MAX_ATTEMPTS) ui.btnSpin.disabled = false;
};

const handleSpin = async (isAuto = false) => {
    if (isSpinning || engine.attempts >= MAX_ATTEMPTS) return false;

    // 1. Validar Economía
    if (!Wallet.hasEnoughChips(SPIN_COST)) {
        checkGameOver();
        return false;
    }

    isSpinning = true;
    if (!isAuto) ui.btnSpin.disabled = true;
    ui.sphere.classList.add('spinning');

    // Descontar fichas
    Wallet.subtractChips(SPIN_COST);

    // Pequeño delay para la animación
    // En modo auto el delay es menor para que sea más fluido
    await new Promise(resolve => setTimeout(resolve, isAuto ? 100 : 600));

    // 2. Ejecutar Lógica
    const result = engine.spin();

    // 3. Actualizar UI
    ui.sphere.classList.remove('spinning');
    updateUI(result);
    addToLog(result);

    let shouldStop = false;

    // 4. Comprobar resultados especiales
    if (result.resultado === 'ganador') {
        showConclusion('win', result.intentoActual);
        showResetButton();
        shouldStop = true;
    } else if (engine.attempts >= MAX_ATTEMPTS) {
        showConclusion('limit', result.intentoActual);
        showResetButton();
        shouldStop = true;
    } else {
        if (Wallet.getBalance() < SPIN_COST) {
            showConclusion('loss', result.intentoActual);
            showResetButton();
            shouldStop = true;
        }
    }

    isSpinning = false;
    if (!isAuto && engine.attempts < MAX_ATTEMPTS) {
        ui.btnSpin.disabled = false;
    }

    return !shouldStop;
};

const handleReset = () => {
    stopAutoSpin();
    engine.reset();
    ui.log.innerHTML = '<p class="empty-log">Aún no has tirado de la tómbola...</p>';
    ui.btnReset.style.display = 'none';
    ui.btnSpin.disabled = false;
    ui.btnSpin.style.display = 'block';
    ui.btnAuto.style.display = 'block';
    updateUI();
};

const showResetButton = () => {
    ui.btnSpin.disabled = true;
    ui.btnSpin.style.display = 'none';
    ui.btnAuto.style.display = 'none';
    ui.btnStop.style.display = 'none';
    ui.btnReset.style.display = 'block';
};

const updateUI = () => {
    const attempts = engine.attempts;
    ui.attemptCount.textContent = attempts;
    const fillPercent = (attempts / MAX_ATTEMPTS) * 100;
    ui.thermoFill.style.height = `${fillPercent}%`;
};

const addToLog = (result) => {
    const entry = document.createElement('p');
    entry.className = `log-entry ${result.resultado}`;
    entry.innerHTML = `Tiro #${result.intentoActual}: <span>${result.resultado === 'ganador' ? '¡GANASTE! 🎁' : 'Nada... ✖'}</span>`;
    
    const emptyMsg = ui.log.querySelector('.empty-log');
    if (emptyMsg) emptyMsg.remove();

    ui.log.prepend(entry);
};

const showConclusion = (type, attempts) => {
    ui.modal.classList.remove('hidden');
    
    if (type === 'win') {
        ui.modalEmoji.textContent = '🎁';
        ui.modalTitle.textContent = '¡Felicidades!';
        ui.modalTitle.className = 'text-neon-cyan';
        ui.modalText.innerHTML = `¡Ganaste en el intento <strong>#${attempts}</strong>! <br><br> Recuerda: este tiro solo tenía un <strong>5% de probabilidad</strong>. <br>Cada tiro fue un evento independiente.`;
    } else if (type === 'limit') {
        ui.modalEmoji.textContent = '🛑';
        ui.modalTitle.textContent = 'Límite de Intentos';
        ui.modalTitle.className = 'text-neon-blue';
        const probNoGanar = (engine.calculateAccumulatedLossProbability(attempts) * 100).toFixed(2);
        ui.modalText.innerHTML = `Has alcanzado el límite de <strong>${MAX_ATTEMPTS}</strong> intentos sin éxito. <br><br> Estadísticamente, tenías un <strong>${(100 - probNoGanar).toFixed(2)}%</strong> de probabilidad de ganar al menos una vez, pero el azar es caprichoso.`;
    } else {
        ui.modalEmoji.textContent = '📉';
        ui.modalTitle.textContent = 'Fin de Fichas';
        ui.modalTitle.className = 'text-neon-red';
        const probNoGanar = (engine.calculateAccumulatedLossProbability(attempts) * 100).toFixed(2);
        ui.modalText.innerHTML = `Te has quedado sin fichas tras <strong>${attempts}</strong> intentos. <br><br> La probabilidad de no ganar ni una sola vez tras ${attempts} intentos fue del <strong>${probNoGanar}%</strong>.`;
    }
};

const checkGameOver = () => {
    if (Wallet.getBalance() < SPIN_COST && engine.attempts > 0) {
        showConclusion('loss', engine.attempts);
        showResetButton();
    }
};
