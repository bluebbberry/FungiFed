import {FungiHistory} from "../model/FungiHistory.js";

export class FungiHistoryService {
    static fungiHistoryService = new FungiHistoryService();

    constructor() {
        this.fungiHistory = new FungiHistory([]);
    }

    startCheckingForUserFeedbackAndCalculateHistoryFitness() {
        // TODO
    }

    calculateFitness() {
        // TODO
    }

    checkForUserFeedback() {
        // TODO
    }

    getFungiHistory() {
        return this.fungiHistory;
    }
}
