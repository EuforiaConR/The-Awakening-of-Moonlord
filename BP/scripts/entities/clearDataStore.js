import { world } from "@minecraft/server";
import { DataStore } from "../utils/dataStore.js";

//DataStore.setWorld("bloodMoonActive", true);

world.afterEvents.entityDie.subscribe((ev) => {
  DataStore.clearEntity(ev.deadEntity);
});

world.afterEvents.playerLeave.subscribe((ev) => {
  DataStore.entityData.delete(ev.playerId);
});
