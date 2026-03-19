import { world, Player, ItemStack } from "@minecraft/server";
import { ManaManager } from "../world/utils/manaManager";
import { Random } from "../utils/random";

function getFestivityIndexVariant() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Halloween: Oct 20 - Nov 10
  if ((month === 10 && day >= 20) || (month === 11 && day <= 10)) {
    return 1;
  }

  // Navidad: Dec 15 - Dec 31
  if (month === 12 && day >= 15) {
    return 2;
  }
  // Default
  return 0;
}

const HEART_VARIANTS = [
  "awakening_moonlord:heart",
  "awakening_moonlord:heart_halloween",
  "awakening_moonlord:heart_christmas",
];

const STAR_VARIANTS = [
  "awakening_moonlord:star",
  "awakening_moonlord:star_halloween",
  "awakening_moonlord:star_christmas",
];

world.afterEvents.entityDie.subscribe((ev) => {
  const { deadEntity, damageSource } = ev;
  const damagingEntity = damageSource?.damagingEntity;

  if (damagingEntity instanceof Player) {
    const healthComponent = damagingEntity.getComponent("health");
    const festivity = getFestivityIndexVariant();
    const dimension = deadEntity.dimension;
    const position = deadEntity.location;

    if (healthComponent.currentValue < healthComponent.effectiveMax && Random.chance(50)) {
      const selectedHearth = HEART_VARIANTS[festivity];

      dimension.spawnItem(new ItemStack(selectedHearth), position);
    }
    if (ManaManager.get(damagingEntity) < ManaManager.getMax(damagingEntity) && Random.chance(50)) {
      const selectedStar = STAR_VARIANTS[festivity];

      dimension.spawnItem(new ItemStack(selectedStar), position);
    }
  }
});
