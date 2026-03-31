/**
 * =========================================
 * GAME 5 CONTROLLER - Suerte y N° de Intentos
 * =========================================
 */
import { TombolaEngine } from '../../domain/tombola_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';
import { playSound } from '../../domain/sound_manager.js';
import { showVictory } from '../components/victory_modal.js';

let engine = null;
let autoInterval = null;
let gameState = {
    isAutoRunning: false,
    costPerDraw: 10,
    hasWon: false
};

let ui = {};

export const initGame5 = () => {
    cacheDOM();
    if (!ui.container) return;

    engine = new TombolaEngine(0.05, 100);
    bindEvents();
    resetStats();
};

const cacheDOM = () => {
    const container = document.querySelector('.game-container');
    if (!container) return;

    ui = {
        container,
        ball: container.querySelector('#tombola-ball'),
        ballContent: container.querySelector('#ball-content'),
        progressBar: container.querySelector('#tombola-progress-bar'),
        btnManual: container.querySelector('#btn-draw-manual'),
        btnAutoStart: container.querySelector('#btn-auto-start'),
        btnAutoStop: container.querySelector('#btn-auto-stop'),
        btnReset: container.querySelector('#btn-reset-tombola'),
        statAttempts: container.querySelector('#stat-attempts'),
        log: container.querySelector('#tombola-log'),
        conclusion: container.querySelector('#game-conclusion'),
        conclusionText: container.querySelector('#conclusion-text')
    };
};

const bindEvents = () => {
    ui.btnManual.onclick = handleManualDraw;
    ui.btnAutoStart.onclick = startAutoDraw;
    ui.btnAutoStop.onclick = stopAutoDraw;
    ui.btnReset.onclick = resetStats;
};

const handleManualDraw = async () => {
    if (gameState.hasWon || engine.attempts >= 100) return;
    await executeDraw();
};

const executeDraw = async () => {
    if (!Wallet.subtractChips(gameState.costPerDraw)) {
        playSound('error');
        stopAutoDraw();
        return false;
    }

    playSound('chip_bet');
    ui.ball.classList.add('shake');
    ui.ballContent.textContent = "...";

    await new Promise(resolve => setTimeout(resolve, 300));

    const result = engine.draw();
    ui.ball.classList.remove('shake');

    if (result.error) {
        stopAutoDraw();
        return false;
    }

    const logItem = document.createElement('div');
    if (result.isWin) {
        gameState.hasWon = true;
        ui.ball.classList.add('win');
        ui.ballContent.textContent = "🏆";
        logItem.className = 'log-item win';
        logItem.innerHTML = `<span>#${result.attempt}</span> <span>¡GANADOR!</span>`;
        
        const prize = 200;
        Wallet.addChips(prize);
        showVictory('Tómbola de la Suerte', prize, '🎰', () => {
            resetVisualsAfterWin();
        });
        stopAutoDraw();
        showConclusion();
    } else {
        ui.ballContent.textContent = "X";
        logItem.className = 'log-item loss';
        logItem.innerHTML = `<span>#${result.attempt}</span> <span>Sigue intentando...</span>`;
        playSound('click');
    }

    ui.log.prepend(logItem);
    updateUI();

    if (engine.attempts >= 100 && !gameState.hasWon) {
        stopAutoDraw();
        showConclusion();
    }

    return result.isWin;
};

const startAutoDraw = () => {
    if (gameState.hasWon || engine.attempts >= 100) return;
    gameState.isAutoRunning = true;
    ui.btnAutoStart.classList.add('hidden');
    ui.btnAutoStop.classList.remove('hidden');
    ui.btnManual.disabled = true;

    autoInterval = setInterval(async () => {
        const won = await executeDraw();
        if (won || engine.attempts >= 100 || !gameState.isAutoRunning) {
            stopAutoDraw();
        }
    }, 400);
};

const stopAutoDraw = () => {
    gameState.isAutoRunning = false;
    if (autoInterval) clearInterval(autoInterval);
    ui.btnAutoStart.classList.remove('hidden');
    ui.btnAutoStop.classList.add('hidden');
    ui.btnManual.disabled = gameState.hasWon || engine.attempts >= 100;
};

const updateUI = () => {
    ui.statAttempts.textContent = engine.attempts;
    const progress = (engine.attempts / 100) * 100;
    ui.progressBar.style.width = `${progress}%`;
    Wallet.updateUI();

    if (gameState.hasWon || engine.attempts >= 100) {
        ui.btnManual.disabled = true;
        ui.btnAutoStart.disabled = true;
    }
};

const showConclusion = () => {
    ui.conclusion.classList.remove('hidden');
    const msg = gameState.hasWon 
        ? `<strong>¡Ganaste!</strong> Pero observa: el hecho de que hayas ganado en el intento #${engine.attempts} no significa que tu suerte fuera mejorando.`
        : `<strong>Sesión Finalizada.</strong> Realizaste 100 intentos con un 5% de probabilidad cada uno y no ganaste.`;
    
    ui.conclusionText.innerHTML = msg;
};

const resetVisualsAfterWin = () => {
    gameState.hasWon = false;
    ui.ball.className = 'tombola-ball';
    ui.ballContent.textContent = "?";
    ui.btnManual.disabled = false;
    ui.btnAutoStart.disabled = false;
};

const resetStats = () => {
    stopAutoDraw();
    if (engine) engine.reset();
    gameState.hasWon = false;
    ui.ball.className = 'tombola-ball';
    ui.ballContent.textContent = "?";
    ui.log.innerHTML = '';
    ui.conclusion.classList.add('hidden');
    ui.btnManual.disabled = false;
    ui.btnAutoStart.disabled = false;
    updateUI();
};
