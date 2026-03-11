//la data no es persistente no es el objetivo de este sistema
export class DataStore {

    // entityId -> Map(key -> value)
    static entityData = new Map();

    // world scoped data
    static worldData = new Map();

    /* ==========================
       ENTITY DATA
    ========================== */

    static setEntity(entity, key, value) {
        if (!entity?.id) return;

        if (!this.entityData.has(entity.id)) {
            this.entityData.set(entity.id, new Map());
        }

        this.entityData.get(entity.id).set(key, value);
    }

    static getEntity(entity, key) {
        return this.entityData.get(entity?.id)?.get(key);
    }

    static hasEntity(entity, key) {
        return this.entityData.get(entity?.id)?.has(key) ?? false;
    }

    static deleteEntity(entity, key) {
        this.entityData.get(entity?.id)?.delete(key);
    }

    static clearEntity(entity) {
        this.entityData.delete(entity?.id);
    }

    /* ==========================
       WORLD DATA
    ========================== */

    static setWorld(key, value) {
        this.worldData.set(key, value);
    }

    static getWorld(key) {
        return this.worldData.get(key);
    }

    static hasWorld(key) {
        return this.worldData.has(key);
    }

    static deleteWorld(key) {
        this.worldData.delete(key);
    }

    static clearWorld() {
        this.worldData.clear();
    }
}