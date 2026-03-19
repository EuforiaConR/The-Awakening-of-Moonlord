import { world, system } from "@minecraft/server";
import { ManaManager } from "../world/utils/manaManager";

const HEART_VARIANTS = [
  "awakening_moonlord:heart",
  "awakening_moonlord:heart_halloween",
  "awakening_moonlord:heart_christmas",
];

const STAR_VARIANTS = [
  "awakening_moonlord:star",
  "awakening_moonlord:star_halloween",
  "awakening_moonlord:star_christmas",
];
world.afterEvents.playerInventoryItemChange.subscribe((event) => {
  const { player, itemStack, slot } = event;

  if (!itemStack) return;
  /*   console.warn(
    `Player ${player.name} had an inventory change. Item: ${itemStack.typeId}, Count: ${itemStack.amount}`,
  ); */

  if (HEART_VARIANTS.includes(itemStack.typeId)) {
    console.warn(`Player ${player.name} picked up a heart!`);
    const healthComponent = player.getComponent("minecraft:health");
    healthComponent.setCurrentValue(
      Math.min(healthComponent.effectiveMax, healthComponent.currentValue + 1),
    );
    const inventoryComponent = player.getComponent("minecraft:inventory");
    inventoryComponent.container.setItem(slot, undefined);
  } else if (STAR_VARIANTS.includes(itemStack.typeId)) {
    console.warn(`Player ${player.name} picked up a star!`);
    ManaManager.add(player, 1);
    const inventoryComponent = player.getComponent("minecraft:inventory");
    inventoryComponent.container.setItem(slot, undefined);
  }
});
