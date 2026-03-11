import { world, system } from "@minecraft/server";

const ITEM_TYPE_ID = "awakening_moonlord:recall_potion";

world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId !== ITEM_TYPE_ID) return;

  const spawnPoint = source.getSpawnPoint();
  if (spawnPoint) {
    source.teleport(spawnPoint, { dimension: spawnPoint.dimension });

    source.dimension.spawnParticle(
      "awakening_moonlord:magic_mirror_use_emitter",
      source.getHeadLocation(),
    );
    source.playSound("eu.awakening_moonlord.item.drink_potion");
    source.sendMessage("You have teleported to your last spawnPoint!");
  } else {
    source.sendMessage("You have no spawnPoint set!");
  }
});
