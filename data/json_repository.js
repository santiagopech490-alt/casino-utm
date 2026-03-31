/**
 * =========================================
 * JSON REPOSITORY - Persistencia de Datos
 * =========================================
 */

const STORAGE_KEY = 'casino_utm_data';

const DEFAULT_STATE = {
    "usuario": "Estudiante",
    "wallet_balance": 1000,
    "global_stats": {
        "total_apostado": 0,
        "total_ganado": 0
    },
    "juegos": {
        "game1": { "jugado": false, "intentos": 0, "victorias": 0 },
        "game2": { "jugado": false, "intentos": 0, "victorias": 0 },
        "game3": { "jugado": false, "intentos": 0, "victorias": 0 },
        "game4": { "jugado": false, "intentos": 0, "victorias": 0 },
        "game5": { "jugado": false, "intentos": 0, "victorias": 0 },
        "game6": { "jugado": false, "intentos": 0, "victorias": 0 },
        "game7": { "jugado": false, "intentos": 0, "victorias": 0 },
        "game8": { "jugado": false, "intentos": 0, "victorias": 0 }
    }
};

/**
 * Carga el estado actual desde el almacenamiento persistente.
 */
export const loadData = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        saveData(DEFAULT_STATE);
        return DEFAULT_STATE;
    }
    return JSON.parse(data);
};

/**
 * Guarda el estado completo en formato JSON.
 */
export const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * Actualiza una propiedad específica del estado global.
 */
export const updateState = (updates) => {
    const currentState = loadData();
    const newState = { ...currentState, ...updates };
    saveData(newState);
    return newState;
};

/**
 * Registra estadísticas de una partida de juego.
 */
export const saveGameResult = (gameId, isWin, betAmount, prizeAmount) => {
    const state = loadData();
    const gameKey = gameId; // ej: 'game1'

    if (state.juegos[gameKey]) {
        state.juegos[gameKey].jugado = true;
        state.juegos[gameKey].intentos += 1;
        if (isWin) state.juegos[gameKey].victorias += 1;
    }

    state.global_stats.total_apostado += betAmount;
    state.global_stats.total_ganado += prizeAmount;
    state.wallet_balance = state.wallet_balance - betAmount + prizeAmount;

    saveData(state);
};
