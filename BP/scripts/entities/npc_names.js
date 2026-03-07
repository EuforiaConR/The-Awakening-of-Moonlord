import { world, system } from "@minecraft/server";

const GUIDE_NAMES = [
  "Andrew",
  "Asher",
  "Bradley",
  "Brandon",
  "Brett",
  "Brian",
  "Cody",
  "Cole",
  "Colin",
  "Connor",
  "Daniel",
  "Dylan",
  "Garrett",
  "Harley",
  "Jack",
  "Jacob",
  "Jake",
  "Jan",
  "Jeff",
  "Jeffrey",
  "Joe",
  "Kevin",
  "Kyle",
  "Levi",
  "Logan",
  "Luke",
  "Marty",
  "Maxwell",
  "Ryan",
  "Scott",
  "Seth",
  "Steve",
  "Tanner",
  "Trent",
  "Wyatt",
  "Zach",
];

const NPC_CONFIG = {
  "awakening_moonlord:guide": GUIDE_NAMES,
};

world.afterEvents.entitySpawn.subscribe((ev) => {
  const { cause, entity } = ev;

  const npcNames = NPC_CONFIG[entity.typeId];
  if (npcNames) {
    const randomIndex = Math.floor(Math.random() * npcNames.length);
    const randomName = npcNames[randomIndex];
    entity.nameTag = randomName;
  }
});
