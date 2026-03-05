import { world, system } from "@minecraft/server";

const ENTITY_TYPE_ID = "awakening_moonlord:dummy_lightning_bolt";


world.afterEvents.dataDrivenEntityTrigger.subscribe((ev) => {
  const { entity, eventId } = ev;

  if (entity.typeId !== ENTITY_TYPE_ID) return;
  console.warn(eventId);

  if (eventId === "awakening_moonlord:start_lightning_bolt") {
    const { location, dimension } = entity;
    dimension.spawnEntity("minecraft:lightning_bolt", location);
  }
});
