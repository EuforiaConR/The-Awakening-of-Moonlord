import { world, system } from "@minecraft/server";
import { PlayerStateManager } from "../utils/playerStateManager.js";

import { DashFSM } from "../items/shield_of_cthulhu.js";

const INIT_PLAYER_FSM = new Map()

// Remove
world.afterEvents.playerLeave.subscribe(ev => {
    console.warn("state removido: " + ev.playerName)

    INIT_PLAYER_FSM.set(ev.playerId, false)
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
        let initFsm = INIT_PLAYER_FSM.get(player.id)
        if (!initFsm) {
            INIT_PLAYER_FSM.set(player.id, true)
            console.warn("states registrados: " + player.name)
            PlayerStateManager.registerFromDefinition(player, DashFSM);
        }
    })
    PlayerStateManager.updateAll();
}, 1);
