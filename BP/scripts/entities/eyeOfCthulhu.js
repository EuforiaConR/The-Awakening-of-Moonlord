import { world, system } from "@minecraft/server";
import { Vec3 } from "../utils/vec3";
import { Random } from "../utils/random";

const ENTITY_TYPE_ID = "awakening_moonlord:eye_of_cthulhu";



world.afterEvents.dataDrivenEntityTrigger.subscribe((ev) => {
  const { entity, eventId } = ev;

  if (entity.typeId !== ENTITY_TYPE_ID) return;
  //console.warn(eventId);

  if (eventId === "awakening_moonlord:start_dash_phase_1") {
    let counter = 0;
    const interval = system.runInterval(() => {
      counter++
      if (counter >= 10) {
        system.clearRun(interval)
      }
      const viewDir = entity.getViewDirection();
      const normalizedViewDir = Vec3.normalize(viewDir);

      const impulse = Vec3.scale(normalizedViewDir, 1.2);

      entity.clearVelocity();
      entity.applyImpulse(impulse);

    })

  }
  else if (eventId === "awakening_moonlord:start_dash_phase_2") {
    system.run(async () => {
      for (let i = 0; i < 3; i++) {
        console.warn("dash: " + (i + 1))

        let counter = 0;
        const viewDir = entity.getViewDirection();
        const normalizedViewDir = Vec3.normalize(viewDir);

        const impulse = Vec3.scale(normalizedViewDir, 1.2);
        const { dimension, location } = entity
        dimension.playSound("eu.awakening_moonlord.npc.roar_0", location)

        const interval = system.runInterval(() => {
          counter++
          if (counter >= 10) {
            system.clearRun(interval)
          }

          entity.clearVelocity();
          entity.applyImpulse(impulse);

        })
        await system.waitTicks(20)


      }
    })

    /*     system.run(async () => {
          for (let i = 0; i < 3; i++) {
            console.warn("dash: " + (i + 1))
    
            await system.waitTicks(20)
    
            const viewDir = entity.getViewDirection();
    
            const normalizedViewDir = Vec3.normalize(viewDir);
    
            const impulse = Vec3.scale(normalizedViewDir, 2.0);
    
    
    
            //entity.clearVelocity();
            entity.applyImpulse(impulse);
    
          }
        }) */
  }
  else if (eventId === "awakening_moonlord:start_move_away_phase_1") {
    // // Stop current movement
    let counter = 0;
    const randomInterval = Random.int(10, 20)
    const interval = system.runInterval(() => {
      counter++
      const viewDir = entity.getViewDirection();
      const normalizedViewDir = Vec3.normalize(viewDir);

      const impulse = Vec3.scale(normalizedViewDir, -0.75);

      entity.clearVelocity();
      entity.applyImpulse({ x: impulse.x, y: 1.0, z: impulse.z });
      if (counter >= randomInterval) {
        system.clearRun(interval)
      }
    })
  }
  else if (eventId === "awakening_moonlord:start_move_away_phase_2") {
    // // Stop current movement
    let counter = 0;
    const randomInterval = Random.int(7, 12)
    const interval = system.runInterval(() => {
      counter++
      const viewDir = entity.getViewDirection();
      const normalizedViewDir = Vec3.normalize(viewDir);

      const impulse = Vec3.scale(normalizedViewDir, -0.75);

      entity.clearVelocity();
      entity.applyImpulse({ x: impulse.x, y: 1.0, z: impulse.z });
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

/* world.afterEvents.entityHealthChanged.subscribe(ev => {
  const { entity, newValue } = ev

  if (entity.typeId !== ENTITY_TYPE_ID) return;
  const currentPhase = entity.getProperty("eu:current_phase")
  const isChanging = entity.getProperty("eu:is_changing")

  if (currentPhase !== 1 || isChanging) { return; }

  if (newValue <= 2) {

  }
}) */