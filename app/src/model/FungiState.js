export class FungiState {
    constructor(code, commands, health = 0) {
        this.code = code;
        this.commands = commands;
        this.health = health;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
    }

    getCommands() {
        return this.commands;
    }

    setCommands(commands) {
        this.commands = commands;
    }

    getHealth() {
        return this.health;
    }

    setHealth(health) {
        this.health = health;
    }
}
