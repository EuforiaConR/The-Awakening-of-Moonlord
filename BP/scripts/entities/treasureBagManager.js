import { world, system, ItemStack } from "@minecraft/server";
import { UtilsFunction } from "../utils/function";

const OPEN_TREASURE_BAG_CONFIG = {
  "awakening_moonlord:treasure_bag_eye_of_cthulhu": {
    lootTable: "gameplay/entities/awakening_moonlord/eye_of_cthulhu_reward",
  },
};

const BOSS_TREASURE_BAG_CONFIG = {
  "awakening_moonlord:eye_of_cthulhu": {
    item: "awakening_moonlord:treasure_bag_eye_of_cthulhu",
  },
};

world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;
  const treasureBagData = OPEN_TREASURE_BAG_CONFIG[itemStack.typeId];

  if (treasureBagData) {
    const lootTableManager = world.getLootTableManager();
    const lootTable = lootTableManager.getLootTable(treasureBagData.lootTable);
    const rewards = lootTableManager.generateLootFromTable(lootTable);

    rewards.forEach((reward) => {
      source.dimension.spawnItem(reward, source.location);
    });
    source.playSound("bundle.drop_contents");
    UtilsFunction.consumeMainhandItem(source);
  }
});

world.afterEvents.entityDie.subscribe((ev) => {
  const { damageSource, deadEntity } = ev;

  const treasureBagData = BOSS_TREASURE_BAG_CONFIG[deadEntity.typeId];

  if (treasureBagData) {
    console.warn("bolsita");

    const { dimension, location } = deadEntity;
    const nearbyPlayers = dimension.getPlayers({
      location: location,
      maxDistance: 60,
    });
    for (let i = 0; i < nearbyPlayers.length; i++) {
      dimension.spawnItem(new ItemStack(treasureBagData.item, 1), location);
    }
  }
});
