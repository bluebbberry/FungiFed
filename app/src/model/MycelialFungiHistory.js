export class MycelialFungiHistory {
    /**
     * @param {FungiState[]} fungiStates
     */
    constructor(fungiStates) {
        this.fungiStates = fungiStates;
    }

    getFungiStates() { return this.fungiStates; }

    setFungiStates(fungiStates) {
        this.fungiStates = fungiStates;
    }
}
