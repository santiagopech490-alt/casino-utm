/**
 * =========================================
 * WALLET MANAGER - Gestión de Fichas Global
 * =========================================
 */

let balance = 1000;

export const getBalance = () => balance;

export const addChips = (amount) => {
    balance += amount;
    updateUI();
    return balance;
};

export const subtractChips = (amount) => {
    if (balance < amount) {
        showError("Fichas insuficientes", `Necesitas ${amount} fichas, pero solo tienes ${balance}.`);
        return false;
    }
    balance -= amount;
    updateUI();
    return true;
};

export const hasEnoughChips = (amount) => {
    if (balance < amount) {
        showError("Fichas insuficientes", `Necesitas ${amount} fichas para esta apuesta.`);
        return false;
    }
    return true;
};

export const updateUI = () => {
    const walletDisplay = document.getElementById('wallet-balance');
    if (walletDisplay) {
        walletDisplay.textContent = balance;
        walletDisplay.classList.toggle('text-neon-red', balance < 0);
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

    // Abrir modal
    btnOpen.onclick = () => {
        modal.classList.add('active');
        inputAmount.value = 100;
    };

    // Cerrar modal
    btnClose.onclick = () => modal.classList.remove('active');

    // Botones +/- 5
    document.getElementById('btn-plus-5').onclick = () => {
        inputAmount.value = parseInt(inputAmount.value) + 5;
    };
    document.getElementById('btn-minus-5').onclick = () => {
        const val = parseInt(inputAmount.value);
        if (val > 5) inputAmount.value = val - 5;
    };

    // Accion: Aumentar
    document.getElementById('btn-action-add').onclick = () => {
        const amount = parseInt(inputAmount.value);
        if (isNaN(amount) || amount <= 0) return;
        
        addChips(amount);
        modal.classList.remove('active');
        showConfirmation('deposit', amount);
    };

    // Accion: Remover
    document.getElementById('btn-action-remove').onclick = () => {
        const amount = parseInt(inputAmount.value);
        if (isNaN(amount) || amount <= 0) return;

        if (subtractChips(amount)) {
            modal.classList.remove('active');
            showConfirmation('withdraw', amount);
        }
    };

    // Cerrar confirmación
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

// Auto-inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    initWalletUI();
});
