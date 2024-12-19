import masto from "../configs/mastodonclient.js";

export class StatusesService {
    static statusesService = new StatusesService();

    getStatusById(id) {
        return masto.v1.statuses.$select(id);
    }
}
