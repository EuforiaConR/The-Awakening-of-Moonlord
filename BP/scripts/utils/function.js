import {
  EffectTypes,
  Entity,
  BlockPermutation,
  Dimension,
  system
} from "@minecraft/server";

// utils/function.js


export const UtilsFunction = {

  /**
   * Llena un área usando una pool de bloques con pesos.
   * Cada bloque se elige aleatoriamente según su "weight".
   *
   * @param {Dimension} dimension - Dimensión donde colocar los bloques.
   * @param {Vector3} start - Esquina inicial.
   * @param {Vector3} end - Esquina final.
   * @param {Array<{blockType: string, blockStates?: Object, weight: number}>} blockOptions
   *        Pool de bloques ponderados.
   * @param {(count:number)=>void} [onFinish] - Callback al terminar.
   *
   * @returns {Generator<void, void, void>}
   */
  *fillAreaWeightedAsync(dimension, start, end, blockOptions, onFinish) {
    // --- Validación básica ---
    if (!Array.isArray(blockOptions) || blockOptions.length === 0) {
      throw new Error("blockOptions must be a non-empty array.");
    }

    // Precalcula suma total de pesos
    const totalWeight = blockOptions.reduce((s, o) => s + (o.weight ?? 1), 0);

    // Convertir cada entrada a una permutación preparada
    const prepared = blockOptions.map(o => ({
      weight: o.weight ?? 1,
      perm: BlockPermutation.resolve(o.blockType, o.blockStates ?? {})
    }));

    const x1 = Math.min(start.x, end.x);
    const x2 = Math.max(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const y2 = Math.max(start.y, end.y);
    const z1 = Math.min(start.z, end.z);
    const z2 = Math.max(start.z, end.z);

    let count = 0;

    // --- Generator principal ---
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {

          // Elegir bloque según peso
          let r = Math.random() * totalWeight;
          let chosen = prepared[0];

          for (const opt of prepared) {
            if (r < opt.weight) {
              chosen = opt;
              break;
            }
            r -= opt.weight;
          }

          const block = dimension.getBlock({ x, y, z });
          if (block) block.setPermutation(chosen.perm);

          count++;
          yield;
        }
      }
    }

    if (onFinish) onFinish(count);
  },


  /**
   * Llena un área sin causar lag usando `system.runJob()`.
   * Produce un bloque por iteración mediante `yield`.
   *
   * @param {Dimension} dimension - Dimension donde colocar los bloques.
   * @param {Vector3} start - Esquina inicial del área.
   * @param {Vector3} end - Esquina final del área.
   * @param {string|BlockPermutation} blockType - Tipo de bloque o Permutacion.
   * @param {(count:number)=>void} [onFinish] - Callback al finalizar (opcional).
   *
   * @returns {Generator<void, void, void>} Generador compatible con `system.runJob()`.
   */
  *fillAreaAsync(dimension, start, end, blockType, onFinish) {
    const x1 = Math.min(start.x, end.x);
    const x2 = Math.max(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const y2 = Math.max(start.y, end.y);
    const z1 = Math.min(start.z, end.z);
    const z2 = Math.max(start.z, end.z);

    const perm =
      typeof blockType === "string"
        ? BlockPermutation.resolve(blockType)
        : blockType;

    if (!perm) throw new Error("Invalid block type or permutation.");

    let count = 0;

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          const block = dimension.getBlock({ x, y, z });
          if (block) block.setPermutation(perm);

          count++;
          yield; // evita lag
        }
      }
    }

    if (onFinish) onFinish(count);
  },

  /**
   * Coloca bloques en un área cúbica o rectangular.
   *
   * @param {Dimension} dimension - La dimensión donde colocar los bloques.
   * @param {Vector3} start - Posición inicial (x1, y1, z1).
   * @param {Vector3} end - Posición final (x2, y2, z2).
   * @param {string|BlockPermutation} blockType - Tipo de bloque o Permutation.
   * @param {(block: Block) => boolean} [filter] - Opcional: solo reemplaza si filter() devuelve true.
   */
  setBlocksArea(dimension, start, end, blockType, filter = null) {
    const x1 = Math.min(start.x, end.x);
    const x2 = Math.max(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const y2 = Math.max(start.y, end.y);
    const z1 = Math.min(start.z, end.z);
    const z2 = Math.max(start.z, end.z);

    const permutation =
      typeof blockType === "string"
        ? BlockPermutation.resolve(blockType)
        : blockType;

    let count = 0;

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          const block = dimension.getBlock({ x, y, z });
          if (!block) continue;

          if (filter && !filter(block)) continue;

          try {
            block.setPermutation(permutation);
            count++;
          } catch { }
        }
      }
    }

    return count;
  },


  //WORLD
  /**
 * Runs a sequence of tasks one after another, each optionally delayed.
 * @param {Array<{delay?: number, fn: Function}>} tasks - List of tasks with optional delays in ticks.
 * @returns {Promise<void>}
 * 
 * Example:
 * runSequence([
 *   { fn: () => console.warn("Start") },
 *   { delay: 40, fn: () => console.warn("After 2 seconds") },
 *   { delay: 20, fn: () => console.warn("After 1 more second") },
 * ]);
 */
  async runSequence(tasks) {
    for (const task of tasks) {
      if (!task || typeof task.fn !== "function") continue;

      // Espera el delay antes de ejecutar la función (si existe)
      if (task.delay && task.delay > 0) {
        await new Promise(resolve => system.runTimeout(resolve, task.delay));
      }

      // Ejecuta la función asociada
      try {
        task.fn();
      } catch (e) {
        console.warn(`[runSequence] Error ejecutando tarea: ${e}`);
      }
    }
  },
  //PARTICLE
  spiralParticles(dimension, center, particleId, turns = 3, radius = 3, height = 5, steps = 100) {
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2 * turns;
      const x = center.x + Math.cos(t) * radius * (1 - i / steps);
      const y = center.y + (i / steps) * height;
      const z = center.z + Math.sin(t) * radius * (1 - i / steps);
      dimension.spawnParticle(particleId, { x, y, z });
    }
  },
  spawnParticleRing(dimension, center, radius, particleId, count = 24, yOffset = 0) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = center.x + Math.cos(angle) * radius;
      const z = center.z + Math.sin(angle) * radius;
      dimension.spawnParticle(particleId, { x, y: center.y + yOffset, z });
    }
  },


  //SPAWN ENTITIES
  spawnEntitiesCircular(entityId, dimension, center, { radius = 6, count = 8, heightOffset = 1, randomize = false } = {}) {

    const { x: cx, y: cy, z: cz } = center;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;

      let x = cx + Math.cos(angle) * radius;
      let z = cz + Math.sin(angle) * radius;

      // Encuentra el bloque superior en esa columna
      const topBlock = dimension.getTopmostBlock({ x: Math.floor(x), z: Math.floor(z) }, cy + 10);
      if (!topBlock) continue;

      let { y } = topBlock.location;
      y += heightOffset;

      // Dispersion opcional
      if (randomize) {
        x += (Math.random() - 0.5) * 1.2;
        z += (Math.random() - 0.5) * 1.2;
      }


      dimension.spawnEntity(entityId, { x, y, z });

    }
  },
  spawnEntitiesCircularArea(entityId, dimension, center, {
    minRadius = 0,
    maxRadius = 6,
    count = 20,
    heightOffset = 1,
    randomize = false
  } = {}) {

    const { x: cx, y: cy, z: cz } = center;
    const spawnedEntities = [];

    for (let i = 0; i < count; i++) {

      // Ángulo aleatorio
      const angle = Math.random() * Math.PI * 2;

      // Radio aleatorio uniforme entre min y max
      const r = Math.sqrt(Math.random() * (maxRadius ** 2 - minRadius ** 2) + minRadius ** 2);

      let x = cx + Math.cos(angle) * r;
      let z = cz + Math.sin(angle) * r;

      // Encuentra el bloque superior en esa columna
      const topBlock = dimension.getTopmostBlock({ x: Math.floor(x), z: Math.floor(z) }, cy + 10);
      if (!topBlock) continue;

      let { y } = topBlock.location;
      y += heightOffset;

      // Dispersión opcional
      if (randomize) {
        x += (Math.random() - 0.5) * 1.2;
        z += (Math.random() - 0.5) * 1.2;
      }

      const entity = dimension.spawnEntity(entityId, { x, y, z });
      if (entity) spawnedEntities.push(entity);
    }

    return spawnedEntities;
  },
  //ITEM

  /**
   * Gives an ItemStack to the player or drops it nearby if the inventory is full.
   * @param {Player} player - Target player.
   * @param {ItemStack} itemStack - The ItemStack to give or drop.
   * @returns {boolean} - True if given successfully, false if dropped or skipped.
   */
  giveOrDropItem(player, itemStack) {
    if (!player?.isValid) return false;

    // Skip Creative players
    //if (player.matches({ gameMode: "Creative" })) return false;

    const inv = player.getComponent("inventory")?.container;
    if (!inv) return false;

    // Try to add the item to the inventory
    const leftover = inv.addItem(itemStack);
    const wasAdded = leftover === undefined || leftover.amount === 0;

    if (!wasAdded) {
      // Inventory full -> drop item
      const dropPos = {
        x: player.location.x,
        y: player.location.y + 0.5,
        z: player.location.z,
      };

      const dim = player.dimension;
      const entityItem = dim.spawnItem(leftover ?? itemStack, dropPos);

      // Small impulse so it "pops" out naturally
      entityItem.applyImpulse({
        x: (Math.random() - 0.5) * 0.1,
        y: 0.25,
        z: (Math.random() - 0.5) * 0.1,
      });

      player.playSound("random.pop");
      return false;
    }

    return true;
  },
  /**
   * Finds an item in the player's inventory.
   * @param {Player} player - The player whose inventory will be searched.
   * @param {string} typeId - The item type ID to search for (e.g. "minecraft:apple").
   * @param {object} [options] - Optional parameters.
   * @param {boolean} [options.returnAll=false] - If true, returns all matches instead of the first one.
   * @returns {object|null|Array} 
   * - Default: { slot, item } for the first match.
   * - If returnAll=true: Array of { slot, item } for all matches.
   * - Returns null if not found.
   */
  findItemInInventory(player, typeId, options = {}) {
    const invComp = player.getComponent("inventory");
    if (!invComp) return null;

    const container = invComp.container;
    if (!container) return null;

    const matches = [];

    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);
      if (!item) continue;
      if (item.typeId === typeId) {
        matches.push({ slot: i, item });
        if (!options.returnAll) return matches[0]; // return first match
      }
    }

    return options.returnAll ? matches : null;
  },

  /**
   * Consume (remove) a specified number of items from the player's inventory.
   * Prioritizes the mainhand item first, and skips if in Creative mode.
   * @param {Player} player - The player whose inventory will be modified.
   * @param {string} typeId - The item type ID to consume (e.g. "minecraft:apple").
   * @param {number} [amount=1] - How many items to remove.
   * @returns {boolean} - True if the items were successfully consumed.
   */
  consumeMainhandItem(player, amount = 1) {
    const inv = player.getComponent("inventory")?.container;
    if (!inv) return false;

    const slot = player.selectedSlotIndex;
    const item = inv.getItem(slot);
    if (!item) return false;

    const itemAmount = item.amount - 1
    if (itemAmount <= 0) inv.setItem(slot, undefined);
    else {
      item.amount -= amount
      inv.setItem(slot, item)
    };
    return true;
  },
  consumeMainhandItem(player, amount = 1) {
    const inv = player.getComponent("inventory")?.container;
    if (!inv) return false;

    const slot = player.selectedSlotIndex;
    const item = inv.getItem(slot);
    if (!item) return false;

    item.amount -= amount;
    if (item.amount <= 0) inv.setItem(slot, undefined);
    else inv.setItem(slot, item);
    return true;
  },
  updateItemAmount(player, item) {
    if (player.matches({ gameMode: `Creative` })) return;

    const equippable = player.getComponent("equippable")
    if (item.amount === 1) {
      equippable.setEquipment("Mainhand", undefined)
      return
    }
    item.amount -= 1
    equippable.setEquipment('Mainhand', item)
  },
  updateItemDurability(source, item, durabilityModifier = 1) {
    if (source.matches({ gameMode: `Creative` })) return

    const equippable = source.getComponent("equippable");
    const durability = item.getComponent("durability");

    durability.damage += durabilityModifier;

    const maxDurability = durability.maxDurability
    const currentDamage = durability.damage
    if (currentDamage >= maxDurability) {
      source.playSound('random.break', { pitch: 1, location: source.location, volume: 1 })
      equippable.setEquipment("Mainhand", undefined);
    }
    else {
      equippable.setEquipment("Mainhand", item);
    }
  },
  /**
   * Clears all items from the player's inventory (including armor & offhand),
   * similar to the /clear command.
   * @param {Player} player
   * @param {(string|function(ItemStack):boolean)=} filter Optional item filter or predicate.
   * @returns {number} Number of cleared items.
   */
  clearInventory(player, filter) {
    const inv = player.getComponent("inventory")?.container;
    const equip = player.getComponent("equippable");
    if (!inv || !equip) return 0;

    let cleared = 0;

    //inv principal
    for (let i = 0; i < inv.size; i++) {
      const item = inv.getItem(i);
      if (!item) continue;

      let shouldClear = true;
      if (typeof filter === "string") shouldClear = item.typeId === filter;
      else if (typeof filter === "function") shouldClear = filter(item);

      if (shouldClear) {
        cleared += item.amount;
        inv.setItem(i, undefined);
      }
    }

    //other slots
    const equipSlots = ["Head", "Chest", "Legs", "Feet", "Offhand"];

    for (const slot of equipSlots) {
      const item = equip.getEquipment(slot);
      if (!item) continue;

      let shouldClear = true;
      if (typeof filter === "string") shouldClear = item.typeId === filter;
      else if (typeof filter === "function") shouldClear = filter(item);

      if (shouldClear) {
        cleared += item.amount;
        equip.setEquipment(slot, undefined);
      }
    }

    return cleared;
  },


  //ENTITY
  /**
   * Applies a radial knockback to all nearby entities.
   * @param {Dimension} dimension - The dimension where the effect occurs.
   * @param {Vector3} center - The center of the "roar" (origin position).
   * @param {number} [radius=10] - The knockback range radius.
   * @param {number} [strength=1] - The intensity of the knockback.
   * @param {Object} [options] - Additional options for the effect.
   * @param {Entity} [options.source] - The entity that triggers the effect (excluded from knockback).
   * @param {string} [options.particleId="minecraft:explosion_particle"] - The particle effect to spawn.
   * @param {string} [options.soundId="entity.warden.sonic_boom"] - The sound to play.
   */
  knockbackRoar(
    dimension,
    center,
    radius = 10,
    horizontalForce = 1,
    verticalForce = 1,
    { source, particleId = "minecraft:breeze_wind_explosion_emitter", soundId = "breeze_wind_charge.burst" } = {}
  ) {
    const entities = dimension.getEntities({
      location: center,
      maxDistance: radius,
      excludeFamilies: [],
      excludeTypes: ["minecraft:item", "minecraft:xp_orb"]
    });

    for (const e of entities) {
      if (!e || !e.isValid) continue;
      if (source && e.id === source.id) continue; // Avoid pushing the source

      const dir = {
        x: e.location.x - center.x,
        y: e.location.y - center.y + 0.5, // small vertical lift
        z: e.location.z - center.z,
      };

      // Normalize direction
      const mag = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2) || 1;
      dir.x /= mag;
      dir.y /= mag;
      dir.z /= mag;

      // Apply scaled impulse based on strength
      e.applyKnockback({ x: dir.x * horizontalForce, z: dir.z * horizontalForce, }, dir.y * verticalForce)
      /*             
      e.applyImpulse({
                      x: dir.x * strength,
                      y: dir.y * strength,
                      z: dir.z * strength,
                  }); 
                  */
    }

    // Optional visual effect (e.g., particles or sound)
    dimension.spawnParticle(particleId, center);
    dimension.playSound(soundId, center);
  },
  getDirectionVector(entity) {
    const rot = entity.getRotation();
    const yaw = (rot.y + 90) * (Math.PI / 180);
    const pitch = rot.x * (Math.PI / 180);

    return {
      x: Math.cos(yaw) * Math.cos(pitch),
      y: Math.sin(-pitch),
      z: Math.sin(yaw) * Math.cos(pitch)
    };
  },
  hasItem(player, itemId) {
    const inventory = player.getComponent("inventory");
    if (!inventory) {
      return false;
    }
    const container = inventory.container;
    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);
      if (item?.typeId === itemId) {
        return true;
      }
    }
    return false;
  },
  shootProjectile(projectileId, dimension, location, direction, { source, velocityMultiplier = 1, uncertainty = 0 }) {
    const velocity = {
      x: direction.x * velocityMultiplier,
      y: direction.y * velocityMultiplier,
      z: direction.z * velocityMultiplier,
    };

    const projectile = dimension.spawnEntity(projectileId, location);
    const projectileComp = projectile.getComponent('minecraft:projectile');

    projectileComp?.shoot(velocity, {
      uncertainty,
    });

    if (source) {
      projectileComp.owner = source;
    }
  },
  //CONSTANTS
  getNegativeEffects() {
    return NEGATIVE_EFFECTS;
  }
};
const NEGATIVE_EFFECTS = [
  "hunger",
  "darkness",
  "blindness",
  "fatal_poison",
  "mining_fatigue",
  "nausea",
  "poison",
  "slowness",
  "wither",
  "weakness"
]
