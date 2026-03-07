import { world, system } from "@minecraft/server";
import { UtilsFunction } from "../utils/function.js";

const ITEM_TYPE_ID = "awakening_moonlord:life_crystal";

/* system.run(() => {
  console.warn("Life Crystal script is running.");
  const players = world.getAllPlayers();
  players.forEach((player) => {
    player.setDynamicProperty("awakening_moonlord:life_crystal_amplifier", 0);
  });
});
 */
world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId !== ITEM_TYPE_ID) return;

  const amplifier = source.getDynamicProperty("awakening_moonlord:life_crystal_amplifier") || 0;

  if (amplifier >= 5) return;
  UtilsFunction.consumeMainhandItem(source);
  source.runCommand(`effect @s health_boost infinite ${amplifier} true`);

  source.setDynamicProperty("awakening_moonlord:life_crystal_amplifier", amplifier + 1);
});

world.afterEvents.playerSpawn.subscribe((ev) => {
  const { player } = ev;

  const amplifier = player.getDynamicProperty("awakening_moonlord:life_crystal_amplifier");
  if (!amplifier) return;

  player.runCommand(`effect @s health_boost infinite ${amplifier - 1} true`);
});
