/**
 * =========================================
 * GAME 4 CONTROLLER - Animación y Lógica
 * =========================================
 */

import { EpidemicEngine } from '../../domain/epidemic_engine.js';
import * as Wallet from '../../domain/wallet_manager.js';

let engine = null;
let selectedCellId = null;
let ui = {};
let animationId = null;

export const initGame4 = () => {
    // Definimos el área de juego
    engine = new EpidemicEngine(500, 450);
    cacheDOM();
    bindEvents();
    startAnimation();
};

const cacheDOM = () => {
    ui = {
        grid: document.getElementById('epidemic-grid'),
        btnNext: document.getElementById('btn-next-round'),
        btnReset: document.getElementById('btn-reset-game'),
        inputP: document.getElementById('input-p'),
        inputLimit: document.getElementById('input-limit'),
        inputBet: document.getElementById('input-bet'),
        valP: document.getElementById('val-p'),
        conclusion: document.getElementById('game-conclusion'),
        conclusionText: document.getElementById('conclusion-text')
    };
};

const bindEvents = () => {
    ui.btnNext.onclick = handleNextRound;
    ui.btnReset.onclick = handleReset;
    
    ui.inputP.oninput = (e) => {
        const p = parseFloat(e.target.value);
        ui.valP.textContent = p;
        engine.setProbability(p);
    };

    ui.inputLimit.oninput = (e) => {
        let val = parseInt(e.target.value);
        if (val > 4) e.target.value = 4;
        if (val < 1) e.target.value = 1;
        engine.setLimit(parseInt(e.target.value));
    };

    ui.inputBet.onchange = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 5) val = 5;
        e.target.value = val;
    };
};

const startAnimation = () => {
    if (animationId) cancelAnimationFrame(animationId);
    
    const loop = () => {
        engine.update();
        renderNodes();
        animationId = requestAnimationFrame(loop);
    };
    loop();
};

const renderNodes = () => {
    // Si el contenedor no existe aún, esperamos
    if (!ui.grid) return;

    // Actualizar nodos existentes o crear nuevos
    engine.nodes.forEach(node => {
        let el = document.getElementById(node.id);
        
        if (!el) {
            el = document.createElement('div');
            el.id = node.id;
            el.onclick = () => selectCell(node.id);
            
            // Creamos un label con el nombre
            const label = document.createElement('span');
            label.className = 'node-label';
            label.textContent = node.nombre;
            el.appendChild(label);
            
            ui.grid.appendChild(el);
        }

        el.className = `persona ${node.estado} ${node.id === selectedCellId ? 'seleccionada' : ''}`;
        el.style.left = `${node.x}px`;
        el.style.top = `${node.y}px`;
        el.style.position = 'absolute';
    });

    // Título global
    const globalTitle = document.getElementById('current-game-title');
    if (globalTitle) {
        globalTitle.textContent = `Contagio Dinámico - Ronda ${engine.round}`;
    }
};

const selectCell = (id) => {
    const node = engine.nodes.find(n => n.id === id);
    if (node.estado !== 'sana') return;

    selectedCellId = id;
    ui.btnNext.disabled = false;
};

const handleNextRound = () => {
    if (!selectedCellId) return;

    const betAmount = parseInt(ui.inputBet.value) || 10;
    
    // Validación de fichas suficientes
    if (!Wallet.hasEnoughChips(betAmount)) {
        return; // Detener si no hay fichas
    }

    const selectedPerson = engine.nodes.find(n => n.id === selectedCellId);
    const newlyInfected = engine.nextRound();
    
    // Sincronizar UI con el nuevo límite del motor
    ui.inputLimit.value = engine.maxContagiosPorRonda;

    if (newlyInfected.includes(selectedCellId)) {
        Wallet.addChips(betAmount);
        showConclusion(`¡Acertaste! ${selectedPerson.nombre} se ha contagiado. Ganaste ${betAmount} fichas.`, 'success');
    } else {
        Wallet.subtractChips(betAmount);
        showConclusion(`Fallaste. ${selectedPerson.nombre} sigue con salud esta ronda. Perdiste ${betAmount} fichas.`, 'error');
    }

    selectedCellId = null;
    ui.btnNext.disabled = true;

    if (engine.nodes.every(n => n.estado === 'contagiada')) {
        showConclusion(`Salón totalmente contagiado. Fin de la simulación.`, 'final');
        ui.btnNext.disabled = true;
    }
};

const handleReset = () => {
    engine.reset();
    selectedCellId = null;
    ui.btnNext.disabled = true;
    ui.conclusion.classList.add('hidden');
    ui.inputLimit.value = engine.maxContagiosPorRonda;
    // Limpiar DOM de nodos viejos
    ui.grid.innerHTML = '';
};

const showConclusion = (message, type) => {
    ui.conclusion.classList.remove('hidden', 'success', 'error', 'final');
    ui.conclusion.classList.add(type);
    ui.conclusionText.textContent = message;
};
