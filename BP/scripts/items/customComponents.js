import { system, world, ItemStack } from "@minecraft/server";
import { ManaManager } from "../world/utils/manaManager.js";

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

      for (const { name, duration, amplifier = 0, showParticles = true } of params) {
        source.addEffect(name, duration, { amplifier, showParticles });
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
        particle,
      } = arg?.params;

      if (global_sound) {
        source.dimension.playSound(global_sound, source.location);
      }
      if (player_sound) {
        source.playSound(player_sound);
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
