export class StaticRule {
    constructor(trigger, response) {
        this.trigger = trigger;
        this.response = response;
    }

    getTrigger() {
        return this.trigger;
    }

    setTrigger(trigger) {
        this.trigger = trigger;
    }

    getResponse() {
        return this.response;
    }

    setResponse(response) {
        this.response = response;
    }
}
