import { world, system } from "@minecraft/server";

const ITEM_TYPE_ID = "awakening_moonlord:magic_mirror";

world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId !== ITEM_TYPE_ID) return;

  const cooldownComp = itemStack.getComponent("cooldown");
  if (cooldownComp.getCooldownTicksRemaining(source) < cooldownComp.cooldownTicks) return;

  const spawnPoint = source.getSpawnPoint();

  if (spawnPoint) {
    system.runTimeout(() => {
      source.teleport(spawnPoint, { dimension: spawnPoint.dimension });
      source.sendMessage("You have teleported to your last spawnPoint!");

      source.dimension.spawnParticle(
        "awakening_moonlord:magic_mirror_use_emitter",
        source.getHeadLocation(),
      );
    }, 10);
  } else {
    source.sendMessage("You have no spawnPoint set!");
  }
});
