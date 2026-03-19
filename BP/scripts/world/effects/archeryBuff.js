import { world, system, Entity } from "@minecraft/server";
//import { Random } from "utils/random"
import { CustomEffectsManager } from "../utils/customEffectsManager.js";

const EFFECT_TYPE_ID = "awakening_moonlord:archery_buff";

CustomEffectsManager.register(EFFECT_TYPE_ID, {
  /**
   *
   * @param {Entity} entity
   */
  onTick(entity, data) {},

  particles(entity, data) {
    return {
      id: "awakening_moonlord:custom_effect",
      index: 4,
      rate: 2,
    };
  },
});

/**
 *
 * @param {Entity} entity
 */
//function behavior(entity) { }
