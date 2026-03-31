/**
 * =========================================
 * SOUND MANAGER - Sintetizador de Audio Casino UTM
 * =========================================
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const playSound = (type) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    switch (type) {
        // --- GACHA / GENERAL ---
        case 'zoom':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, now);
            oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.5);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            oscillator.start();
            oscillator.stop(now + 0.5);
            break;

        case 'reveal':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(400, now);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start();
            oscillator.stop(now + 0.1);
            break;

        case 'legendary':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, now);
            oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.8);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.8);
            oscillator.start();
            oscillator.stop(now + 0.8);
            break;

        case 'error':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(60, now);
            oscillator.frequency.setValueAtTime(40, now + 0.1);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
            oscillator.start();
            oscillator.stop(now + 0.3);
            break;

        // --- SLOTS (CASINO) ---
        case 'lever_pull':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.4);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
            oscillator.start();
            oscillator.stop(now + 0.4);
            break;

        case 'slot_spin':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.linearRampToValueAtTime(100, now + 0.2);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
            oscillator.start();
            oscillator.stop(now + 0.2);
            break;

        case 'slot_stop':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
            oscillator.start();
            oscillator.stop(now + 0.1);
            break;

        case 'slot_win':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
            oscillator.frequency.setValueAtTime(1046.50, now + 0.3); // C6
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
            oscillator.start();
            oscillator.stop(now + 0.5);
            break;

        case 'jackpot':
            oscillator.type = 'sawtooth';
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
            notes.forEach((freq, i) => {
                oscillator.frequency.setValueAtTime(freq, now + i * 0.05);
            });
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 1.0);
            gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
            oscillator.start();
            oscillator.stop(now + 1.5);
            break;

        // --- PATTERN PERCEPTION (GAME 7) & GENERAL ---
        case 'chip_bet':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, now);
            oscillator.frequency.exponentialRampToValueAtTime(1500, now + 0.05);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
            oscillator.start();
            oscillator.stop(now + 0.1);
            break;

        case 'victory':
            // Una secuencia de notas ascendentes triunfales
            const winNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            winNotes.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);
                gain.gain.setValueAtTime(0.1, now + i * 0.1);
                gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.3);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.3);
            });
            break;

        case 'click':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, now);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
            oscillator.start();
            oscillator.stop(now + 0.05);
            break;

        case 'miss':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(120, now);
            oscillator.frequency.linearRampToValueAtTime(80, now + 0.3);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
            oscillator.start();
            oscillator.stop(now + 0.3);
            break;

        case 'pattern_reveal':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, now); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.4); // A5
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            oscillator.start();
            oscillator.stop(now + 0.5);
            break;

        // --- ROULETTE (GAME 2) ---
        case 'roulette_spin':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.linearRampToValueAtTime(300, now + 3.0);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0.05, now + 2.5);
            gainNode.gain.linearRampToValueAtTime(0, now + 3.0);
            oscillator.start();
            oscillator.stop(now + 3.0);
            break;

        case 'roulette_stop':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
            oscillator.start();
            oscillator.stop(now + 0.2);
            break;
    }
};
