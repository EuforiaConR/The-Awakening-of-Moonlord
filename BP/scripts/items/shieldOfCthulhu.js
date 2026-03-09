import { Player, EntityDamageCause } from "@minecraft/server";
import { UtilsFunction } from "../utils/function";

/**
 * @typedef {Object} StateContext
 * @property {Player} player
 * @property {number} stateDuration
 */
export const DashFSM = {
  name: "dashFSM",
  initialState: "grounded",
  states: {
    grounded: {
      /**
       * @param {StateContext} ctx
       */
      onUpdate(ctx) {
        const player = ctx.player;

        if (!player.isJumping || player.isSneaking) {
          return;
        }

        const equippableComp = player.getComponent("equippable");
        const itemOffhand = equippableComp.getEquipment("Offhand");

        if (itemOffhand?.typeId === "awakening_moonlord:shield_of_cthulhu") {
          ctx.transition("jump");
        }
      },
    },

    jump: {
      /**
       * @param {StateContext} ctx
       */
      onUpdate(ctx) {
        const player = ctx.player;

        if (player.isOnGround) {
          ctx.transition("grounded");
        } else if (player.isSneaking) {
          ctx.transition("dash");
        }
      },
    },

    dash: {
      /**
       * @param {StateContext} ctx
       */
      onEnter(ctx) {
        const player = ctx.player;
        const view = player.getViewDirection();
        ctx.launchDirection = view;
        const hf = 2.5;

        UtilsFunction.updateItemDurability(player, "Offhand", 3);
        player.playSound("mob.breeze.idle_air", {
          pitch: 0.75,
          volume: 2.0,
        });

        player.applyKnockback({ x: view.x * hf, z: view.z * hf }, 0.1);
      },
      /**
       * @param {StateContext} ctx
       */
      onUpdate(ctx) {
        const player = ctx.player;

        if (ctx.stateDuration < 10) {
          player.dimension.spawnParticle("minecraft:egg_destroy_emitter", player.location);

          const nearbyEntities = player.dimension.getEntities({
            location: player.location,
            excludeTypes: ["minecraft:player", "minecraft:item", "minecraft:xp_orb"],
            maxDistance: 2,
          });
          let hitEntity = null;

          for (const nearbyEntity of nearbyEntities) {
            if (
              nearbyEntity.applyDamage(3, {
                damagingEntity: player,
                cause: EntityDamageCause.entityAttack,
              })
            ) {
              hitEntity = true;
              break;
            }
          }

          if (hitEntity) {
            player.clearVelocity();

            player.applyKnockback(
              { x: ctx.launchDirection.x * -0.5, z: ctx.launchDirection.z * -0.5 },
              0.25,
            );

            ctx.transition("wait_for_ground");
          }
        } else {
          ctx.transition("wait_for_ground");
        }
      },
    },
    wait_for_ground: {
      /**
       * @param {StateContext} ctx
       */
      onUpdate(ctx) {
        const player = ctx.player;

        if (player.isOnGround) {
          ctx.transition("grounded");
        }
      },
    },
  },
};
