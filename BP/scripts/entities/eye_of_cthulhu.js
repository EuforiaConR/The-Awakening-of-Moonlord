import { world, system } from "@minecraft/server";
import { Vec3 } from "../utils/vec3";
import { Random } from "../utils/random";

const ENTITY_TYPE_ID = "awakening_moonlord:eye_of_cthulhu";

world.afterEvents.dataDrivenEntityTrigger.subscribe((ev) => {
  const { entity, eventId } = ev;

  if (entity.typeId !== ENTITY_TYPE_ID) return;
  console.warn(eventId);

  if (eventId === "awakening_moonlord:start_dash") {
    let counter = 0;
    const interval = system.runInterval(() => {
      counter++
      const viewDir = entity.getViewDirection();
      const normalizedViewDir = Vec3.normalize(viewDir);

      const impulse = Vec3.scale(normalizedViewDir, 1.2); // Calculate impulse in the opposite direction of the view

      entity.clearVelocity();
      entity.applyImpulse(impulse); // Apply an upward impulse to move away from the target
      if (counter >= 10) {
        system.clearRun(interval)
      }
    })

  } else if (eventId === "awakening_moonlord:start_move_away") {
    // // Stop current movement
    let counter = 0;
    const randomInterval = Random.int(10, 20)
    const interval = system.runInterval(() => {
      counter++
      const viewDir = entity.getViewDirection();
      const normalizedViewDir = Vec3.normalize(viewDir);

      const impulse = Vec3.scale(normalizedViewDir, -0.75); // Calculate impulse in the opposite direction of the view

      entity.clearVelocity();
      entity.applyImpulse({ x: impulse.x, y: 1.0, z: impulse.z }); // Apply an upward impulse to move away from the target
      if (counter >= randomInterval) {
        system.clearRun(interval)
      }
    })
  }
});

/* system.runInterval(() => {
  const player = world.getAllPlayers()[0]
  player.onScreenDisplay.setActionBar(JSON.stringify(player.getViewDirection()))
}) */

world.afterEvents.entityHurt.subscribe(ev => {
  const { damageSource, hurtEntity } = ev

  if (hurtEntity.typeId !== ENTITY_TYPE_ID) return;
})