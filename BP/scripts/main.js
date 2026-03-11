import "./entities/index";
import "./utils/custom_shield";
import "./items/index";
import "./blocks/index";
import "./world/index";
/* 
import { world, system } from "@minecraft/server";

import { EventManager } from "./world/events/EventManager.js";

world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;
  if (itemStack.typeId === "minecraft:stick") {
    EventManager.startEvent("awakening_moonlord:slime_rain");
  } else {
    EventManager.end();
  }
});
 */