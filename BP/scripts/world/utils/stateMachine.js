// stateMachine.js
export class StateMachine {
  constructor(initialState, states = {}, extraContext = {}) {
    this.state = initialState;
    this.previousState = null;
    this.states = states;

    this.context = {
      stateDuration: 0,
      ...extraContext,
    };

    // Helpers inyectados
    this.context.transition = (nextState) => {
      this.transition(nextState);
    };

    this.context.getState = () => this.state;
    this.context.getPreviousState = () => this.previousState;

    if (states[initialState]?.onEnter) {
      states[initialState].onEnter(this.context);
    }
  }

  transition(nextState) {
    const current = this.states[this.state];
    const next = this.states[nextState];
    if (!next) throw new Error(`State '${nextState}' not found`);

    this.previousState = this.state;

    if (current?.onExit) current.onExit(this.context, nextState);

    this.state = nextState;
    this.context.stateDuration = 0;

    if (next?.onEnter) next.onEnter(this.context, this.previousState);
  }

  update() {
    const current = this.states[this.state];

    this.context.stateDuration++;

    if (current?.onUpdate) current.onUpdate(this.context);
  }
}
