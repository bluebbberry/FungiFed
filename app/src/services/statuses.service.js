import {getMasto} from "../configs/mastodonclient.js";

export class StatusesService {
    static statusesService = new StatusesService();

    constructor(getMastoClient = getMasto) {
        this.getMasto = getMastoClient;
    }

    async getStatusById(id) {
        return await this.getMasto().v1.statuses.$select(id).fetch();
    }

    /**
     *
     * @param {string} tagName
     * @param {number} numOfStatuses
     * @returns {Promise<Status[]>}
     */
    async getStatusesFromTag(tagName, numOfStatuses = 40) {
        const statuses = await this.getMasto().v1.timelines.tag.$select(tagName).list({
            limit: numOfStatuses,
        });
        return statuses;
    }
}
