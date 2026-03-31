/**
 * =========================================
 * GAME 8 CONTROLLER - La Ilusión de la Precisión
 * =========================================
 */
import { SlotEngine } from '../../domain/slot_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';
import { playSound } from '../../domain/sound_manager.js';
import { showVictory } from '../components/victory_modal.js';

let engine = null;
let ui = {};
let isSpinning = false;
const SPIN_COST = 50;

let stats = {
    rounds: 0,
    wins: 0
};

export const initGame8 = () => {
    engine = new SlotEngine();
    cacheDOM();
    bindEvents();
    updateUI();
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
        lever: container.querySelector('#slot-lever'),
        feedback: container.querySelector('#slot-feedback'),
        feedbackIcon: container.querySelector('#feedback-icon'),
        feedbackMsg: container.querySelector('#feedback-message'),
        statRounds: container.querySelector('#stat-slots-rounds'),
        statWins: container.querySelector('#stat-slots-wins'),
        btnReset: container.querySelector('#btn-reset-slots-stats'),
        modalBankruptcy: container.querySelector('#slot-bankruptcy-modal'),
        btnModalReset: container.querySelector('#btn-slot-reset')
    };
};

const bindEvents = () => {
    if (ui.lever) ui.lever.onclick = handleSpin;
    if (ui.btnReset) ui.btnReset.onclick = resetStats;
    if (ui.btnModalReset) ui.btnModalReset.onclick = () => ui.modalBankruptcy.classList.add('hidden');
};

const handleSpin = async () => {
    if (isSpinning) return;

    if (!Wallet.hasEnoughChips(SPIN_COST)) {
        if (Wallet.getBalance() < SPIN_COST) {
            ui.modalBankruptcy.classList.remove('hidden');
        }
        return;
    }

    isSpinning = true;
    ui.lever.classList.add('pulled');
    playSound('lever_pull');
    ui.feedback.classList.add('hidden');
    
    ui.reels.forEach(r => r.classList.remove('highlight-win', 'highlight-near', 'highlight-jackpot'));
    Wallet.subtractChips(SPIN_COST);

    const result = engine.generateResult();
    await animateSpin(result);
    processOutcome(result);

    setTimeout(() => {
        ui.lever.classList.remove('pulled');
        isSpinning = false;
    }, 500);
};

const animateSpin = async (result) => {
    ui.reels.forEach(r => r.classList.add('spinning'));
    const updateRandomSymbols = (reelIndex) => {
        const reel = ui.reels[reelIndex];
        const symbolDiv = reel.querySelector('.reel-symbols');
        const randomSymbol = engine.symbols[Math.floor(Math.random() * engine.symbols.length)];
        symbolDiv.textContent = randomSymbol.icon;
        playSound('slot_spin');
    };

    const intervals = ui.reels.map((_, i) => setInterval(() => updateRandomSymbols(i), 100));

    for (let i = 0; i < ui.reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 + i * 800));
        clearInterval(intervals[i]);
        ui.reels[i].classList.remove('spinning');
        ui.reels[i].querySelector('.reel-symbols').textContent = engine.getSymbolIcon(result.rodillos[i]);
        playSound('slot_stop');
    }
};

const processOutcome = (result) => {
    stats.rounds++;
    ui.feedback.classList.remove('hidden');

    if (result.tipoResultado === 'win' || result.tipoResultado === 'jackpot') {
        stats.wins++;
        Wallet.addChips(result.premio);
        showVictory(result.tipoResultado === 'jackpot' ? '¡JACKPOT SLOTS!' : 'Tragamonedas', result.premio, '🎰');

        if (result.tipoResultado === 'jackpot') {
            ui.reels.forEach(r => r.classList.add('highlight-jackpot'));
            playSound('jackpot');
        } else {
            ui.reels.forEach(r => r.classList.add('highlight-win'));
            playSound('slot_win');
        }
    } else if (result.tipoResultado === 'near-miss') {
        ui.reels[0].classList.add('highlight-near');
        ui.reels[1].classList.add('highlight-near');
        playSound('miss');
    }
    
    updateUI();
};

const updateUI = () => {
    if (ui.statRounds) ui.statRounds.textContent = stats.rounds;
    if (ui.statWins) ui.statWins.textContent = stats.wins;
    Wallet.updateUI();
};

const resetStats = () => {
    if (isSpinning) return;
    stats = { rounds: 0, wins: 0 };
    updateUI();
    playSound('click');
};
