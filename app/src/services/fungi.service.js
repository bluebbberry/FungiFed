import { RuleParserService } from "./rule-parser.service.js";
import * as cron from "node-cron";
import { cronToHumanReadable, send, sendReply } from "./post.util.service.js";
import { getMentionsNotifications } from "./notifications.service.js";
import { decode } from 'html-entities';
import { FungiState } from "../model/FungiState.js";
import * as Config from "../configs/config.js";
import {FungiHistoryService} from "./fungi-history.service.js";
import {EvolutionaryAlgorithm} from "./evolutionary-algorithm.service.js";
import {MycelialFungiHistoryService} from "./mycelial-fungi-history.service.js";
import {FungiStateFitnessService} from "./fungi-state-fitness.service.js";
import {StaticRuleSystem} from "../model/StaticRuleSystem.js";
import {StaticRule} from "../model/StaticRule.js";
import {StatusesService} from "./statuses.service.js";

/**
 * A fungi has the following four life cycle (based on https://github.com/bluebbberry/FediFungiHost/wiki/A-Fungi's-Lifecycle):
 *
 * 1. INITIAL SEARCH: Search under seed hashtag for FUNGI code (FUNGI is a custom DSL) - if success: proceed, if not: sleep and try again.
 * 2. SHARE CODE HEALTH: The result with the related code is posted under the nutrition hashtag for other bots to process; at the same time, new code, potentially with evaulation results is scraped from the hashtag (of course, this may also come from human users).
 * 3. NEW CODE EXECUTION: The code is executed and feedback from user interactions is collected
 * 4. CALCULATE MUTATION: Based on one's own results, one's code history and the results from the other bots, a mutation from the current code is calculated and the life cycle start again from 2, this time with the picked code
 * IN PARALLEL: CALCULATE CODE HEALTH: Through collecting user feedback, the results are evaluated and a code fitness number is calculated
 * IN PARALLEL: Aggregate feedback from other fungi through mycelial hashtag and include it in mutation
 */
export class FungiService {
    static fungiService = new FungiService();

    constructor() {
        this.fungiState = new FungiState(null, 0);
        // Example input that is used in case nothing is found
        this.defaultRuleSystem = new StaticRuleSystem([
            new StaticRule("Hello", "Hello, Fediverse user!")
        ]);
        this.ruleParser = RuleParserService.parser;
    }

    startFungiLifecycle() {
        this.runInitialSearch().then(async () => {
            this.startAnsweringMentions();
            await MycelialFungiHistoryService.mycelialFungiHistoryService.fetchNewEntriesFromMycelialHashtag();
            this.runFungiLifecycle().then(() => {
                const cronSchedule = Config.LIFECYCLE_TRIGGER_SCHEDULE;
                cron.schedule(cronSchedule, () => {
                    this.runFungiLifecycle();
                });
                console.log("Scheduled fungi lifecycle " + cronToHumanReadable(cronSchedule));
            });
        });
    }

    async runInitialSearch() {
        // 0. Initial search
        console.log("\n=== === === LIFECYCLE PHASE 0 - INITIAL SEARCH === === ===");
        const status = await MycelialFungiHistoryService.mycelialFungiHistoryService.getStatusWithValidFUNGICodeFromFungiTag();
        if (status) {
            // 1. New State: set found rule system as new state
            console.log("\n=== === === LIFECYCLE PHASE 1 - SET NEW STATE === === ===");
            console.log("Set rule system found on hashtag '" + Config.MYCELIAL_HASHTAG + "'");
            const ruleSystem = RuleParserService.parser.parse(decode(status.content));
            this.fungiState.setRuleSystem(ruleSystem);
        }
        else {
            // 1. New State: set default rule system as new state
            console.log("\n=== === === LIFECYCLE PHASE 1 - SET NEW STATE === === ===");
            console.log("Set default rule system");
            this.fungiState.setRuleSystem(this.defaultRuleSystem);
        }
        let fungiHistory = FungiHistoryService.fungiHistoryService.getFungiHistory();
        fungiHistory.getFungiStates().push(this.fungiState);
    }

    startAnsweringMentions() {
        const answerSchedule = Config.USER_ANSWERING_SCHEDULE;
        cron.schedule(answerSchedule, () => {
            // 2. Answer Questions by users
            console.log("\n=== === === LIFECYCLE PHASE 2 - ANSWERING QUESTIONS BY USERS === === ===");
            this.checkForMentionsAndLetFungiAnswer();
        });
        console.log("Scheduled fungi answering " + cronToHumanReadable(answerSchedule));
    }

    async runFungiLifecycle() {
        // 3. Calculate fitness of current state based on user feedback
        console.log("\n=== === === LIFECYCLE PHASE 3 - CALCULATE FITNESS BASED ON FEEDBACK === === ===");
        FungiStateFitnessService.fungiStateFitnessService.calculateFitnessForFungiState(this.fungiState);

        // 4. Share code health
        console.log("\n=== === === LIFECYCLE PHASE 4 - SHARE OWN FITNESS WITH OTHER FUNGI === === ===");
        const rawCode = this.ruleParser.toRawString(this.fungiState.getRuleSystem());
        this.shareStateUnderFungiTag(rawCode + " Fitness: " + this.fungiState.getFitness());

        // 5. Calculate mutation
        console.log("\n=== === === LIFECYCLE PHASE 5 - CALCULATE MUTATION OF CURRENT STATE === === ===");
        const evolvedRuleSystem = this.mutateRuleSystem();
        console.log("Current state: " + RuleParserService.parser.toRawString(this.fungiState.getRuleSystem()));
        console.log("Mutation:      " + RuleParserService.parser.toRawString(evolvedRuleSystem));

        // 1. New State: set mutate rule system as new state
        console.log("\n=== === === LIFECYCLE PHASE 1 - SET NEW STATE=== === ===");
        this.fungiState = new FungiState(evolvedRuleSystem, 0);
        const fungiHistory = FungiHistoryService.fungiHistoryService.getFungiHistory();
        fungiHistory.getFungiStates().push(this.fungiState);
        this.setCommandsFromFungiCode(evolvedRuleSystem);
    }

    mutateRuleSystem() {
        const fungiHistory = FungiHistoryService.fungiHistoryService.getFungiHistory();
        const mycelialFungiHistory = MycelialFungiHistoryService.mycelialFungiHistoryService.getMycelialFungiHistory();
        console.log("fungiHistory: " + fungiHistory.getFungiStates().length + " entries");
        console.log("mycelial fungiHistory: " + mycelialFungiHistory.getFungiStates().length + " entries");
        const evolvedRuleSystem = EvolutionaryAlgorithm.evolutionaryAlgorithm.evolve(
            fungiHistory,
            mycelialFungiHistory,
            this.fungiState.getRuleSystem());
        return evolvedRuleSystem;
    }

    /**
     * @param {StaticRuleSystem} staticRuleSystem
     * @returns {boolean}
     */
    setCommandsFromFungiCode(staticRuleSystem) {
        const SUCCESS = true;
        const FAIL = false;
        this.fungiState.setRuleSystem(staticRuleSystem);
        console.log("Successfully parsed and set new rule");
        return SUCCESS;
    }

    shareStateUnderFungiTag(message) {
        send(message + " #" + Config.MYCELIAL_HASHTAG);
    }

    async checkForMentionsAndLetFungiAnswer() {
        // check for mentions to account
        const mentions = await getMentionsNotifications();
        for (const mention of mentions) {
            const answer = this.generateAnswerToText(decode(mention.status.content));
            await sendReply(answer, mention.status);
        }

        // check for requests under hashtag
        const postStatuses = await StatusesService.statusesService.getStatusesFromTag(Config.NUTRIOUS_HASHTAG, 40);
        for (const status of postStatuses) {
            if (RuleParserService.parser.isAbleToReactTo(this.fungiState.getRuleSystem(), decode(status.content))) {
                const answer = this.generateAnswerToText(decode(status.content));
                await sendReply(answer, status);
            }
        }
    }

    generateAnswerToText(content) {
        console.log("generateAnswerToStatus with content", content);
        const fungiResult = this.ruleParser.calculateResponse(this.fungiState.getRuleSystem(), content);
        console.log("Response: '" + fungiResult + "'");
        return fungiResult;
    }
}
