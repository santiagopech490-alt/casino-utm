/**
 * =========================================
 * TOMBOLA ENGINE - Lógica de Intentos Independientes
 * =========================================
 * Este motor demuestra que la probabilidad no "se acumula" por intentar
 * más veces. Cada tiro es un evento nuevo e independiente.
 */

export class TombolaEngine {
    constructor(winProbability = 0.05, maxAttempts = 100) {
        this.winProbability = winProbability;
        this.maxAttempts = maxAttempts;
        this.attempts = 0;
    }

    /**
     * Realiza un tiro de la tómbola.
     * @returns {object} { attempt, isWin, probability }
     */
    draw() {
        if (this.attempts >= this.maxAttempts) {
            return { error: 'Límite de intentos alcanzado' };
        }

        this.attempts++;
        const randomVal = Math.random();
        const isWin = randomVal < this.winProbability;

        return {
            attempt: this.attempts,
            isWin: isWin,
            probability: this.winProbability,
            randomVal: randomVal.toFixed(4)
        };
    }

    reset() {
        this.attempts = 0;
    }

    getRemainingAttempts() {
        return this.maxAttempts - this.attempts;
    }
}
