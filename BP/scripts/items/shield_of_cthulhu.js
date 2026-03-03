
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

                if (!player.isJumping || player.isSneaking) { return; }

                const equippableComp = player.getComponent("equippable")
                const itemOffhand = equippableComp.getEquipment("Offhand")

                if (itemOffhand?.typeId === "awakening_moonlord:shield_of_cthulhu") {
                    ctx.transition("jump");
                }
            }
        },

        jump: {
            /**
             * @param {StateContext} ctx
             */
            onUpdate(ctx) {
                const player = ctx.player;

                if (player.isOnGround) {
                    ctx.transition("grounded");
                }
                else if (player.isSneaking) {
                    ctx.transition("dash");
                }
            }
        },

        dash: {
            /**
             * @param {StateContext} ctx
             */
            onEnter(ctx) {
                const player = ctx.player;
                const view = player.getViewDirection();
                const hf = 2.5;

                UtilsFunction.updateItemDurability(player, "Offhand", 3)
                player.playSound("mob.breeze.idle_air", {
                    pitch: 0.75,
                    volume: 2.0
                });

                player.applyKnockback(
                    { x: view.x * hf, z: view.z * hf },
                    0.1
                );
            },
            /**
             * @param {StateContext} ctx
             */
            onUpdate(ctx) {
                const player = ctx.player;

                const nearbyEntities = player.dimension.getEntities({
                    location: player.location,
                    excludeTypes: ["minecraft:player"],
                    maxDistance: 2,

                })
                nearbyEntities.forEach(nearbyEntity => {
                    nearbyEntity.applyDamage(3, { damagingEntity: player, cause: EntityDamageCause.entityAttack })
                })
                if (ctx.stateDuration < 10) {
                    player.dimension.spawnParticle(
                        "minecraft:egg_destroy_emitter",
                        player.location
                    );
                }

                if (player.isOnGround) {
                    ctx.transition("grounded");
                }
            }
        }
    }
};
