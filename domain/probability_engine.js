/**
 * =========================================
 * PROBABILITY ENGINE - Lógica Matemática
 * =========================================
 * Este motor gestiona la generación de eventos aleatorios
 * independientes para demostrar la Falacia del Jugador.
 */

/**
 * Simula el lanzamiento de una moneda física.
 * @returns {string} 'cara' o 'cruz' con P = 0.5.
 */
export const flipCoinPure = () => {
    // Math.random() es suficientemente uniforme para esta demostración.
    return Math.random() < 0.5 ? 'cara' : 'cruz';
};

/**
 * Simula una serie de lanzamientos en lote (Batch).
 * @param {number} count Número de lanzamientos a simular.
 * @returns {Array<string>} Historial de resultados generados.
 */
export const simulateBatch = (count = 20) => {
    const results = [];
    for (let i = 0; i < count; i++) {
        results.push(flipCoinPure());
    }
    return results;
};

/**
 * Calcula las estadísticas actuales de un historial.
 * @param {Array<string>} history Lista de resultados ('cara'/'cruz').
 * @returns {object} { caraCount, cruzCount, caraPct, cruzPct, total }
 */
export const calculateStats = (history) => {
    const total = history.length;
    if (total === 0) return { caraCount: 0, cruzCount: 0, caraPct: 0, cruzPct: 0, total: 0 };

    const caraCount = history.filter(r => r === 'cara').length;
    const cruzCount = total - caraCount;

    return {
        caraCount,
        cruzCount,
        caraPct: ((caraCount / total) * 100).toFixed(1),
        cruzPct: ((cruzCount / total) * 100).toFixed(1),
        total
    };
};

/**
 * Simula el giro de una ruleta europea (37 posiciones).
 * @returns {object} { color: 'verde'|'rojo'|'negro', number: 0-36 }
 */
export const spinRoulette = () => {
    const number = Math.floor(Math.random() * 37);
    let color = '';

    if (number === 0) {
        color = 'verde';
    } else {
        // Para simplificar la visualización y que coincida con el diseño de la ruleta CSS,
        // usaremos una alternancia pura: Impares = Rojo, Pares = Negro.
        color = (number % 2 !== 0) ? 'rojo' : 'negro';
    }

    return { number, color };
};

/**
 * Calcula las ganancias basadas en la apuesta.
 * @param {number} betAmount Cantidad apostada.
 * @param {string} betColor Color elegido por el usuario.
 * @param {string} resultColor Color resultante del giro.
 * @returns {number} Ganancia neta (0 si pierde, >0 si gana).
 */
export const calculatePayout = (betAmount, betColor, resultColor) => {
    if (betColor !== resultColor) return 0;

    // Rojo/Negro paga 1:1 (recuperas apuesta + ganas lo mismo)
    if (betColor === 'rojo' || betColor === 'negro') {
        return betAmount * 2;
    }
    // Verde paga 35:1 (ventaja de la casa clásica)
    if (betColor === 'verde') {
        return betAmount * 36;
    }
    return 0;
};

/**
 * Explicación de la ventaja de la casa en la ruleta.
 */
export const getRouletteEdgeText = () => {
    return "La ruleta tiene 37 números. Si apuestas al Rojo, tienes 18/37 chances (48.6%). El casino tiene 19/37 (51.4%) gracias al **Cero Verde**. Esa diferencia del 2.7% es la 'ventaja de la casa' que garantiza que el casino gane siempre a largo plazo.";
};
