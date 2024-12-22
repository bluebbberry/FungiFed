import * as cron from "node-cron";
import {cronToHumanReadable} from "./post.util.service.js";
import {MycelialFungiHistory} from "../model/MycelialFungiHistory.js";
import masto from "../configs/mastodonclient.js";
import * as Config from "../configs/config.js";
import {decode} from "html-entities";
import {FungiState} from "../model/FungiState.js";
import {RuleParserService} from "./rule-parser.service.js";
import {StatusesService} from "./statuses.service.js";

export class MycelialFungiHistoryService {
    static mycelialFungiHistoryService = new MycelialFungiHistoryService();

    constructor() {
        this.mycelialFungiHistory = new MycelialFungiHistory([]);
    }

    startAggregatingMycelialData() {
        const checkForMycelialDataSchedule = Config.MYCELIAL_FETCH_SCHEDULE;
        cron.schedule(checkForMycelialDataSchedule, () => {
            this.fetchNewEntriesFromMycelialHashtag();
        });
        console.log("Scheduled fetching mycelial data " + cronToHumanReadable(checkForMycelialDataSchedule));
    }

    async fetchNewEntriesFromMycelialHashtag() {
        const validStatuses = await this.getAllStatusesWithValidFUNGICodeFromFungiTag();
        console.log("Scraped " + validStatuses.length + " tag posts for mycerial history");
        let fungiStates = this.mycelialFungiHistory.getFungiStates();
        validStatuses.forEach((status) => {
            const staticRuleSystem = RuleParserService.parser.parse(decode(status.content));
            fungiStates.push(new FungiState(staticRuleSystem, this.parseFitnessFromStatus(status.content)));
        });
        this.mycelialFungiHistory.setFungiStates(fungiStates);
    }

    /**
     * Extracts the fitness value from a given post string.
     *
     * @param {string} content - The post containing the fitness value.
     * @returns {number} - The extracted fitness value.
     * @throws {Error} - If no fitness value is found in the post.
     */
    parseFitnessFromStatus(content) {
        const pattern = /Fitness:\s*([0-9]*\.?[0-9]+)/;
        const match = content.match(pattern);
        if (match) {
            return parseFloat(match[1]);
        } else {
            throw new Error("No fitness value found in the post.");
        }
    }

    getMycelialFungiHistory() {
        return this.mycelialFungiHistory;
    }

    async getStatusWithValidFUNGICodeFromFungiTag() {
        const statuses = await StatusesService.statusesService.getStatusesFromTag(Config.MYCELIAL_HASHTAG, 40);
        for (let i = 0; i < statuses.length; i++) {
            const status = statuses[i];
            const decodedStatusContent = decode(status.content);
            if (RuleParserService.parser.containsValidFUNGI(decodedStatusContent)) {
                console.log("found status with FUNGI code");
                return status;
            }
        }
    }

    async getAllStatusesWithValidFUNGICodeFromFungiTag() {
        const result = [];
        const statuses = await StatusesService.statusesService.getStatusesFromTag(Config.MYCELIAL_HASHTAG, 40);
        for (let i = 0; i < statuses.length; i++) {
            const status = statuses[i];
            const decodedStatusContent = decode(status.content);
            if (RuleParserService.parser.containsValidFUNGI(decodedStatusContent)) {
                result.push(status);
            }
        }
        return result;
    }
}
