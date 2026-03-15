import { world, system, Entity } from "@minecraft/server";
//import { Random } from "utils/random"
import { CustomEffectsManager } from "../utils/customEffectsManager.js";

const EFFECT_TYPE_ID = "awakening_moonlord:fire_body";

const ENTITIES_BLACKLIST = ["minecraft:wolf", "minecraft:parrot"];

CustomEffectsManager.register(EFFECT_TYPE_ID, {
  /**
   *
   * @param {Entity} entity
   */
  onTick(entity, data) {
    const { dimension, location } = entity;

    const nearbyEntities = dimension.getEntities({
      location: location,
      excludeFamilies: ["inanimate"],
      excludeTypes: ["minecraft:item"],
      maxDistance: 5 * data.amplifier,
    });
    nearbyEntities.forEach((nearbyEntity) => {
      if (nearbyEntity.id === entity.id) {
        return;
      }
      if (ENTITIES_BLACKLIST.includes(nearbyEntity.typeId)) {
        return;
      }
      //Esto no parece estar funcionando
      //const isTamed = nearbyEntity.getComponent("tameable")?.isTamed
      //if (isTamed) { return; }
      nearbyEntity.setOnFire(10);
    });
  },

  particles(entity, data) {
    return {
      id: "minecraft:basic_flame_particle",
      rate: 2,
    };
  },
});

/**
 *
 * @param {Entity} entity
 */
//function behavior(entity) { }
