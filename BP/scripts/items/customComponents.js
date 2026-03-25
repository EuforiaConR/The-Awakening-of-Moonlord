import { system, world, ItemStack } from "@minecraft/server";
import { ManaManager } from "../world/utils/manaManager.js";
import { UtilsFunction } from "../utils/function.js";
import { CustomEffectsManager } from "../world/utils/customEffectsManager.js";

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

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("on_use:add_effects", {
    onUse(ev, arg) {
      const { source } = ev;
      const params = arg.params;

      for (const { name, duration, amplifier = 0, show_particles = true } of params) {
        source.addEffect(name, duration, { amplifier: amplifier, showParticles: show_particles });
      }
    },
  });
  itemComponentRegistry.registerCustomComponent("on_use:shoot_projectile", {
    onUse(ev, arg) {
      const { source } = ev;
      const { projectile, velocity_multiplier = 2 } = arg?.params;
      const dimension = source.dimension;
      const position = source.getHeadLocation();
      const direction = source.getViewDirection();
      UtilsFunction.shootProjectile(projectile, dimension, position, direction, {
        source: source,
        velocityMultiplier: velocity_multiplier,
      });
    },
  });
  itemComponentRegistry.registerCustomComponent("on_use:add_custom_effects", {
    onUse(ev, arg) {
      const { source } = ev;
      const { params } = arg;

      for (const { name, duration = 200, amplifier = 1 } of params) {
        CustomEffectsManager.apply(source, name, {
          duration: duration,
          amplifier: amplifier,
        });
      }
    },
  });

  /* 
    itemComponentRegistry.registerCustomComponent('on_consume:add_effects', {
        onConsume(ev, arg) {
            const { source } = ev;
            const params = arg.params;

            for (const { name, duration, amplifier = 0, showParticles = true } of params) {
                source.addEffect(name, duration, { amplifier, showParticles });
            }
        }
    }); */
  itemComponentRegistry.registerCustomComponent("on_use:generic_modifiers", {
    onUse(ev, arg) {
      const { source, itemStack } = ev;
      const {
        global_sound,
        player_sound,
        is_consumible = false,
        has_cooldown = false,
        animation,
        particle,
      } = arg?.params;

      if (global_sound) {
        source.dimension.playSound(global_sound, source.location);
      }
      if (player_sound) {
        source.playSound(player_sound);
      }
      if (animation) {
        source.playAnimation(animation);
      }
      if (particle) {
        source.dimension.spawnParticle(particle, source.getHeadLocation());
      }
      if (has_cooldown) {
        itemStack.getComponent("cooldown").startCooldown(source);
      }
      if (is_consumible) {
        const equippableComp = source.getComponent("equippable");

        if (itemStack.amount > 1) {
          itemStack.amount -= 1;
          equippableComp.setEquipment("Mainhand", itemStack);
        } else {
          equippableComp.setEquipment("Mainhand", undefined);
        }
      }
    },
  });

  itemComponentRegistry.registerCustomComponent("on_use:stat_modifiers", {
    onUse(ev, arg) {
      const { source, itemStack } = ev;
      const { health, mana } = arg?.params;

      if (health) {
        const value = resolveValue(health);

        const healthComp = source.getComponent("health");
        const newHealth = healthComp.currentValue + value;
        const maxHealth = healthComp.effectiveMax;

        healthComp.setCurrentValue(Math.max(0, Math.min(newHealth, maxHealth)));
      }
      if (mana) {
        const value = resolveValue(mana);

        ManaManager.add(source, value);
      }
    },
  });
  itemComponentRegistry.registerCustomComponent("on_use_on:liquid_container", {
    onUseOn(ev, arg) {
      const { source, block, itemStack, usedOnBlockPermutation } = ev;

      const params = arg?.params ?? {};
      const blockId = block.typeId;
      const dimension = source.dimension;
      console.warn(
        `Intentando usar líquido en bloque ${blockId} blockPermutation ${usedOnBlockPermutation.type.id}`,
      );
      const liquidConfig = params[blockId];

      if (!liquidConfig) return;

      const { filled_item, consume_block = false, sound } = liquidConfig;

      if (!filled_item) return;
      if (sound) {
        dimension.playSound(sound, source.location);
      }
      UtilsFunction.consumeItem(source);
      UtilsFunction.giveOrDropItem(source, new ItemStack(filled_item));

      if (consume_block) {
        block.setType("minecraft:air");
      }
    },
  });
  /*         itemComponentRegistry.registerCustomComponent('on_consume:stats_modifiers', {
        
                onConsume(ev, arg) {
                    const { source, itemStack } = ev
                    const {
                        add_health,
                    } = arg?.params;
        
                    if (add_health) {
                        const healthComp = source.getComponent("health")
                        healthComp.setCurrentValue(healthComp.currentValue + add_health)
                    }
        
                }
            })  */
});
