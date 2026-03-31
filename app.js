import { initRouter } from './presentation/app_router.js';
import * as Wallet from './domain/wallet_manager.js';

/**
 * Punto de entrada principal para Casino UTM.
 */
const startApp = () => {
    console.log('[App] Iniciando Casino UTM...');
    Wallet.initWalletUI(); // Inicializar modal de recarga y sus eventos
    Wallet.updateUI();     // Sincronizar fichas iniciales
    initRouter();

    // Evento para prevenir el cierre si hay deuda (Máxima compatibilidad)
    const handleExit = (e) => {
        const balance = Wallet.getBalance();
        if (balance < 0) {
            const message = "No puedes irte le debes al casino";
            console.warn('[Security] Bloqueando salida por deuda detectada:', balance);
            
            // Estándar moderno
            e.preventDefault();
            e.returnValue = message; 
            
            // Para navegadores antiguos y algunos específicos
            return message;
        }
    };

    window.addEventListener('beforeunload', handleExit);
    window.onbeforeunload = handleExit;
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
