/* =========================================
   PROBABILITY ENGINE
   Lógica matemática pura e independiente
   ========================================= */

/**
 * Función: Simula el lanzamiento de una moneda justa (50/50).
 * Demuestra: Independencia de eventos.
 * @returns {string} 'cara' o 'cruz' con 50% de probabilidad cada uno.
 */
export const flipCoinPure = () => {
    // Math.random() genera un número entre 0 (inclusive) y 1 (exclusive).
    // Dividimos el rango exactamente a la mitad.
    return Math.random() < 0.5 ? 'cara' : 'cruz';
};

/**
 * Función: Ejecuta una simulación masiva de lanzamientos.
 * Demuestra: La ley de los grandes números (tiende al 50%).
 * @param {number} iterations - Número de veces a lanzar.
 * @returns {string[]} Array con los resultados ('cara' o 'cruz').
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
 * @param {string[]} history - Array de resultados ('cara', 'cruz').
 * @returns {object} Objeto con conteos y porcentajes.
 */
export const calculateCoinStats = (history) => {
    const total = history.length;
    if (total === 0) return { total: 0, caras: 0, cruces: 0, percCaras: 0, percCruces: 0 };

    const caras = history.filter(res => res === 'cara').length;
    const cruces = total - caras;

    return {
        total,
        caras,
        cruces,
        percCaras: Math.round((caras / total) * 100),
        percCruces: Math.round((cruces / total) * 100)
    };
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
        // En la ruleta europea, los rojos y negros se alternan de forma específica, 
        // pero para el propósito estadístico 18 rojos y 18 negros es equivalente.
        const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        color = reds.includes(number) ? 'rojo' : 'negro';
    }

    return { number, color };
};

/**
 * Función: Calcula el pago neto basado en la apuesta y el resultado.
 * @param {number} betAmount - Cantidad apostada.
 * @param {string} betColor - Color apostado ('rojo', 'negro', 'verde').
 * @param {string} resultColor - Color resultante del giro.
 * @returns {number} Ganancia neta (positiva si gana, negativa si pierde).
 */
export const calculatePayout = (betAmount, betColor, resultColor) => {
    if (betColor === resultColor) {
        if (betColor === 'verde') {
            // El verde paga 35 a 1 en la ruleta real, lo cual mantiene la ventaja de la casa (1/37).
            return betAmount * 35; 
        } else {
            // Rojo/Negro paga 1 a 1.
            return betAmount;
        }
    }
    // Si no coincide, pierdes la apuesta.
    return -betAmount;
};  