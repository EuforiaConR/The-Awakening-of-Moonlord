import { world, system, ItemStack } from "@minecraft/server";
import { Random } from "../utils/random";
import { onRandomTick } from "utils/onRandomTick.js";

const ENTITY_TYPE_ID = "awakening_moonlord:fallen_star";
const RADIUS = 20;

//reproducimos un evento de manera aleatoria
onRandomTick(() => {
  const players = world.getAllPlayers();
  const randomPlayer = players[Math.floor(Math.random() * players.length)]; // Selecciona un jugador aleatorio
  const location = randomPlayer.location;

  const spawnLoc = {
    x: location.x + (Math.random() - 0.5) * RADIUS,
    y: location.y + 50, // A 50 bloques sobre la cabeza del jugador
    z: location.z + (Math.random() - 0.5) * RADIUS,
  };

  console.warn(
    `Intentando generar una estrella caída en: ${spawnLoc.x}, ${spawnLoc.y}, ${spawnLoc.z}`,
  );

  const entity = randomPlayer.dimension.spawnEntity(ENTITY_TYPE_ID, spawnLoc);
  const projectileComp = entity.getComponent("projectile");
  const randomVelocity = {
    x: (Math.random() - 0.5) * 1.25, // Velocidad horizontal aleatoria
    y: -1, // Velocidad vertical hacia abajo,
    z: (Math.random() - 0.5) * 1.25, // Velocidad horizontal aleatoria
  };

  projectileComp.shoot(randomVelocity, { uncertainty: 0.2 });
}, 0.02); // 2% de probabilidad por ciclo

world.afterEvents.projectileHitBlock.subscribe((event) => {
  const { dimension, location, projectile } = event;
  if (projectile.typeId !== ENTITY_TYPE_ID) return;

  dimension.spawnItem(new ItemStack("awakening_moonlord:fallen_star"), location);
});
world.afterEvents.projectileHitEntity.subscribe((event) => {
  const { dimension, location, projectile } = event;

  if (projectile.typeId !== ENTITY_TYPE_ID) return;

  dimension.spawnItem(new ItemStack("awakening_moonlord:fallen_star"), location);
});
