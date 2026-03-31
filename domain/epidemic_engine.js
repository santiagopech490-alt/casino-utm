/**
 * =========================================
 * EPIDEMIC ENGINE - Motor de Partículas (Agar.io Style)
 * =========================================
 */

const GENERIC_NAMES = [
    "Juan", "María", "Pedro", "Ana", "Luis", "Elena", "Carlos", "Sofía", 
    "Diego", "Lucía", "Jorge", "Laura", "Miguel", "Carmen", "Javier", "Isabel",
    "Andrés", "Rosa", "Fernando", "Marta", "Ricardo", "Paula", "Hugo", "Julia",
    "Roberto", "Daniela", "Alejandro", "Clara", "Gabriel", "Beatriz"
];

export class EpidemicEngine {
    constructor(containerWidth = 500, containerHeight = 400) {
        // Asegurar dimensiones mínimas para evitar errores de rebote
        this.width = Math.max(containerWidth, 400);
        this.height = Math.max(containerHeight, 300);
        this.nodes = [];
        this.p = 0.5;
        this.baseLimit = 3;
        this.maxContagiosPorRonda = this.baseLimit;
        this.round = 1;
        this.nodeRadius = 25; 
        this.infectionRadius = 80; 
        this.reset();
    }

    reset() {
        this.nodes = [];
        this.round = 1;
        this.maxContagiosPorRonda = this.baseLimit;
        
        const shuffledNames = [...GENERIC_NAMES].sort(() => Math.random() - 0.5);

        for (let i = 0; i < 25; i++) {
            const speedFactor = 0.8;
            this.nodes.push({
                id: `node-${i}`,
                nombre: shuffledNames[i % shuffledNames.length],
                x: Math.random() * (this.width - 100) + 50,
                y: Math.random() * (this.height - 100) + 50,
                vx: (Math.random() - 0.5) * speedFactor,
                vy: (Math.random() - 0.5) * speedFactor,
                estado: 'sana'
            });
        }
        this.nodes[0].estado = 'contagiada';
    }

    update() {
        const margin = 45; // Diámetro del nodo en CSS
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Rebote en paredes con márgenes precisos
            if (node.x <= 0) {
                node.x = 0;
                node.vx = Math.abs(node.vx);
            } else if (node.x >= this.width - margin) {
                node.x = this.width - margin;
                node.vx = -Math.abs(node.vx);
            }

            if (node.y <= 0) {
                node.y = 0;
                node.vy = Math.abs(node.vy);
            } else if (node.y >= this.height - margin) {
                node.y = this.height - margin;
                node.vy = -Math.abs(node.vy);
            }
        });
    }

    nextRound() {
        const newlyInfected = [];
        const healthyNodes = this.nodes.filter(n => n.estado === 'sana');
        const infectedNodes = this.nodes.filter(n => n.estado === 'contagiada');

        // Barajar sanos
        const shuffledHealthy = healthyNodes.sort(() => Math.random() - 0.5);

        for (const healthy of shuffledHealthy) {
            if (newlyInfected.length >= this.maxContagiosPorRonda) break;

            // ¿Hay algún contagiado cerca?
            const isNearInfected = infectedNodes.some(infected => {
                const dx = healthy.x - infected.x;
                const dy = healthy.y - infected.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < this.infectionRadius;
            });

            if (isNearInfected && Math.random() < this.p) {
                newlyInfected.push(healthy.id);
            }
        }

        this.nodes.forEach(node => {
            if (newlyInfected.includes(node.id)) {
                node.estado = 'contagiada';
            }
        });

        this.maxContagiosPorRonda = Math.min(10, this.maxContagiosPorRonda + 1);
        this.round += 1;
        return newlyInfected;
    }

    setProbability(p) { this.p = p; }
    setLimit(limit) { 
        let val = Math.max(1, Math.min(4, limit));
        this.baseLimit = val; 
        this.maxContagiosPorRonda = this.baseLimit;
    }
}
