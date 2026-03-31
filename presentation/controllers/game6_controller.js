/**
 * =========================================
 * GAME 6 CONTROLLER - Gacha Card Simulator (ZZZ REPAIRED)
 * =========================================
 */

import { GachaEngine } from '../../domain/gacha_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';
import { playSound } from '../../domain/sound_manager.js';

let engine = null;
let ui = {};
let isOpening = false;

const COSTS = {
    PACK_10: 160,
    PACK_100: 1400
};

const EDUCATION_TRIGGER = 150; 

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
        btnCloseEdu: container.querySelector('#btn-close-edu'),
        tvPiles: container.querySelector('#tv-piles'),
        statusText: container.querySelector('#gacha-status-text'),
        staticOverlay: container.querySelector('#tv-static-overlay'),
        btnReset: container.querySelector('#btn-reset-gacha')
    };
};

const bindEvents = () => {
    if (ui.btn10) ui.btn10.onclick = () => handleBuyPack(10, COSTS.PACK_10);
    if (ui.btn100) ui.btn100.onclick = () => handleBuyPack(100, COSTS.PACK_100);
    if (ui.btnCloseEdu) ui.btnCloseEdu.onclick = () => ui.eduModal.classList.add('hidden');
    if (ui.btnReset) ui.btnReset.onclick = resetStats;
};

const resetStats = () => {
    if (isOpening) return;
    engine = new GachaEngine();
    ui.displayArea.innerHTML = '<div class="empty-state"><p>DATOS_PURGADOS... ESPERANDO SEÑAL...</p></div>';
    ui.statusText.textContent = 'SYSTEM_RESET_OK';
    updateDashboard();
    playSound('click');
};

const handleBuyPack = async (amount, cost) => {
    if (isOpening) return;

    if (!Wallet.hasEnoughChips(cost)) {
        alert('ERROR: CRÉDITOS INSUFICIENTES');
        return;
    }

    isOpening = true;
    toggleButtons(false);
    Wallet.subtractChips(cost);

    // 1. ZZZ Intro: Efecto Visual + Sonido Zoom
    ui.statusText.textContent = 'CONECTANDO AL SERVIDOR...';
    ui.tvPiles.classList.add('zoom-impact');
    ui.staticOverlay.classList.remove('hidden');
    playSound('zoom');
    
    await new Promise(r => setTimeout(r, 800));

    // Limpiar pantalla
    ui.displayArea.innerHTML = '';
    ui.statusText.textContent = 'DESCARGANDO DATOS...';

    // 2. Revelación de Cartas (Bucle Optimizado)
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < amount; i++) {
        const cardData = engine.rollCard();
        const cardEl = createCardElement(cardData);
        
        ui.displayArea.appendChild(cardEl);
        
        // Sonidos según rareza
        if (cardData.value === 'L') {
            playSound('legendary');
        } else {
            playSound('reveal');
        }

        updateDashboard();

        // Scroll automático vertical (Optimizado para Grid)
        if (i % 4 === 0 || amount <= 10) {
            ui.displayArea.scrollTop = ui.displayArea.scrollHeight;
        }

        // Verificar disparador educativo
        if (engine.consecutiveFails > 0 && engine.consecutiveFails % EDUCATION_TRIGGER === 0) {
            playSound('error');
            showEducationModule();
            await new Promise(r => setTimeout(r, 800)); // Pausa breve por el impacto visual
        }

        // Suspense de 60ms (Ajustado para que se vean todos)
        await new Promise(r => setTimeout(r, 60));
    }

    // 3. Finalización
    ui.tvPiles.classList.remove('zoom-impact');
    ui.staticOverlay.classList.add('hidden');
    ui.statusText.textContent = 'TRANSFERENCIA COMPLETA';
    
    // Asegurar scroll final
    ui.displayArea.scrollLeft = ui.displayArea.scrollWidth;

    isOpening = false;
    toggleButtons(true);
};

const createCardElement = (data) => {
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
    return card;
};

const updateDashboard = () => {
    if (!ui.totalRolls) return;
    ui.totalRolls.textContent = engine.totalRolls;
    ui.legendaries.textContent = engine.legendariesCount;
    ui.dryStreak.textContent = engine.consecutiveFails;
    ui.expected.textContent = engine.getExpectedLegendaries();
};

const toggleButtons = (enabled) => {
    if (ui.btn10) ui.btn10.disabled = !enabled;
    if (ui.btn100) ui.btn100.disabled = !enabled;
};

const showEducationModule = () => {
    const probFail = (engine.calculateAccumulatedFailureProb() * 100).toFixed(6);
    const expected = engine.getExpectedLegendaries();
    const actual = engine.legendariesCount;

    ui.eduStats.innerHTML = `
        <div class="stat-line">> RACHA_FALLOS: <span class="text-neon-red">${engine.consecutiveFails}</span></div>
        <div class="stat-line">> PROB_ACUM_FALLO: <span class="text-neon-red">${probFail}%</span></div>
        <div class="stat-line">> MEDIA_ESPERADA: <span class="text-neon-blue">${expected}</span></div>
        <div class="stat-line">> TOTAL_OBTENIDO: <span class="text-neon-gold">${actual}</span></div>
        <div class="stat-line">> ESTADO: <span class="text-neon-red">ANOMALÍA PROBABILÍSTICA</span></div>
    `;

    ui.eduModal.classList.remove('hidden');
    ui.statusText.textContent = 'SYSTEM ALERT';
};
