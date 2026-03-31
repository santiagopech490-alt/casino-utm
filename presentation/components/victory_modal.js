import { playSound } from '../../domain/sound_manager.js';

/**
 * Componente VictoryModal
 * Gestiona la visualización de premios y feedback de victoria.
 */

let currentOnConfirm = null;
let isInitialized = false;

const initializeModal = () => {
    if (isInitialized) return;
    
    const btnConfirm = document.getElementById('btn-victory-confirm');
    const modal = document.getElementById('victory-modal');

    if (btnConfirm && modal) {
        btnConfirm.addEventListener('click', () => {
            modal.classList.remove('active');
            if (currentOnConfirm && typeof currentOnConfirm === 'function') {
                currentOnConfirm();
                currentOnConfirm = null; 
            }
        });
        isInitialized = true;
    }
};

/**
 * Muestra el modal de victoria con los datos proporcionados.
 */
export const showVictory = (gameName, amount, icon = '🏆', onConfirm = null) => {
    // Asegurar que el listener del botón esté listo
    initializeModal();

    const modal = document.getElementById('victory-modal');
    const emojiEl = document.getElementById('victory-emoji');
    const gameNameEl = document.getElementById('victory-game-name');
    const amountEl = document.getElementById('victory-amount');

    if (!modal) {
        console.error('Victory Modal no encontrado en el DOM');
        return;
    }

    // Actualizar contenido dinámico
    if (emojiEl) emojiEl.textContent = icon;
    if (gameNameEl) gameNameEl.textContent = gameName;
    if (amountEl) amountEl.textContent = `+${amount}`;
    
    currentOnConfirm = onConfirm;

    playSound('slot_win');
    modal.classList.add('active');
};
