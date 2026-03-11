import { world, system } from "@minecraft/server";
import { UtilsFunction } from "../utils/function";
import { Vec3 } from "../utils/vec3";

const BLOCK_TYPE_ID = "minecraft:torch";
let isTorchGodActive = false;

//TODO: add compatibility with custom torches and redstone torches, maybe even soul torches
world.beforeEvents.playerInteractWithBlock.subscribe(async (ev) => {
  const { block, isFirstEvent, player, itemStack } = ev;

  console.warn(
    `Player ${player.name} interacted with block ${block.typeId} at ${block.location.x}, ${block.location.y}, ${block.location.z}`,
  );
  if (!isFirstEvent) return;
  if (itemStack) return; //only when empty hand
  if (!player.isSneaking) return; //only when sneaking

  if (block.typeId !== BLOCK_TYPE_ID) return;

  if (isTorchGodActive) return; //if the event is already active, do nothing

  if (player.location.y > 0) return; //only below y=0

  await null; //wait a tick to ensure the block is fully interacted with
  const { location, dimension } = player;
  const offset = 20;
  const blocks = UtilsFunction.getBlocksInVolume(
    dimension,
    { x: location.x - offset, y: location.y - offset, z: location.z - offset },
    { x: location.x + offset, y: location.y + offset, z: location.z + offset },
    ["minecraft:torch"],
  );
  if (blocks.length < 100) {
    console.warn(
      `Only found ${blocks.length} torches in the area, at least 100 are required to awaken the Torch God.`,
    );
    return;
  } //at least 100 torches in the area
  isTorchGodActive = true;

  world.sendMessage("§aThe Torch God has awakened!");
  world.playMusic("eu.awakening_moonlord.music.the_torch_god", {
    fade: 0.5,
    loop: false,
    volume: 0.75,
  });

  system.run(async () => {
    for (let i = 0; i < blocks.length; i++) {
      const isAlive = player.getComponent("minecraft:health").currentValue > 0;

      if (player.isValid && player.dimension.isChunkLoaded(block?.location) && isAlive) {
        const block = blocks[i];
        if (block.typeId !== BLOCK_TYPE_ID) {
          console.warn(
            `Block at ${block.location.x}, ${block.location.y}, ${block.location.z} is no longer a torch, skipping.`,
          );
          continue;
        }
        console.warn(
          `Removing torch at ${block.location.x}, ${block.location.y}, ${block.location.z}`,
        );
        block.setType("minecraft:air");
        dimension.playSound("mob.blaze.shoot", block.location);
        const direction = Vec3.subtract(player.getHeadLocation(), block.center());
        //Fuerza 0.1 o el proyectil ira tan rapido que ni se vera XD
        UtilsFunction.shootProjectile(
          "awakening_moonlord:torch_projectile",
          block.dimension,
          block.center(),
          direction,
          { velocityMultiplier: 0.1 },
        );
        // comprobar si es el ultimo bloque
        if (i === blocks.length - 1) {
          player.sendMessage("§aYou have obtained the Torch God's Favor!");
        }
      } else {
        console.warn(`Player ${player.name} is no longer valid, stopping the Torch God event.`);
        break;
      }

      await system.waitTicks(10);
    }
    console.warn(`Finished processing all torches, deactivating the Torch God event.`);
    world.playMusic("", { fade: 5, loop: false });
    isTorchGodActive = false;
  });
});
