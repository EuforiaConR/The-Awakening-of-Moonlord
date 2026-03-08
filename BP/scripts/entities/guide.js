import { world, system, ItemStack } from "@minecraft/server";
const ENTITY_TYPE_ID = "awakening_moonlord:guide";

world.afterEvents.entityDie.subscribe((ev) => {
  const { deadEntity } = ev;

  if (deadEntity.typeId !== ENTITY_TYPE_ID) return;

  if (deadEntity.nameTag === "Andrew") {
    const dimension = deadEntity.dimension;
    const position = deadEntity.location;
    dimension.spawnItem(new ItemStack("awakening_moonlord:green_cap"), position);
  }
});
