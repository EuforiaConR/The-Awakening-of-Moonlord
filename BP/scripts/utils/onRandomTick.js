import { system } from "@minecraft/server";

const RandomTickRegistry = {
    listeners: [],

    /** Registra una nueva funcion con una probabilidad (0.0 a 1.0) */
    onRandomTick(callback, probability = 0.1) {
        this.listeners.push({ callback, probability });
    },

    /** Llama internamente a las funciones de manera aleatoria */
    tick() {
        for (const { callback, probability } of this.listeners) {
            if (Math.random() < probability) {
                try {
                    callback();
                } catch (e) {
                    console.warn(`[onRandomTick] Error: ${e}`);
                }
            }
        }
    },
};

system.runInterval(() => {
    RandomTickRegistry.tick();
}, 20);

export function onRandomTick(callback, probability = 0.1) {
    RandomTickRegistry.onRandomTick(callback, probability);
}
