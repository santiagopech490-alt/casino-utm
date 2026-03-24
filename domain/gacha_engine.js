/**
 * =========================================
 * GACHA ENGINE - Lógica de Loot Boxes
 * =========================================
 */

export const RARITIES = {
    LEGENDARY: { label: 'Legendario', value: 'L', color: '#f59e0b', chance: 5 },
    EPIC: { label: 'Épico', value: 'E', color: '#a855f7', chance: 20 },
    RARE: { label: 'Raro', value: 'R', color: '#3b82f6', chance: 50 },
    COMMON: { label: 'Común', value: 'C', color: '#94a3b8', chance: 100 }
};

export class GachaEngine {
    constructor() {
        this.totalRolls = 0;
        this.legendariesCount = 0;
        this.consecutiveFails = 0;
    }

    rollCard() {
        this.totalRolls++;
        const rng = Math.random() * 100;
        let rarity;

        if (rng <= RARITIES.LEGENDARY.chance) {
            rarity = RARITIES.LEGENDARY;
            this.legendariesCount++;
            this.consecutiveFails = 0;
        } else if (rng <= RARITIES.EPIC.chance) {
            rarity = RARITIES.EPIC;
            this.consecutiveFails++;
        } else if (rng <= RARITIES.RARE.chance) {
            rarity = RARITIES.RARE;
            this.consecutiveFails++;
        } else {
            rarity = RARITIES.COMMON;
            this.consecutiveFails++;
        }

        return {
            ...rarity,
            roll: rng.toFixed(2),
            timestamp: Date.now()
        };
    }

    /**
     * P(fallar L)^n = (0.95)^n
     */
    calculateAccumulatedFailureProb() {
        return Math.pow(0.95, this.consecutiveFails);
    }

    /**
     * E = n * p
     */
    getExpectedLegendaries() {
        return (this.totalRolls * 0.05).toFixed(2);
    }

    reset() {
        this.totalRolls = 0;
        this.legendariesCount = 0;
        this.consecutiveFails = 0;
    }
}
