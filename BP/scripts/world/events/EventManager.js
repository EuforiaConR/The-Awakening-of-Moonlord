// events/EventManager.js

import { world, system } from "@minecraft/server";
import { EventRegistry } from "./EventRegistry.js";

const GLOBAL_EVENT_COOLDOWN = 24000; //24000 - 20 minutos

const STATE = {
  current: null,
  startTick: 0,
  lastEventTick: -GLOBAL_EVENT_COOLDOWN,
  data: {},
};

function pickWeightedEvent() {
  const validEvents = [];

  for (const [id, event] of Object.entries(EventRegistry)) {
    if (event.conditions && !event.conditions()) continue;

    validEvents.push({
      id,
      weight: event.weight ?? 1,
    });
  }

  if (validEvents.length === 0) return null;

  const totalWeight = validEvents.reduce((sum, e) => sum + e.weight, 0);

  let roll = Math.random() * totalWeight;

  for (const event of validEvents) {
    if (roll < event.weight) return event.id;

    roll -= event.weight;
  }

  return null;
}

export const EventManager = {
  restore() {
    const id = world.getDynamicProperty("awakening:event_current");
    const startTick = world.getDynamicProperty("awakening:event_start_tick");
    const lastEventTick = world.getDynamicProperty("awakening:last_event_tick");
    //debemos restaurar el lastEventTick para mantener el cooldown
    STATE.lastEventTick = lastEventTick ?? -GLOBAL_EVENT_COOLDOWN;

    if (!id) return;

    STATE.current = id;
    STATE.startTick = startTick ?? system.currentTick;
    //STATE.lastEventTick = lastEventTick ?? -GLOBAL_EVENT_COOLDOWN;

    console.warn(`Evento restaurado: ${id}`);
  },
  tryStartRandomEvent() {
    if (STATE.current) return;

    if (system.currentTick - STATE.lastEventTick < GLOBAL_EVENT_COOLDOWN) {
      return;
    }

    const id = pickWeightedEvent();

    if (!id) return;

    const event = EventRegistry[id];

    STATE.current = id;
    STATE.startTick = system.currentTick;
    STATE.data = {};

    STATE.lastEventTick = system.currentTick;

    //data persistance
    world.setDynamicProperty("awakening:event_current", id);
    world.setDynamicProperty("awakening:event_start_tick", STATE.startTick);
    world.setDynamicProperty("awakening:last_event_tick", STATE.lastEventTick);
    event.start?.(STATE);

    console.warn(`Evento iniciado: ${id}`);
  },
  startEvent(eventId, applyCooldown = false) {
    // Si ya hay un evento activo, no hacemos nada
    if (STATE.current) return false;

    const event = EventRegistry[eventId];
    if (!event) {
      console.warn(`Evento ${eventId} no encontrado`);
      return false;
    }

    STATE.current = eventId;
    STATE.startTick = system.currentTick;
    STATE.data = {};


    if (applyCooldown) {
      STATE.lastEventTick = system.currentTick;
      world.setDynamicProperty("awakening:last_event_tick", STATE.lastEventTick);
    }
    // Guardamos en world dynamic properties
    world.setDynamicProperty("awakening:event_current", STATE.current);
    world.setDynamicProperty("awakening:event_start_tick", STATE.startTick);

    event.start?.(STATE);

    console.warn(`Evento manual iniciado: ${eventId}`);
    return true;
  },
  tick() {
    if (!STATE.current) return;

    const event = EventRegistry[STATE.current];
    if (!event) {
      console.warn(`Evento ${STATE.current} no encontrado en EventRegistry. Terminando evento.`);
      this.end();
      return;
    }

    if (system.currentTick - STATE.startTick > event.duration) {
      this.end();
      return;
    }

    const players = world.getAllPlayers();

    for (const player of players) {
      event.tick?.(player, STATE);
    }
  },

  end() {
    if (!STATE.current) return;

    const event = EventRegistry[STATE.current];

    event.end?.(STATE);

    console.warn(`Evento terminado: ${STATE.current}`);

    STATE.current = null;
    STATE.data = {};
    world.setDynamicProperty("awakening:event_current", undefined);
    world.setDynamicProperty("awakening:event_start_tick", undefined);
  },
};
