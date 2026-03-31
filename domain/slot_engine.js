/**
 * =========================================
 * SLOT ENGINE - Lógica de Tragamonedas
 * =========================================
 */

export const SLOT_SYMBOLS = [
    { id: 'JACKPOT', icon: '💰', prize: 5000, weight: 1 },
    { id: 'STAR', icon: '⭐', prize: 1000, weight: 3 },
    { id: 'DIAMOND', icon: '💎', prize: 500, weight: 7 },
    { id: '7', icon: '7️⃣', prize: 100, weight: 12 },
    { id: 'BAR', icon: '🎰', prize: 50, weight: 20 },
    { id: 'BELL', icon: '🔔', prize: 25, weight: 27 },
    { id: 'CHERRY', icon: '🍒', prize: 15, weight: 30 }
];

export class SlotEngine {
    constructor() {
        this.symbols = SLOT_SYMBOLS;
        this.nearMissChance = 0.40; // 40% de las pérdidas muestran un casi-acierto
        this.totalWeight = this.symbols.reduce((sum, s) => sum + s.weight, 0);
    }

    generateResult() {
        let reel1 = this._getWeightedRandomSymbol();
        let reel2 = this._getWeightedRandomSymbol();
        let reel3 = this._getWeightedRandomSymbol();

        let isWin = reel1.id === reel2.id && reel2.id === reel3.id;
        
        // Lógica de Manipulación Educativa (Near-miss)
        // Solo aplicamos si NO es victoria real
        if (!isWin) {
            if (Math.random() < this.nearMissChance) {
                // Forzamos un near-miss: Reel 1 y Reel 2 iguales, Reel 3 diferente
                // Preferimos hacerlo con símbolos de alto valor para mayor impacto educativo
                const highValueSymbols = this.symbols.slice(0, 4); 
                const baseSymbol = highValueSymbols[Math.floor(Math.random() * highValueSymbols.length)];
                
                reel1 = baseSymbol;
                reel2 = baseSymbol;
                
                // Aseguramos que el reel 3 sea diferente para que siga siendo pérdida
                do {
                    reel3 = this._getWeightedRandomSymbol();
                } while (reel3.id === baseSymbol.id);
                
                return {
                    rodillos: [reel1.id, reel2.id, reel3.id],
                    tipoResultado: 'near-miss',
                    premio: 0,
                    simboloCasi: baseSymbol.icon
                };
            }
        }

        if (isWin) {
            return {
                rodillos: [reel1.id, reel2.id, reel3.id],
                tipoResultado: reel1.id === 'JACKPOT' ? 'jackpot' : 'win',
                premio: reel1.prize,
                simboloGanador: reel1.icon
            };
        }

        return {
            rodillos: [reel1.id, reel2.id, reel3.id],
            tipoResultado: 'loss',
            premio: 0
        };
    }

    _getWeightedRandomSymbol() {
        const randomNum = Math.random() * this.totalWeight;
        let weightSum = 0;

        for (const symbol of this.symbols) {
            weightSum += symbol.weight;
            if (randomNum <= weightSum) {
                return symbol;
            }
        }
        return this.symbols[this.symbols.length - 1];
    }

    getSymbolIcon(id) {
        const symbol = this.symbols.find(s => s.id === id);
        return symbol ? symbol.icon : '❓';
    }
}
