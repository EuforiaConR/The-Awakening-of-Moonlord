import { world, system, ItemStack } from "@minecraft/server";


const TREASURE_BAG_CONFIG = {
  "awakening_moonlord:eye_of_cthulhu": {
    lootTable: "gameplay/entities/awakening_moonlord/eye_of_cthulhu_reward"
  },
};

world.afterEvents.entityDie.subscribe((ev) => {
  const { damageSource, deadEntity } = ev;

  const treasureBagData = TREASURE_BAG_CONFIG[deadEntity.typeId];

  if (treasureBagData) {
    console.warn("bolsita");
    const treasureBag = new ItemStack("awakening_moonlord:treasure_bag_eye_of_cthulhu", 1);

    const inventoryComp = treasureBag.getComponent("inventory");
    const lootTableManager = world.getLootTableManager();
    const lootTable = lootTableManager.getLootTable(treasureBagData.lootTable);
    const rewards = lootTableManager.generateLootFromTable(lootTable);

    rewards.forEach((reward) => {
      inventoryComp.container.addItem(reward);
    });

    const { dimension, location } = deadEntity
    const nearbyPlayers = dimension.getPlayers({
      location: location,
      maxDistance: 60
    })
    for (let i = 0; i < nearbyPlayers.length; i++) {
      dimension.spawnItem(treasureBag, location);

    }

  }
});
