import { world, system } from "@minecraft/server";
import { ManaManager } from "./utils/manaManager";
//MANA
world.afterEvents.playerSpawn.subscribe((ev) => {
  ManaManager.initPlayer(ev.player);
});

ManaManager.startRegen();
