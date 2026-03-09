import { world, system } from "@minecraft/server";
import { Random } from "../utils/random";
import { onRandomTick } from "utils/onRandomTick.js";

const EVENT_CONFIG = {
  "awakening_moonlord:slime_rain": {
    duration: 60000, // Duración del evento en ticks (3000 segundos)
  },
};

//TODO: hacer que seleccione un evento aleatorio de event config en lugar de solo slime rain
onRandomTick(() => {
  const currentEvent = world.getDynamicProperty("awakening_moonlord:current_event");
  console.warn("Intentando generar lluvia de slimes, evento activo:", currentEvent);
  if (currentEvent) return; // Si ya hay un evento activo, no hacemos nada

  console.warn("Generando lluvia de slimes...");

  world.setDynamicProperty("awakening_moonlord:current_event", "awakening_moonlord:slime_rain"); // Marcamos el evento como activo
  const players = world.getAllPlayers();
  players.forEach((player) => {});
}, 0.001); // 0.1% de probabilidad por ciclo

system.runInterval(() => {
  const currentEvent = world.getDynamicProperty("awakening_moonlord:current_event");
  if (!currentEvent) return;
  const eventData = EVENT_CONFIG[currentEvent];

  const players = world.getAllPlayers();
  players.forEach((player) => {
    if (currentEvent === "awakening_moonlord:slime_rain") {
      // Lógica para aplicar el efecto de lluvia de slimes al jugador
    }
  });
}, 5);
