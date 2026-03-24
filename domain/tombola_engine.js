/**
 * =========================================
 * TOMBOLA ENGINE - Lógica de Independencia
 * =========================================
 */

export class TombolaEngine {
    constructor() {
        this.winProbability = 0.05; // 5% fijo
        this.reset();
    }

    reset() {
        this.attempts = 0;
    }

    spin() {
        this.attempts++;
        const randomValue = Math.random();
        const isWinner = randomValue < this.winProbability;

        return {
            intentoActual: this.attempts,
            resultado: isWinner ? 'ganador' : 'perdedor',
            probabilidadAplicada: this.winProbability,
            valorObtenido: randomValue
        };
    }

    /**
     * Calcula la probabilidad acumulada de NO haber ganado tras N intentos
     * P(Perder N veces) = (0.95)^N
     */
    calculateAccumulatedLossProbability(n) {
        return Math.pow(1 - this.winProbability, n);
    }
}
