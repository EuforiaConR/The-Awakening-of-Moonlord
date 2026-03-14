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
/* 
world.afterEvents.entityHealthChanged.subscribe(ev => {
  const { entity, newValue } = ev
  if (entity.typeId === "minecraft:player") {
    entity.onScreenDisplay.setTitle(`mana:${newValue}`)
  }
}) */
/* import { world, system } from "@minecraft/server";
world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId !== "minecraft:stick") return;
  source.onScreenDisplay.setTitle(`mana:${value}`);

  
  system.run(async () => {
    for (let i = 1; i <= 20; i++) {
      source.onScreenDisplay.setTitle(`mana:${i}`);
      await system.waitTicks(1);
    }
  }); 
});
 */
