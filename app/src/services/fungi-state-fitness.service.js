export class FungiStateFitnessService {

    static fungiStateFitnessService = new FungiStateFitnessService();

    calculateForFungiState(fungiState) {
        const favouriteCountsPerStatus = fungiState.getStatuses.map(s => s.favouritesCount).reduce((a, b) => a + b, 0) / fungiState.getStatuses.length;
        fungiState.setFitness(this.calculateFitnessThroughNormalization(favouriteCountsPerStatus));
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
}
