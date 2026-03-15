import { world, system } from "@minecraft/server";
import { CustomEffectsManager } from "./utils/customEffectsManager";
import "./effects/index.js";

// Global tick
system.runInterval(() => CustomEffectsManager._tick(), 1);

// Clear Effects
world.afterEvents.entityDie.subscribe((ev) => {
  const entity = ev.deadEntity;
  if (entity.typeId !== "minecraft:player") return;

  CustomEffectsManager.activeEffects.delete(entity.id);

  entity.setDynamicProperty("awakening_moonlord:custom_effects", "");
  //console.warn("efectos limpiados")
});

world.afterEvents.itemCompleteUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId !== "minecraft:milk_bucket") {
    return;
  }
  CustomEffectsManager.activeEffects.delete(source.id);

  source.setDynamicProperty("awakening_moonlord:custom_effects", "");

  //console.warn("efectos limpiados")
});

world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId !== "minecraft:stick") return;
  CustomEffectsManager.apply(source, "awakening_moonlord:fire_body", {
    duration: 2000,
    amplifier: 1,
  });
});

// Debug de efectos en action bar
system.runInterval(() => {
  const players = world.getAllPlayers();

  for (let i = 0; i < players.length; i++) {
    const player = players[i];

    const currentEffects = player.getDynamicProperty("awakening_moonlord:custom_effects");
    if (!currentEffects) continue;
    player.onScreenDisplay.setActionBar(currentEffects);
  }
}, 1);

// Persistencia de data
system.run(() => {
  const players = world.getAllPlayers();
  players.forEach((player) => {
    CustomEffectsManager.restore(player);
  });
});

world.afterEvents.playerSpawn.subscribe((ev) => {
  const player = ev.player;

  CustomEffectsManager.restore(player);
});

world.afterEvents.playerLeave.subscribe((ev) => {
  CustomEffectsManager.activeEffects.delete(ev.playerId);
});
