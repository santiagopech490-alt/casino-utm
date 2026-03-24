/**
 * =========================================
 * SLOT ENGINE - Lógica de Tragamonedas
 * =========================================
 */

export const SLOT_SYMBOLS = [
    { id: '7', icon: '7️⃣', prize: 100 },
    { id: 'STAR', icon: '⭐', prize: 1000 },
    { id: 'BELL', icon: '🔔', prize: 25 },
    { id: 'CHERRY', icon: '🍒', prize: 15 }
];

export class SlotEngine {
    constructor() {
        this.symbols = SLOT_SYMBOLS;
        this.nearMissChance = 0.4; // 40% de las veces que se pierde, forzar un near-miss
    }

    generateResult() {
        let reel1 = this._getRandomSymbol();
        let reel2 = this._getRandomSymbol();
        let reel3 = this._getRandomSymbol();

        let rodillos = [reel1.id, reel2.id, reel3.id];
        let isWin = reel1.id === reel2.id && reel2.id === reel3.id;
        
        // Lógica de Manipulación Educativa (Near-miss)
        if (!isWin) {
            if (Math.random() < this.nearMissChance) {
                // Forzamos un near-miss: Reel 1 y Reel 2 iguales, Reel 3 diferente
                reel2 = reel1;
                // Nos aseguramos que el reel 3 sea diferente para que siga siendo pérdida
                do {
                    reel3 = this._getRandomSymbol();
                } while (reel3.id === reel1.id);
                
                rodillos = [reel1.id, reel2.id, reel3.id];
                return {
                    rodillos,
                    tipoResultado: 'near-miss',
                    premio: 0
                };
            }
        }

        if (isWin) {
            return {
                rodillos,
                tipoResultado: 'win',
                premio: reel1.prize
            };
        }

        return {
            rodillos,
            tipoResultado: 'loss',
            premio: 0
        };
    }

    _getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    getSymbolIcon(id) {
        return this.symbols.find(s => s.id === id).icon;
    }
}
