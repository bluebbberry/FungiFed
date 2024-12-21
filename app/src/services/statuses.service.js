import masto from "../configs/mastodonclient.js";

export class StatusesService {
    static statusesService = new StatusesService();

    async getStatusById(id) {
        return await masto.v1.statuses.$select(id).fetch();
    }
}
