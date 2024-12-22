import masto from "../configs/mastodonclient.js";

export class StatusesService {
    static statusesService = new StatusesService();

    async getStatusById(id) {
        return await masto.v1.statuses.$select(id).fetch();
    }

    /**
     *
     * @param {string} tagName
     * @param {number} numOfStatuses
     * @returns {Promise<Status[]>}
     */
    async getStatusesFromTag(tagName, numOfStatuses = 40) {
        const statuses = await masto.v1.timelines.tag.$select(tagName).list({
            limit: numOfStatuses,
        });
        return statuses;
    }
}
