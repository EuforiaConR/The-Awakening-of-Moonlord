import { world, system } from "@minecraft/server";

system.runInterval(() => {
  const players = world.getAllPlayers();
  players.forEach((player) => {

    if (player.hasTag("novelty:awakening_moonlord:hermes_boots")) {
      player.addEffect("speed", 20, { amplifier: 0, showParticles: false });
    }


  });
}, 5);
