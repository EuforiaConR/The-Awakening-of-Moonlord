import { world, system } from "@minecraft/server";

const MANA_KEY = "awakening_moonlord:mana";
const MAX_MANA_KEY = "awakening_moonlord:max_mana";

const DEFAULT_MAX_MANA = 2;
const ABSOLUTE_CAP = 20;

export class ManaManager {
  /* ==========================
       INIT
    ========================== */

  static initPlayer(player) {
    if (player.getDynamicProperty(MAX_MANA_KEY) === undefined) {
      player.setDynamicProperty(MAX_MANA_KEY, DEFAULT_MAX_MANA);
    }

    if (player.getDynamicProperty(MANA_KEY) === undefined) {
      player.setDynamicProperty(MANA_KEY, this.getMax(player));
    }

    this.updateUI(player);
  }

  /* ==========================
       GETTERS
    ========================== */

  static get(player) {
    return player.getDynamicProperty(MANA_KEY) ?? 0;
  }

  static getMax(player) {
    return player.getDynamicProperty(MAX_MANA_KEY) ?? DEFAULT_MAX_MANA;
  }

  /* ==========================
       SETTERS
    ========================== */

  static set(player, value) {
    const clamped = Math.max(0, Math.min(this.getMax(player), value));
    player.setDynamicProperty(MANA_KEY, clamped);
    this.updateUI(player);
  }

  static setMax(player, value) {
    const clamped = Math.max(1, Math.min(ABSOLUTE_CAP, value));
    player.setDynamicProperty(MAX_MANA_KEY, clamped);

    if (this.get(player) > clamped) {
      player.setDynamicProperty(MANA_KEY, clamped);
    }

    this.updateUI(player);
  }

  static add(player, amount) {
    this.set(player, this.get(player) + amount);
  }

  static consume(player, amount) {
    const current = this.get(player);
    if (current < amount) return false;

    this.set(player, current - amount);
    return true;
  }

  /* ==========================
       UI (TU SISTEMA)
    ========================== */

  static updateUI(player) {
    const mana = this.get(player);

    player.onScreenDisplay.setTitle(`mana:${mana}`);
  }

  /* ==========================
       REGEN
    ========================== */

  static startRegen(intervalTicks = 40, amount = 1) {
    system.runInterval(() => {
      for (const player of world.getAllPlayers()) {
        this.add(player, amount);
      }
    }, intervalTicks);
  }
}
