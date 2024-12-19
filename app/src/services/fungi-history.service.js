import {FungiHistory} from "../model/FungiHistory.js";
import {StatusesService} from "./statuses.service.js";
import * as cron from "node-cron";
import {cronToHumanReadable} from "./post.util.service.js";

export class FungiHistoryService {
    static fungiHistoryService = new FungiHistoryService();

    constructor() {
        this.fungiHistory = new FungiHistory([]);
    }

    startCheckingForUserFeedbackAndCalculateHistoryFitness() {
        const checkForFeedbackSchedule = '*/2 * * * *';
        cron.schedule(checkForFeedbackSchedule, () => {
            this.updateFungiHistoryBasedOnUserFeedback();
            this.calculateFitness();
        });
        console.log("Scheduled fungi answering " + cronToHumanReadable(checkForFeedbackSchedule));
    }

    calculateFitness() {
        this.fungiHistory.getFungiStates().forEach((fungiState) => {
            fungiState.forEach(fungiState => {
                const favouriteCountsPerStatus = fungiState.getStatuses.map(s => s.favouritesCount).reduce((a, b) => a + b, 0) / fungiState.getStatuses.length;
               fungiState.setFitness(this.calculateFitnessThroughNormalization(favouriteCountsPerStatus));
            });
        });
    }

    updateFungiHistoryBasedOnUserFeedback() {
        this.fungiHistory.getFungiStates().forEach((fungiState) => {
            fungiState.setStatuses(fungiState.getStatuses().map((status) => {
                return StatusesService.statusesService.getStatusById(status.id);
            }));
        });
    }

    /**
     * Calculates the fitness value based on the number of favorites.
     * @param {number} favouritesCount - The number of favorites for a status.
     * @returns {number} - The fitness value (normalized between 0 and 1).
     */
    calculateFitnessThroughNormalization(favouritesCount) {
        // Define thresholds for normalization (e.g., max expected favorites)
        const MAX_FAVOURITES = 1000; // Adjust based on your data range
        const MIN_FAVOURITES = 0;

        // Clamp favouritesCount to the range [MIN_FAVOURITES, MAX_FAVOURITES]
        const clampedCount = Math.min(Math.max(favouritesCount, MIN_FAVOURITES), MAX_FAVOURITES);

        // Normalize to a value between 0 and 1
        const fitness = (clampedCount - MIN_FAVOURITES) / (MAX_FAVOURITES - MIN_FAVOURITES);

        return fitness;
    }

    getFungiHistory() {
        return this.fungiHistory;
    }
}
