/**
 * =========================================
 * GAME 4 CONTROLLER - Contagio en el Salón
 * =========================================
 */
import { EpidemicEngine } from '../../domain/epidemic_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';
import { playSound } from '../../domain/sound_manager.js';
import { showVictory } from '../components/victory_modal.js';

let engine = null;
let animationId = null;
let gameState = {
    selectedNodeId: null,
    betAmount: 10,
    rounds: 1,
    isProcessingRound: false
};

let ui = {};

export const initGame4 = () => {
    stopGame4();
    window.currentGameStop = stopGame4;
    
    cacheDOM();
    if (!ui.container) return;

    const width = ui.canvas.clientWidth || 600;
    const height = ui.canvas.clientHeight || 450;

    engine = new EpidemicEngine(width, height);
    bindEvents();
    resetStats();
    startLoop();
};

export const stopGame4 = () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    engine = null;
};

const cacheDOM = () => {
    const container = document.querySelector('.game-container');
    if (!container) return;

    ui = {
        container,
        canvas: container.querySelector('#epidemic-canvas-container'),
        nodeName: container.querySelector('#selected-node-name'),
        betDisplay: container.querySelector('#ep-bet-display'),
        btnBetPlus: container.querySelector('#btn-ep-bet-plus'),
        btnBetMinus: container.querySelector('#btn-ep-bet-minus'),
        btnNextRound: container.querySelector('#btn-next-round'),
        btnReset: container.querySelector('#btn-reset-epidemic'),
        statRound: container.querySelector('#stat-ep-round'),
        statHealthy: container.querySelector('#stat-ep-healthy'),
        statInfected: container.querySelector('#stat-ep-infected'),
        resultsList: container.querySelector('#round-results-list'),
        conclusion: container.querySelector('#game-conclusion'),
        conclusionText: container.querySelector('#conclusion-text')
    };
};

const bindEvents = () => {
    ui.btnBetPlus.onclick = () => changeBet(5);
    ui.btnBetMinus.onclick = () => changeBet(-5);
    ui.btnNextRound.onclick = handleNextRound;
    ui.btnReset.onclick = resetStats;
};

const startLoop = () => {
    const loop = () => {
        if (!engine) return;
        engine.update();
        renderNodes();
        animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);
};

const renderNodes = () => {
    const nodes = engine.nodes;
    nodes.forEach(node => {
        let nodeEl = ui.canvas.querySelector(`[data-id="${node.id}"]`);
        if (!nodeEl) {
            nodeEl = document.createElement('div');
            nodeEl.className = 'ep-node';
            nodeEl.dataset.id = node.id;
            nodeEl.innerHTML = `<div class="node-nucleus"></div><span class="node-name">${node.nombre}</span>`;
            nodeEl.onclick = () => selectNode(node);
            ui.canvas.appendChild(nodeEl);
        }
        nodeEl.style.left = `${node.x}px`;
        nodeEl.style.top = `${node.y}px`;
        nodeEl.className = `ep-node ${node.estado} ${gameState.selectedNodeId === node.id ? 'selected' : ''}`;
    });

    ui.statHealthy.textContent = nodes.filter(n => n.estado === 'sana').length;
    ui.statInfected.textContent = nodes.filter(n => n.estado === 'contagiada').length;
};

const selectNode = (node) => {
    if (gameState.isProcessingRound || node.estado === 'contagiada') return;
    playSound('click');
    gameState.selectedNodeId = node.id;
    ui.nodeName.textContent = node.nombre;
    ui.btnNextRound.disabled = false;
};

const changeBet = (amount) => {
    if (gameState.isProcessingRound) return;
    const nextBet = gameState.betAmount + amount;
    if (nextBet >= 5 && nextBet <= 500) {
        gameState.betAmount = nextBet;
        ui.betDisplay.textContent = gameState.betAmount;
        playSound('click');
    }
};

const handleNextRound = async () => {
    if (gameState.isProcessingRound || !gameState.selectedNodeId) return;

    if (!Wallet.subtractChips(gameState.betAmount)) {
        playSound('error');
        return;
    }

    gameState.isProcessingRound = true;
    ui.btnNextRound.disabled = true;
    playSound('chip_bet');

    const newlyInfectedIds = engine.nextRound();
    const targetNode = engine.nodes.find(n => n.id === gameState.selectedNodeId);

    const resultItem = document.createElement('div');
    const isNowInfected = newlyInfectedIds.includes(gameState.selectedNodeId);
    
    if (isNowInfected) {
        resultItem.className = 'result-item win';
        resultItem.textContent = `R${engine.round-1}: ${targetNode.nombre} se contagió. ¡Ganaste!`;
        const prize = gameState.betAmount * 4;
        Wallet.addChips(prize);
        showVictory('Contagio en el Salón', prize, '🧬', () => {
            resetVisuals();
        });
    } else {
        resultItem.className = 'result-item loss';
        resultItem.textContent = `R${engine.round-1}: ${targetNode.nombre} sigue sano.`;
        playSound('miss');
    }

    ui.resultsList.prepend(resultItem);
    ui.statRound.textContent = engine.round;

    if (engine.round > 10 || engine.nodes.every(n => n.estado === 'contagiada')) {
        showConclusion();
    }

    gameState.isProcessingRound = false;
    updateUI();
};

const updateUI = () => {
    Wallet.updateUI();
    if (gameState.selectedNodeId) {
        const node = engine.nodes.find(n => n.id === gameState.selectedNodeId);
        if (node && node.estado === 'contagiada') {
            resetVisuals();
        }
    }
};

const showConclusion = () => {
    ui.conclusion.classList.remove('hidden');
    ui.conclusionText.innerHTML = `
        <strong>Análisis Epidémico:</strong> El contagio no es azar puro; es <strong>probabilidad condicional</strong>. 
        A medida que hay más contagiados, la probabilidad de que un sano esté cerca de un foco aumenta exponencialmente.
    `;
};

const resetVisuals = () => {
    gameState.selectedNodeId = null;
    ui.nodeName.textContent = "Ninguno";
    ui.btnNextRound.disabled = true;
};

const resetStats = () => {
    if (engine) engine.reset();
    gameState.rounds = 1;
    gameState.isProcessingRound = false;
    
    ui.canvas.innerHTML = '<div id="simulation-overlay" class="simulation-overlay"><p id="overlay-msg">Selecciona a una persona sana para apostar</p></div>';
    ui.resultsList.innerHTML = '';
    ui.statRound.textContent = "1";
    ui.conclusion.classList.add('hidden');
    resetVisuals();
    updateUI();
};
