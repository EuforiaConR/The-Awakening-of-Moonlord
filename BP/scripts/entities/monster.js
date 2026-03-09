import { world, system, ItemStack } from "@minecraft/server";
import { Random } from "../utils/random.js";

world.afterEvents.entityDie.subscribe((ev) => {
  const { deadEntity, damageSource } = ev;
  if (!deadEntity.isValid) return;
  if (deadEntity.matches({ families: ["monster"] })) {
    if (Random.chance(30)) {
      const coinReward = new ItemStack("awakening_moonlord:cooper_coin", Random.int(1, 5));
      deadEntity.dimension.spawnItem(coinReward, deadEntity.location);
    }
  }
});
