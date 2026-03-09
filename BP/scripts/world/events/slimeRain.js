// events/slimeRain.js
import { system, world, Player } from "@minecraft/server";

import { Random } from "../../utils/random";
const SLIMES = ["awakening_moonlord:slime", "awakening_moonlord:pinky"];
const WEIGHTS = [10, 1];

export const slimeRain = {
  weight: 10,
  duration: 12000, //12000 ticks = 10 minutes

  conditions() {
    return true;
  },

  start() {
    console.warn("Slime Rain started");
    world.sendMessage("§aSlime is falling from the sky!");
  },
  /**
   * @param {Player} player
   * @param {Object} state - Estado actual del evento.
   * @param {string|null} state.current - ID del evento activo.
   * @param {number} state.startTick - Tick en el que comenzo el evento.
   * @param {number} state.lastEventTick - Tick en el que comenzo el ultimo evento (para cooldown global).
   * @param {Object} state.data - Objeto libre para guardar informacion interna del evento (contador de slimes, fases, flags, etc.).
   */
  tick(player, state) {
    const elapsedSeconds = (system.currentTick - state.startTick) / 20;
    player.onScreenDisplay.setActionBar(`Slime Rain: ${elapsedSeconds.toFixed(1)}s`);
    //console.warn(`El evento lleva ${elapsedSeconds.toFixed(1)} segundos`);

    if (system.currentTick % 40 !== 0) return;

    const pos = player.location;
    const spawnLoc = {
      x: pos.x + Random.int(-10, 10),
      y: pos.y + Random.int(30, 50),
      z: pos.z + Random.int(-10, 10),
    };
    const selectedSlime = Random.sample(SLIMES, { weights: WEIGHTS });
    const spawnedSlime = player.dimension.spawnEntity(selectedSlime, spawnLoc);
    spawnedSlime.addTag("awakening_moonlord:is_from_slime_rain");
    const randomVelocity = {
      x: Random.number(-0.5, 0.5),
      y: Random.number(-0.75, -0.5),
      z: Random.number(-0.5, 0.5),
    };
    spawnedSlime.applyImpulse(randomVelocity);
  },

  end() {
    console.warn("Slime Rain ended");
  },
};

/* 

if ((state.data.slimesSpawned ?? 0) >= 100) {
  EventManager.end(); // termina el evento inmediatamente
  return;
}
 */
