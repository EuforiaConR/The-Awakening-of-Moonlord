// events/goblinArmy.js

import { system } from "@minecraft/server";

export const goblinArmy = {
  weight: 15,
  duration: 200, // 10 segundos

  conditions() {
    return true;
  },

  start() {
    console.warn("Goblin Army started");
  },

  tick(player, state) {
    if (system.currentTick % 40 !== 0) return;

    const pos = player.location;

    player.dimension.spawnEntity("minecraft:zombie", {
      x: pos.x + Math.random() * 10 - 5,
      y: pos.y + 2,
      z: pos.z + Math.random() * 10 - 5,
    });
  },

  end() {
    console.warn("Goblin Army ended");
  },
};
