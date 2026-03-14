// playerStateManager.js
import { StateMachine } from "./stateMachine.js";

export class PlayerStateManager {
    static players = new Map();

    static ensure(player) {
        if (!this.players.has(player.id)) {
            this.players.set(player.id, {
                fsms: new Map(),
            });
        }
        return this.players.get(player.id);
    }

    static registerFSM(player, name, initialState, states) {
        const data = this.ensure(player);

        if (data.fsms.has(name)) return data.fsms.get(name);

        const fsm = new StateMachine(initialState, states, { player });
        data.fsms.set(name, fsm);

        return fsm;
    }

    static registerFromDefinition(player, fsmDef) {
        return this.registerFSM(
            player,
            fsmDef.name,
            fsmDef.initialState,
            fsmDef.states
        );
    }

    static getFSM(player, name) {
        return this.ensure(player).fsms.get(name);
    }

    static updateAll() {
        for (const { fsms } of this.players.values()) {
            for (const fsm of fsms.values()) {
                fsm.update();
            }
        }
    }

    static remove(playerId) {
        this.players.delete(playerId);
    }
}