import { system, world, ItemStack } from "@minecraft/server";
import { UtilsFunction } from "../utils/function.js";

function resolveValue(stat) {
  if (typeof stat === "number") {
    return stat;
  }

  if (Array.isArray(stat) && stat.length === 2) {
    const [min, max] = stat;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return 0;
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("on_random_tick:can_spread", {
    onRandomTick(ev, arg) {
      const { block, dimension } = ev;
      const pos = block.location;

      const {
        targets = ["minecraft:dirt"],
        result = block.typeId,
        decay_to,
        spread_attempts = 4,
        spread_range = { x: 1, y_down: 3, y_up: 1, z: 1 },
        chance = 1,
        requires_air_above = false,
        valid_above_blocks = ["minecraft:air"],
      } = arg.params;

      // probabilidad
      if (Math.random() > chance) return;

      const above = dimension.getBlock({
        x: pos.x,
        y: pos.y + 1,
        z: pos.z,
      });

      const aboveType = above?.typeId;

      const isAboveValid = above && valid_above_blocks.includes(aboveType);

      // si esta tapado o no cumple la condicion
      if (requires_air_above && !isAboveValid) {
        if (decay_to) {
          block.setType(decay_to);
        }
        return;
      }

      // propagacion
      for (let i = 0; i < spread_attempts; i++) {
        const dx = Math.floor(Math.random() * (spread_range.x * 2 + 1)) - spread_range.x;
        const dy =
          Math.floor(Math.random() * (spread_range.y_down + spread_range.y_up + 1)) -
          spread_range.y_down;
        const dz = Math.floor(Math.random() * (spread_range.z * 2 + 1)) - spread_range.z;

        const targetPos = {
          x: pos.x + dx,
          y: pos.y + dy,
          z: pos.z + dz,
        };

        const target = dimension.getBlock(targetPos);
        if (!target) continue;

        const targetAbove = dimension.getBlock({
          x: targetPos.x,
          y: targetPos.y + 1,
          z: targetPos.z,
        });

        if (!targetAbove) continue;

        const targetType = target.typeId;
        const targetAboveType = targetAbove.typeId;

        const isTargetValid = targets.includes(targetType);
        const isAboveTargetValid = valid_above_blocks.includes(targetAboveType);

        if (!isTargetValid) continue;

        if (requires_air_above && !isAboveTargetValid) continue;

        target.setType(result);
      }
    },
  });
});
