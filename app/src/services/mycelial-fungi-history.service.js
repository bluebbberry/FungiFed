import {FungiHistory} from "../model/FungiHistory.js";
import {StatusesService} from "./statuses.service.js";
import * as cron from "node-cron";
import {cronToHumanReadable} from "./post.util.service.js";
import {MycelialFungiHistory} from "../model/MycelialFungiHistory.js";
import masto from "../configs/mastodonclient.js";
import * as Config from "../configs/config.js";
import {decode} from "html-entities";
import {FungiState} from "../model/FungiState.js";
import {RuleParserService} from "./rule-parser.service.js";

export class MycelialFungiHistoryService {
    static mycelialFungiHistoryService = new MycelialFungiHistoryService();

    constructor() {
        this.mycelialFungiHistory = new MycelialFungiHistory([]);
    }

    startAggregatingMycelialData() {
        const checkForMycelialDataSchedule = '28 */2 * * *';
        cron.schedule(checkForMycelialDataSchedule, () => {
            this.fetchNewEntriesFromMycelialHashtag();
        });
        console.log("Scheduled fetching mycelial data " + cronToHumanReadable(checkForMycelialDataSchedule));
    }

    async fetchNewEntriesFromMycelialHashtag() {
        const statuses = await this.getStatusesFromFungiTag();
        console.log("Scraped " + statuses.length + " tag posts for mycerial history");
        let fungiStates = this.mycelialFungiHistory.getFungiStates();
        statuses.forEach((status) => {
            fungiStates.push(new FungiState(status, this.parseFitnessFromStatus(status)));
        });
        this.mycelialFungiHistory.setFungiStates(fungiStates);
    }

    parseFitnessFromStatus(status) {
        status.content;
        return 0;
    }

    getMycelialFungiHistory() {
        return this.mycelialFungiHistory;
    }

    async getStatusesFromFungiTag() {
        const statuses = await masto.v1.timelines.tag.$select(Config.MYCELIAL_HASHTAG).list({
            limit: 40,
        });
        return statuses;
    }

    async getStatusWithValidFUNGICodeFromFungiTag() {
        const statuses = await this.getStatusesFromFungiTag();
        for (let i = 0; i < statuses.length; i++) {
            const status = statuses[i];
            const decodedStatusContent = decode(status.content);
            if (RuleParserService.parser.containsValidFUNGI(decodedStatusContent)) {
                console.log("found status with FUNGI code");
                return status;
            }
        }
    }
}
