/* =========================================
   PROBABILITY ENGINE
   Lógica matemática pura e independiente
   ========================================= */

/**
 * Función: Simula el lanzamiento de una moneda justa (50/50).
 * @returns {string} 'cara' o 'cruz'.
 */
export const flipCoinPure = () => {
    return Math.random() < 0.5 ? 'cara' : 'cruz';
};

/**
 * Función: Ejecuta una simulación masiva de lanzamientos.
 * @param {number} iterations - Número de veces a lanzar.
 * @returns {string[]} Array con los resultados.
 */
export const simulateBatchFlips = (iterations) => {
    const results = [];
    for (let i = 0; i < iterations; i++) {
        results.push(flipCoinPure());
    }
    return results;
};

/**
 * Función: Calcula estadísticas básicas sobre un set de resultados.
 * @param {string[]} history - Array de resultados.
 * @returns {object} Objeto con conteos y porcentajes.
 */
export const calculateCoinStats = (history) => {
    const total = history.length;
    if (total === 0) return { total: 0, caras: 0, cruces: 0, percCaras: 0, percCruces: 0 };
    const caras = history.filter(res => res === 'cara').length;
    const cruces = total - caras;
    return { total, caras, cruces, percCaras: Math.round((caras / total) * 100), percCruces: Math.round((cruces / total) * 100) };
};

/**
 * Función: Simula el giro de una ruleta europea (37 bolsillos).
 * @returns {object} { number: 0-36, color: 'verde'|'rojo'|'negro' }
 */
export const spinRoulette = () => {
    const number = Math.floor(Math.random() * 37);
    let color = '';
    if (number === 0) {
        color = 'verde';
    } else {
        const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        color = reds.includes(number) ? 'rojo' : 'negro';
    }
    return { number, color };
};

/**
 * Función: Calcula el pago neto basado en la apuesta y el resultado.
 * @returns {number} Ganancia neta.
 */
export const calculatePayout = (betAmount, betColor, resultColor) => {
    if (betColor === resultColor) {
        return betColor === 'verde' ? betAmount * 35 : betAmount;
    }
    return -betAmount;
};

// --- Lógica para Juego 3: La Carta que Nunca Sale ---

let streakState = { card: null, count: 0, maxStreak: 3 };

/**
 * Función: Simula la extracción de una carta, con una pequeña probabilidad de entrar en "modo racha".
 * @param {number} totalCards - Número total de cartas.
 * @returns {number} Número aleatorio entre 1 y totalCards.
 */
export const drawCardWithReplacement = (totalCards = 20) => {
    if (streakState.count > 0 && streakState.count < streakState.maxStreak) {
        streakState.count++;
        return streakState.card;
    }
    streakState.count = 0;
    streakState.card = null;
    const result = Math.floor(Math.random() * totalCards) + 1;
    if (Math.random() < 0.1) {
        streakState.card = result;
        streakState.count = 1;
        streakState.maxStreak = Math.random() < 0.5 ? 2 : 3;
    }
    return result;
};

/**
 * Función: Simula la extracción masiva de cartas.
 * @returns {number[]} Array con los resultados.
 */
export const drawBatchCards = (totalCards = 20, batchSize = 20) => {
    const results = [];
    for (let i = 0; i < batchSize; i++) {
        results.push(Math.floor(Math.random() * totalCards) + 1); // El batch es siempre puro
    }
    return results;
};
