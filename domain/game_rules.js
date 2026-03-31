/**
 * =========================================
 * GAME RULES - Reglas de Negocio del Casino
 * =========================================
 */

/**
 * Valida si una apuesta es permitida.
 * @param {number} currentBalance Saldo actual del Wallet.
 * @param {number} betAmount Cantidad que se desea apostar.
 * @param {object} constraints Restricciones adicionales (min, max, debtLimit).
 * @returns {object} { isValid, message }
 */
export const validateBet = (currentBalance, betAmount, constraints = { min: 10, max: 100, debtLimit: -1000 }) => {
    // Regla 1: Múltiplos de 10
    if (betAmount % 10 !== 0) {
        return { isValid: false, message: "La apuesta debe ser en múltiplos de 10." };
    }

    // Regla 2: Límites de mesa
    if (betAmount < constraints.min || betAmount > constraints.max) {
        return { isValid: false, message: `La apuesta debe estar entre ${constraints.min} y ${constraints.max} fichas.` };
    }

    // Regla 3: Límite de crédito (Deuda)
    if (currentBalance - betAmount < constraints.debtLimit) {
        return { isValid: false, message: "Has alcanzado el límite de crédito permitido (-1000)." };
    }

    return { isValid: true };
};

/**
 * Determina si el jugador ha entrado en bancarrota total.
 * @param {number} balance Saldo actual.
 * @returns {boolean}
 */
export const isBankrupt = (balance) => balance <= -1000;
