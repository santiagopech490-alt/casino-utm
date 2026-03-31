/**
 * =========================================
 * GAME 6 CONTROLLER - Gacha Card Simulator (ULTRA-ROBUST REPAIR)
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
        statusText: container.querySelector('#gacha-status-text'),
        rareText: container.querySelector('#tv-rare-text'),
        epicText: container.querySelector('#tv-epic-text'),
        tvPiles: container.querySelector('#tv-piles'),
        staticOverlay: container.querySelector('#tv-static-overlay'),
        btnReset: container.querySelector('#btn-reset-gacha'),
        toastContainer: container.querySelector('#gacha-toast-container'),
        victoryModal: container.querySelector('#victory-modal')
    };
};

const bindEvents = () => {
    if (ui.btn10) ui.btn10.onclick = () => handleBuyPack(10, COSTS.PACK_10);
    if (ui.btn100) ui.btn100.onclick = () => handleBuyPack(100, COSTS.PACK_100);
    if (ui.btnReset) ui.btnReset.onclick = resetStats;

    // Cierre de modal educativo (Básico)
    const btnCloseEdu = document.getElementById('btn-close-edu');
    if (btnCloseEdu) {
        btnCloseEdu.onclick = () => {
            const modal = document.getElementById('education-modal');
            if (modal) modal.style.display = 'none';
        };
    }
};

const resetStats = () => {
    if (isOpening) return;
    engine = new GachaEngine();
    ui.displayArea.innerHTML = '<div class="empty-state"><p>DATOS_PURGADOS... ESPERANDO SEÑAL...</p></div>';
    ui.statusText.textContent = 'REINICIO_SISTEMA_OK';
    if (ui.rareText) ui.rareText.textContent = 'SINC_RARA_OK';
    if (ui.epicText) ui.epicText.textContent = 'SINC_EPICA_OK';
    updateDashboard();
    playSound('click');
};

const handleBuyPack = async (amount, cost) => {
    if (isOpening) return;

    if (!Wallet.hasEnoughChips(cost)) {
        alert('ERROR: CRÉDITOS INSUFICIENTES');
        return;
    }

    try {
        isOpening = true;
        toggleButtons(false);
        Wallet.subtractChips(cost);

        ui.statusText.textContent = 'CONECTANDO...';
        ui.tvPiles.classList.add('zoom-impact');
        ui.staticOverlay.classList.remove('hidden');
        playSound('zoom');
        
        await new Promise(r => setTimeout(r, 800));

        ui.displayArea.innerHTML = '';
        ui.statusText.textContent = 'ABRIENDO SOBRES...';

        let hasShownVictoryThisPack = false;

        for (let i = 0; i < amount; i++) {
            const cardData = engine.rollCard();
            const cardEl = createCardElement(cardData);
            ui.displayArea.appendChild(cardEl);
            
            // Actualización de TVs decorativas según rareza
            updateTVDisplays(cardData);

            if (cardData.value === 'L') {
                playSound('legendary');
                showLegendaryToast();

                if (!hasShownVictoryThisPack) {
                    await triggerVictoryModal();
                    hasShownVictoryThisPack = true;
                }
            } else {
                playSound('reveal');
            }

            updateDashboard();
            ui.displayArea.scrollTop = ui.displayArea.scrollHeight;

            if (engine.consecutiveFails > 0 && engine.consecutiveFails % EDUCATION_TRIGGER === 0) {
                playSound('error');
                showEducationModule();
                await new Promise(r => setTimeout(r, 500));
            }

            await new Promise(r => setTimeout(r, 60));
        }

        ui.tvPiles.classList.remove('zoom-impact');
        ui.staticOverlay.classList.add('hidden');
        ui.statusText.textContent = 'PROCESO FINALIZADO';

    } catch (err) {
        console.error('[GACHA] Error crítico en apertura:', err);
    } finally {
        isOpening = false;
        toggleButtons(true);
    }
};

const updateTVDisplays = (cardData) => {
    if (cardData.value === 'L') {
        ui.statusText.textContent = '¡LEGENDARIA DETECTADA!';
        ui.statusText.className = 'status-glitch legendary-glow';
        setTimeout(() => {
            ui.statusText.className = 'status-glitch';
        }, 2000);
    } else if (cardData.value === 'E') {
        if (ui.epicText) {
            ui.epicText.textContent = '¡EPICA ENCONTRADA!';
            ui.epicText.className = 'status-glitch small-text epic-glow';
            setTimeout(() => {
                ui.epicText.textContent = 'SINC_EPICA_OK';
                ui.epicText.className = 'status-glitch small-text';
            }, 1500);
        }
    } else if (cardData.value === 'R') {
        if (ui.rareText) {
            ui.rareText.textContent = '¡RARA DETECTADA!';
            ui.rareText.className = 'status-glitch small-text rare-glow';
            setTimeout(() => {
                ui.rareText.textContent = 'SINC_RARA_OK';
                ui.rareText.className = 'status-glitch small-text';
            }, 1000);
        }
    }
};

/**
 * Muestra una notificación emergente (Toast) rápida.
 */
const showLegendaryToast = () => {
    if (!ui.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'gacha-toast';
    toast.innerHTML = `
        <div class="toast-icon">💎</div>
        <div class="toast-content">
            <h4>¡LEGENDARIA DETECTADA!</h4>
            <p>Simulador Gacha: Hallazgo de alto nivel.</p>
        </div>
    `;

    ui.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
};

/**
 * Muestra el modal de victoria y PAUSA la ejecución hasta que se cierra.
 * Incluye un timeout de seguridad para evitar congelamientos infinitos.
 */
const triggerVictoryModal = () => {
    return new Promise((resolve) => {
        const modal = document.getElementById('victory-modal');
        const closeBtn = document.getElementById('btn-close-victory');
        
        if (!modal || !closeBtn) {
            console.warn('[GACHA] Elementos de victoria no encontrados. Saltando pausa.');
            resolve();
            return;
        }

        const safetyTimeout = setTimeout(() => {
            modal.style.display = 'none';
            resolve();
        }, 10000);

        closeBtn.onclick = () => {
            clearTimeout(safetyTimeout);
            modal.style.display = 'none';
            modal.classList.add('hidden');
            resolve();
        };

        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.zIndex = '99999';
        playSound('victory');
    });
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

    const eModal = document.getElementById('education-modal');
    const eStats = document.getElementById('education-stats');

    if (eStats) {
        eStats.innerHTML = `
            <div class="stat-line">> RACHA_FALLOS: <span class="text-neon-red">${engine.consecutiveFails}</span></div>
            <div class="stat-line">> PROB_ACUM_FALLO: <span class="text-neon-red">${probFail}%</span></div>
            <div class="stat-line">> MEDIA_ESPERADA: <span class="text-neon-blue">${expected}</span></div>
            <div class="stat-line">> TOTAL_OBTENIDO: <span class="text-neon-gold">${actual}</span></div>
            <div class="stat-line">> ESTADO: <span class="text-neon-red">ANOMALÍA</span></div>
        `;
    }

    if (eModal) {
        eModal.style.display = 'flex';
        eModal.style.zIndex = '99999';
    }
};
