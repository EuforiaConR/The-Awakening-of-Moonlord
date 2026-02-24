import { world, system } from "@minecraft/server";
import { Vec3 } from "../utils/vec3";

const ENTITY_TYPE_ID = "awaking_moonlord:eye_of_cthulhu";

world.afterEvents.dataDrivenEntityTrigger.subscribe((ev) => {
  const { entity, eventId } = ev;

  if (entity.typeId !== ENTITY_TYPE_ID) return;
  console.warn(eventId);

  if (eventId === "awaking_moonlord:start_dash") {
    const viewDir = entity.getViewDirection();
    const normalizedViewDir = Vec3.normalize(viewDir);
    const impulse = Vec3.scale(normalizedViewDir, 2); // Calculate impulse in the view direction
    entity.applyImpulse(impulse); // Apply impulse in the view direction
  } else if (eventId === "awaking_moonlord:start_move_away") {
    const viewDir = entity.getViewDirection();
    const normalizedViewDir = Vec3.normalize(viewDir);

    const impulse = Vec3.scale(normalizedViewDir, -2.5); // Calculate impulse in the opposite direction of the view

    //entity.clearVelocity(); // Stop current movement
    //entity.applyImpulse({ x: 0, y: 1.5, z: 0 }); // Apply an upward impulse to move away from the target
    entity.teleport(Vec3.add(entity.location, { x: 0, y: 15, z: 0 }))
  }
});

/* system.runInterval(() => {
  const player = world.getAllPlayers()[0]
  player.onScreenDisplay.setActionBar(JSON.stringify(player.getViewDirection()))
}) */