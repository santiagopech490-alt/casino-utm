import { initRouter } from './presentation/app_router.js';

/**
 * Punto de entrada principal para Casino UTM.
 * Se asegura de que el DOM esté listo antes de arrancar.
 */
const startApp = () => {
    console.log('[App] Iniciando Casino UTM...');
    initRouter();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
