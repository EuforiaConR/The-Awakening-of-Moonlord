import { world, system, MolangVariableMap } from "@minecraft/server";
import { Random } from "../utils/random";
const NPC_LIST = ["awakening_moonlord:guide"];

const EMOTE_CATEGORIES = {
  General: [0, 28],
  //Rock_Paper_Scissors: [42, 47],
  Items: [56, 78],
  //Nature_Weather: [84, 106],
  Town: [112, 141],
  Critters_Monsters: [154, 167],
  //Dangers: [168, 193],
};

world.afterEvents.dataDrivenEntityTrigger.subscribe((ev) => {
  const { entity, eventId } = ev;

  if (!NPC_LIST.includes(entity.typeId)) return;
  //console.warn(eventId);

  if (eventId === "awakening_moonlord:emote_reaction") {
    const dimension = entity.dimension;
    const position = entity.getHeadLocation();
    position.y += 0.75;

    const molangVariables = new MolangVariableMap();

    const categories = Object.keys(EMOTE_CATEGORIES);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const [min, max] = EMOTE_CATEGORIES[randomCategory];

    const randomIndex = Random.int(min, max);
    console.warn(`Category: ${randomCategory} | Index: ${randomIndex}`);
    molangVariables.setFloat("variable.index", randomIndex);

    dimension.spawnParticle("awakening_moonlord:npc_emote", position, molangVariables);
  }
});
