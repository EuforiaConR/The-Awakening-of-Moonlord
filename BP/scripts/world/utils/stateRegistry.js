export class StateRegistry {
    static states = new Map(); // fsmName -> Map(stateName -> stateObject)

    static register(fsmName, stateName, stateObject) {
        if (!this.states.has(fsmName)) {
            this.states.set(fsmName, new Map());
        }

        this.states.get(fsmName).set(stateName, stateObject);
    }

    static getFSMStates(fsmName) {
        const map = this.states.get(fsmName);
        if (!map) return {};
        return Object.fromEntries(map);
    }
}
