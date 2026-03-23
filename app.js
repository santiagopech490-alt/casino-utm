import { initRouter } from './presentation/app_router.js';
import * as Wallet from './domain/wallet_manager.js';

/**
 * Punto de entrada principal para Casino UTM.
 */
const startApp = () => {
    console.log('[App] Iniciando Casino UTM...');
    Wallet.updateUI(); // Sincronizar fichas iniciales
    initRouter();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
