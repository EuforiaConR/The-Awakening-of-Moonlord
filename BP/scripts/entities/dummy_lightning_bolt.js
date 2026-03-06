import { world, system, EntityDamageCause } from "@minecraft/server";

const ENTITY_TYPE_ID = "awakening_moonlord:dummy_lightning_bolt";

world.afterEvents.dataDrivenEntityTrigger.subscribe((ev) => {
  const { entity, eventId } = ev;

  if (entity.typeId !== ENTITY_TYPE_ID) return;
  console.warn(eventId);

  if (eventId === "awakening_moonlord:start_lightning_bolt") {
    const { location, dimension } = entity;
    const target = entity.target;
    let counter = 0;
    const interval = system.runInterval(() => {
      if (counter >= 5 || !target?.isValid) {
        system.clearRun(interval);
        dimension.spawnEntity("minecraft:lightning_bolt", target.location);
      }
      target.dimension.spawnParticle("awakening_moonlord:lightning_bolt_static", target.location);

      counter++;
    }, 5);

    entity.remove();
  }
});
