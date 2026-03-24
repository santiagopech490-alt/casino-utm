/**
 * =========================================
 * PATTERN ENGINE - Análisis de Aleatoriedad
 * =========================================
 */

export class PatternEngine {
    constructor() {
        this.history = [];
        this.frequencies = Array(11).fill(0); // Índices 1-10
        this.hits = 0;
        this.misses = 0;
        this.streak = 0;
        this.streakType = null; // 'hit' | 'miss'
    }

    roll() {
        const result = Math.floor(Math.random() * 10) + 1;
        this.history.push(result);
        if (this.history.length > 10) this.history.shift(); // Mantener solo últimos 10
        this.frequencies[result]++;
        return result;
    }

    updateStats(isHit) {
        if (isWinner) {
            this.hits++;
            if (this.streakType === 'hit') this.streak++;
            else {
                this.streak = 1;
                this.streakType = 'hit';
            }
        } else {
            this.misses++;
            if (this.streakType === 'miss') this.streak++;
            else {
                this.streak = 1;
                this.streakType = 'miss';
            }
        }
    }

    // Método corregido para recibir el booleano directamente
    registerResult(isHit) {
        if (isHit) {
            this.hits++;
            if (this.streakType === 'hit') this.streak++;
            else {
                this.streak = 1;
                this.streakType = 'hit';
            }
        } else {
            this.misses++;
            if (this.streakType === 'miss') this.streak++;
            else {
                this.streak = 1;
                this.streakType = 'miss';
            }
        }
    }

    getFrequencyData() {
        return this.frequencies.slice(1).map((count, index) => ({
            number: index + 1,
            count: count
        }));
    }

    reset() {
        this.history = [];
        this.frequencies = Array(11).fill(0);
        this.hits = 0;
        this.misses = 0;
        this.streak = 0;
        this.streakType = null;
    }
}
