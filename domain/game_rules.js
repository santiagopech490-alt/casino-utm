/**
 * =========================================
 * GAME RULES - Reglas de Negocio
 * =========================================
 */

/**
 * Valida la apuesta según las reglas:
 * 1. Múltiplo de 10.
 * 2. Máximo 100 por tiro.
 * 3. No exceder el límite de deuda de -1000.
 * @param {number} currentChips - Fichas actuales del jugador.
 * @param {number} betAmount - Cantidad que intenta apostar.
 * @param {number} debtLimit - Límite de deuda (negativo).
 * @returns {object} { valid: boolean, message: string }
 */
export const validateBet = (currentChips, betAmount, debtLimit = -1000) => {
    if (betAmount <= 0) {
        return { valid: false, message: 'La apuesta debe ser mayor a 0.' };
    }
    if (betAmount % 10 !== 0) {
        return { valid: false, message: 'La apuesta debe ser múltiplo de 10.' };
    }
    if (betAmount > 100) {
        return { valid: false, message: 'La apuesta máxima por tiro es de 100 fichas.' };
    }
    if (currentChips - betAmount < debtLimit) {
        return { valid: false, message: `Has excedido el límite de deuda permitido (${debtLimit} fichas).` };
    }
    return { valid: true, message: 'Apuesta válida.' };
};
