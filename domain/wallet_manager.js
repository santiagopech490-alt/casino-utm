import * as Repository from '../data/json_repository.js';
import { playSound } from './sound_manager.js';

/**
 * =========================================
 * WALLET MANAGER - Gestión de Fichas con Persistencia
 * =========================================
 */

export const getBalance = () => {
    const data = Repository.loadData();
    return data.wallet_balance;
};

export const addChips = (amount) => {
    const currentBalance = getBalance();
    const newBalance = currentBalance + amount;
    Repository.updateState({ wallet_balance: newBalance });
    updateUI();
    return newBalance;
};

export const subtractChips = (amount) => {
    const currentBalance = getBalance();
    const limit = -1000;
    
    if (currentBalance - amount < limit) {
        showError("Límite de crédito excedido", `Tu saldo no puede ser inferior a ${limit} fichas. Por favor, recarga para seguir jugando.`);
        return false;
    }
    const newBalance = currentBalance - amount;
    Repository.updateState({ wallet_balance: newBalance });
    updateUI();
    return true;
};

export const hasEnoughChips = (amount) => {
    if (getBalance() - amount < -1000) {
        showError("Crédito Insuficiente", `Esta apuesta excedería tu límite de crédito de -1000 fichas.`);
        return false;
    }
    return true;
};

export const updateUI = () => {
    const walletDisplay = document.getElementById('wallet-balance');
    if (walletDisplay) {
        const balance = getBalance();
        walletDisplay.textContent = balance;
        // El saldo se pone rojo si es negativo
        walletDisplay.classList.toggle('text-neon-red', balance < 0);
        walletDisplay.style.textShadow = balance < 0 ? '0 0 10px rgba(255, 0, 0, 0.5)' : '';
    }
};

/**
 * --- SISTEMA DE MODALES ---
 */
export const initWalletUI = () => {
    const modal = document.getElementById('wallet-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const btnOpen = document.getElementById('btn-recharge-modal');
    const btnClose = document.getElementById('btn-close-modal');
    const inputAmount = document.getElementById('input-chip-amount');
    
    if (!modal || !btnOpen) return;

    btnOpen.onclick = () => {
        modal.classList.add('active');
        inputAmount.value = 500;
    };

    btnClose.onclick = () => modal.classList.remove('active');

    // Nuevos incrementos para recarga rápida
    const setupStep = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
            el.onclick = (e) => {
                e.preventDefault();
                const current = parseInt(inputAmount.value) || 0;
                inputAmount.value = Math.max(0, current + val);
                playSound('click'); // Feedback de sonido
            };
        }
    };

    setupStep('btn-plus-5', 100);   // +100
    setupStep('btn-minus-5', -100); // -100
    setupStep('btn-plus-500', 500); // +500
    setupStep('btn-minus-500', -500); // -500

    const addAction = document.getElementById('btn-action-add');
    if (addAction) addAction.onclick = () => {
        const amount = parseInt(inputAmount.value);
        if (isNaN(amount) || amount <= 0) return;
        addChips(amount);
        modal.classList.remove('active');
        showConfirmation('deposit', amount);
        playSound('chip_bet');
    };

    const removeAction = document.getElementById('btn-action-remove');
    if (removeAction) removeAction.onclick = () => {
        const amount = parseInt(inputAmount.value);
        if (isNaN(amount) || amount <= 0) return;
        if (subtractChips(amount)) {
            modal.classList.remove('active');
            showConfirmation('withdraw', amount);
        }
    };

    document.getElementById('btn-confirm-ok').onclick = () => {
        confirmModal.classList.remove('active');
    };
};

export const showError = (title, message) => {
    const confirmModal = document.getElementById('confirm-modal');
    const emoji = document.getElementById('confirm-emoji');
    const titleEl = document.getElementById('confirm-title');
    const text = document.getElementById('confirm-text');

    emoji.textContent = '⚠️';
    titleEl.textContent = title;
    titleEl.className = 'text-neon-red';
    text.innerHTML = message;
    confirmModal.classList.add('active');
};

const showConfirmation = (type, amount) => {
    const confirmModal = document.getElementById('confirm-modal');
    const emoji = document.getElementById('confirm-emoji');
    const title = document.getElementById('confirm-title');
    const text = document.getElementById('confirm-text');

    if (type === 'deposit') {
        emoji.textContent = '🚀';
        title.textContent = '¡Fichas Añadidas!';
        title.className = 'text-neon-green';
        text.innerHTML = `Se han agregado <strong>${amount}</strong> fichas a tu cuenta. <br>¡Buena suerte en las mesas!`;
    } else {
        emoji.textContent = '💸';
        title.textContent = '¡Retiro Exitoso!';
        title.className = 'text-neon-red';
        text.innerHTML = `Se han retirado <strong>${amount}</strong> fichas. <br>Tu nuevo saldo se ha actualizado.`;
    }
    confirmModal.classList.add('active');
};
