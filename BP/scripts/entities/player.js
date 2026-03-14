import { world, system } from "@minecraft/server";
import { PlayerStateManager } from "../world/utils/playerStateManager.js";
import { ManaManager } from "../world/utils/manaManager.js";

import { DashFSM } from "../items/shieldOfCthulhu.js";

const INIT_PLAYER_FSM = new Map();

// Remove
world.afterEvents.playerLeave.subscribe((ev) => {
  console.warn("state removido: " + ev.playerName);

  INIT_PLAYER_FSM.set(ev.playerId, false);
  PlayerStateManager.remove(ev.playerId);
});

/*  
world.afterEvents.playerJoin.subscribe(ev => {
    const player = ev.player;

    PlayerStateManager.registerFromDefinition(player, DoubleJumpFSM);
    PlayerStateManager.registerFromDefinition(player, DashFSM);
}); */

system.runInterval(() => {
  const players = world.getAllPlayers();

  players.forEach((player) => {
    let initFsm = INIT_PLAYER_FSM.get(player.id);
    if (!initFsm) {
      INIT_PLAYER_FSM.set(player.id, true);
      console.warn("states registrados: " + player.name);
      PlayerStateManager.registerFromDefinition(player, DashFSM);
    }
  });
  PlayerStateManager.updateAll();
}, 1);

//MANA
world.afterEvents.playerSpawn.subscribe((ev) => {
  ManaManager.initPlayer(ev.player);
});

ManaManager.startRegen();

/* world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId !== "minecraft:stick") return;
  //ManaManager.set(source, 0);

  const maxMana = ManaManager.getMax(source);
  ManaManager.setMax(source, maxMana + 2);
});
 */
