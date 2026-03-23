/**
 * =========================================
 * WALLET MANAGER - Gestión de Fichas Global
 * =========================================
 */

let balance = 1000; // Saldo inicial

export const getBalance = () => balance;

export const addChips = (amount) => {
    balance += amount;
    updateUI();
    return balance;
};

export const subtractChips = (amount) => {
    if (balance - amount < -1000) return false; // Límite de deuda
    balance -= amount;
    updateUI();
    return true;
};

export const updateUI = () => {
    const walletDisplay = document.getElementById('wallet-balance');
    if (walletDisplay) {
        walletDisplay.textContent = balance;
        walletDisplay.classList.toggle('text-neon-red', balance < 0);
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', updateUI);
