import { world, system } from "@minecraft/server";
import { UtilsFunction } from "../utils/function";
import { Vec3 } from "../utils/vec3";

const BOOMERANGS = [
  "awakening_moonlord:thrown_enchanted_boomerang",
  "awakening_moonlord:thrown_boomerang",
];

world.afterEvents.dataDrivenEntityTrigger.subscribe((ev) => {
  const { entity, eventId } = ev;

  if (!BOOMERANGS.includes(entity.typeId)) return;

  //console.warn(eventId);
  if (eventId === "awakening_moonlord:search_owner") {
    const projectileComp = entity.getComponent("minecraft:projectile");
    const owner = projectileComp?.owner;
    if (!owner) {
      entity.remove();
      return;
    }
    const direction = Vec3.subtract(owner.getHeadLocation(), entity.location);
    const normalizedDirection = Vec3.normalize(direction);
    const speed = 1.5;

    entity.clearVelocity();
    entity.applyImpulse(Vec3.scale(normalizedDirection, speed));
    const distance = Vec3.distance(owner.getHeadLocation(), entity.location);
    console.warn("La distancia es de: " + distance);
    if (distance <= 2) {
      entity.remove();
    }
  }
});

/* world.afterEvents.itemUse.subscribe((ev) => {
  const { itemStack, source } = ev;

  if (itemStack.typeId !== "awakening_moonlord:enchanted_boomerang") return;
  source.playAnimation("animation.eu.awakening_tchulu.player.swing_boomerang");
});
 */
