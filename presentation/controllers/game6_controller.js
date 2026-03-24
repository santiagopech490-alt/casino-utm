/**
 * =========================================
 * GAME 6 CONTROLLER - Gacha Card Simulator
 * =========================================
 */

import { GachaEngine } from '../../domain/gacha_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';

let engine = null;
let ui = {};
let isOpening = false;

const COSTS = {
    PACK_10: 160,
    PACK_100: 1400
};

const EDUCATION_TRIGGER = 150; // Cada 150 fallos consecutivos

export const initGame6 = () => {
    engine = new GachaEngine();
    cacheDOM();
    bindEvents();
    updateDashboard();
};

const cacheDOM = () => {
    const container = document.querySelector('.game6-layout');
    if (!container) return;

    ui = {
        totalRolls: container.querySelector('#stat-total-rolls'),
        legendaries: container.querySelector('#stat-legendaries'),
        dryStreak: container.querySelector('#stat-dry-streak'),
        expected: container.querySelector('#stat-expected'),
        displayArea: container.querySelector('#gacha-display-area'),
        btn10: container.querySelector('#btn-buy-10'),
        btn100: container.querySelector('#btn-buy-100'),
        eduModal: container.querySelector('#education-modal'),
        eduStats: container.querySelector('#education-stats'),
        btnCloseEdu: container.querySelector('#btn-close-edu')
    };
};

const bindEvents = () => {
    if (ui.btn10) ui.btn10.onclick = () => handleBuyPack(10, COSTS.PACK_10);
    if (ui.btn100) ui.btn100.onclick = () => handleBuyPack(100, COSTS.PACK_100);
    if (ui.btnCloseEdu) ui.btnCloseEdu.onclick = () => ui.eduModal.classList.add('hidden');
};

const handleBuyPack = async (amount, cost) => {
    if (isOpening) return;

    // 1. Validación de Economía
    if (!Wallet.hasEnoughChips(cost)) {
        return;
    }

    isOpening = true;
    toggleButtons(false);
    Wallet.subtractChips(cost);

    // Limpiar mesa
    ui.displayArea.innerHTML = '';

    for (let i = 0; i < amount; i++) {
        const cardData = engine.rollCard();
        renderCard(cardData);
        updateDashboard();

        // Verificar disparador educativo
        if (engine.consecutiveFails > 0 && engine.consecutiveFails % EDUCATION_TRIGGER === 0) {
            showEducationModule();
        }

        // Suspense entre cartas
        await new Promise(resolve => setTimeout(resolve, 60));
    }

    isOpening = false;
    toggleButtons(true);
};

const renderCard = (data) => {
    const card = document.createElement('div');
    card.className = `gacha-card card-${data.value}`;
    
    const icon = data.value === 'L' ? '💎' : (data.value === 'E' ? '🔥' : (data.value === 'R' ? '⭐' : '🃏'));

    card.innerHTML = `
        <div class="card-inner">
            <span class="card-rarity-label">${data.label}</span>
            <div class="card-icon">${icon}</div>
            <span class="card-roll">ROLL: ${data.roll}</span>
        </div>
    `;

    ui.displayArea.appendChild(card);
    
    // Auto-scroll si hay muchas cartas
    ui.displayArea.scrollTop = ui.displayArea.scrollHeight;
};

const updateDashboard = () => {
    ui.totalRolls.textContent = engine.totalRolls;
    ui.legendaries.textContent = engine.legendariesCount;
    ui.dryStreak.textContent = engine.consecutiveFails;
    ui.expected.textContent = engine.getExpectedLegendaries();
};

const toggleButtons = (enabled) => {
    ui.btn10.disabled = !enabled;
    ui.btn100.disabled = !enabled;
};

const showEducationModule = () => {
    const probFail = (engine.calculateAccumulatedFailureProb() * 100).toFixed(4);
    const expected = engine.getExpectedLegendaries();
    const actual = engine.legendariesCount;

    ui.eduStats.innerHTML = `
        <span class="stat-line">Fallas consecutivas: <strong>${engine.consecutiveFails}</strong></span>
        <span class="stat-line">Probabilidad acumulada de fallar tanto: <strong>${probFail}%</strong></span>
        <span class="stat-line">Legendarias esperadas (Media): <strong>${expected}</strong></span>
        <span class="stat-line">Legendarias obtenidas: <strong>${actual}</strong></span>
    `;

    ui.eduModal.classList.remove('hidden');
};
