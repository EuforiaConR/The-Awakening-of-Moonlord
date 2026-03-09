import { system, world } from "@minecraft/server";
import { EventManager } from "./events/EventManager.js";
import { onRandomTick } from "utils/onRandomTick.js";

system.run(() => {
  EventManager.restore();
});

system.runInterval(() => {
  EventManager.tick();
}, 1);

onRandomTick(() => {
  EventManager.tryStartRandomEvent();
}, 0.001); // 0.1% de probabilidad por ciclo
