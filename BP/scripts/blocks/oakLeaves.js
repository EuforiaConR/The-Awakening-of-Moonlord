import { system, world, ItemStack } from "@minecraft/server";
import { Random } from "../utils/random.js";

const BLOCK_TYPE_ID = "minecraft:oak_leaves";

const FRUITS = [
  "awakening_moonlord:lemon",
  "awakening_moonlord:orange",
  "awakening_moonlord:pear",
  "awakening_moonlord:peach",
];
world.afterEvents.playerBreakBlock.subscribe((ev) => {
  const { brokenBlockPermutation, dimension, block } = ev;

  if (brokenBlockPermutation.type.id !== BLOCK_TYPE_ID) return;

  if (Random.chance(5)) {
    const fruit = new ItemStack(Random.pick(FRUITS), 1);
    dimension.spawnItem(fruit, block.location);
  }
});
