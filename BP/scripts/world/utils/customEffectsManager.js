import { world, system, Entity } from "@minecraft/server";

const KEY_EFFECTS = "awakening_moonlord:custom_effects";

export const CustomEffectsManager = {
  registry: {}, // effectId -> config
  activeEffects: new Map(), // entity.id -> effects object

  register(effectId, config) {
    this.registry[effectId] = {
      durationDefault: 200,
      amplifierDefault: 1,
      onApply() {},
      onTick() {},
      onExpire() {},
      particles: null,
      ...config,
    };
  },

  apply(entity, effectId, options = {}) {
    const config = this.registry[effectId];
    if (!config) throw new Error(`Effect '${effectId}' not registered.`);

    const effects = this._getEntityEffects(entity);
    const data = {
      ticks: 0,
      duration: options.duration ?? config.durationDefault,
      amplifier: options.amplifier ?? config.amplifierDefault,
      extra: options.extra ?? {},
    };

    effects[effectId] = data;
    this._save(entity, effects);

    try {
      config.onApply(entity, data);
    } catch (e) {
      console.warn(e);
    }
  },

  remove(entity, effectId, effects = null) {
    if (!effects) effects = this._getEntityEffects(entity);
    const config = this.registry[effectId];
    const data = effects[effectId];
    if (!data) return;

    try {
      config.onExpire(entity, data);
    } catch (e) {
      console.warn(e);
    }

    delete effects[effectId];
  },

  has(entity, effectId) {
    return this._getEntityEffects(entity)[effectId] !== undefined;
  },
  restore(player) {
    const raw = player.getDynamicProperty(KEY_EFFECTS);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && Object.keys(parsed).length > 0) {
        this.activeEffects.set(player.id, parsed);
      }
    } catch (e) {
      console.warn("Error restaurando efectos de", player.name, e);
    }

    console.warn("CustomEffectsManager restaurado para el player: " + player.name);
  },
  _getEntityEffects(entity) {
    if (!this.activeEffects.has(entity.id)) {
      const raw = entity.getDynamicProperty(KEY_EFFECTS);
      let parsed = {};
      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch {}
      }
      this.activeEffects.set(entity.id, parsed);
    }
    return this.activeEffects.get(entity.id);
  },

  _save(entity, effects) {
    try {
      entity.setDynamicProperty(KEY_EFFECTS, JSON.stringify(effects));
    } catch (e) {
      console.warn("Failed to save effects:", e);
    }
  },

  _tick() {
    // iterar solo entidades que tienen efectos
    for (const [entityId, effects] of this.activeEffects) {
      const entity = world.getEntity(entityId);
      if (!entity) {
        this.activeEffects.delete(entityId);
        continue;
      }

      let changed = false;
      const toRemove = [];

      for (const [effectId, data] of Object.entries(effects)) {
        const config = this.registry[effectId];
        if (!config) continue;

        data.ticks++;

        // Tick callback
        try {
          config.onTick(entity, data);
        } catch (e) {
          console.warn(e);
        }

        // Partículas
        if (config.particles) {
          try {
            const p = config.particles(entity, data);
            if (p && p.id && data.ticks % (p.rate ?? 5) === 0) {
              entity.dimension.spawnParticle(p.id, entity.location);
            }
          } catch (e) {
            console.warn(e);
          }
        }

        // Expiración
        if (data.ticks >= data.duration) {
          toRemove.push(effectId);
        } else {
          changed = true; // al menos un efecto sigue activo
        }
      }

      // Remover efectos expirados después del loop
      for (const effectId of toRemove) {
        this.remove(entity, effectId, effects);
        changed = true;
      }

      // Guardar solo una vez si hubo cambios
      if (changed) this._save(entity, effects);

      // Limpiar map si no quedan efectos
      if (Object.keys(effects).length === 0) {
        this.activeEffects.delete(entityId);
      }
    }
  },
};
