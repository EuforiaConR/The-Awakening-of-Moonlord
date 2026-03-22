import { world, ItemStack } from "@minecraft/server";
import { UtilsFunction } from "../utils/function";

const COIN_CONFIG = {
  "awakening_moonlord:cooper_coin": {
    convertTo: "awakening_moonlord:silver_coin",
    particle: "awakening_moonlord:copper_use_coin_emitter",
  },
  "awakening_moonlord:silver_coin": {
    convertTo: "awakening_moonlord:gold_coin",
    deconvertTo: "awakening_moonlord:cooper_coin",
    particle: "awakening_moonlord:silver_use_coin_emitter",
  },
  "awakening_moonlord:gold_coin": {
    convertTo: "awakening_moonlord:platinum_coin",
    deconvertTo: "awakening_moonlord:silver_coin",
    particle: "awakening_moonlord:gold_use_coin_emitter",
  },
  "awakening_moonlord:platinum_coin": {
    deconvertTo: "awakening_moonlord:gold_coin",
    particle: "awakening_moonlord:platinum_use_coin_emitter",
  },
};

world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;
  const coinData = COIN_CONFIG[itemStack.typeId];

  if (!coinData) return;

  const isSneaking = source.isSneaking;
  const targetItem = isSneaking ? coinData.deconvertTo : coinData.convertTo;
  if (!targetItem) return;

  const amountRequired = isSneaking ? 1 : 10;
  const amountGiven = isSneaking ? 10 : 1;

  if (!UtilsFunction.consumeItem(source, amountRequired, "Mainhand")) return;

  UtilsFunction.giveOrDropItem(source, new ItemStack(targetItem, amountGiven));
  source.dimension.spawnParticle(coinData.particle, source.getHeadLocation());
  source.playSound("eu.awakening_moonlord.item.coin");
});
