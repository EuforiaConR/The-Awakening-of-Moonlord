import { world, system } from "@minecraft/server"
import { Player } from "@minecraft/server";
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

                const equippableComp = player.getComponent("equippable")
                const itemOffhand = equippableComp.getEquipment("Offhand")


                if (player.isJumping && !player.isSneaking && itemOffhand.typeId === "awakening_moonlord:shield_of_cthulhu") {
                    ctx.transition("jump");
                }
            }
        },

        jump: {
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
            onEnter(ctx) {
                const player = ctx.player;
                const view = player.getViewDirection();
                const hf = 2.5;

                player.playSound("mob.breeze.idle_air", {
                    pitch: 0.75,
                    volume: 2.0
                });

                player.applyKnockback(
                    { x: view.x * hf, z: view.z * hf },
                    0.1
                );
            },

            onUpdate(ctx) {
                const player = ctx.player;

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
