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