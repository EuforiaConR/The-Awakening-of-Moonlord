import { world, system } from "@minecraft/server";
import { PlayerStateManager } from "../utils/playerStateManager.js";

import { DashFSM } from "../items/shield_of_cthulhu.js";

// Remove
world.afterEvents.playerLeave.subscribe(ev => {
    PlayerStateManager.remove(ev.playerId);
});

/* 
world.afterEvents.playerJoin.subscribe(ev => {
    const player = ev.player;

    PlayerStateManager.registerFromDefinition(player, DoubleJumpFSM);
    PlayerStateManager.registerFromDefinition(player, DashFSM);
}); */

system.runInterval(() => {
    const players = world.getAllPlayers()

    players.forEach(player => {
        //como que hacer esto es mala practica :(
        if (!player.initFsm) {
            PlayerStateManager.registerFromDefinition(player, DashFSM);
        }
    })
    PlayerStateManager.updateAll();
}, 1);
