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
        this.defaultRuleSystem = `
            FUNGISTART ONREPLY "Hello" DORESPOND "Hello, Fediverse user!"; FUNGIEND
        `;
        this.ruleParser = RuleParserService.parser;
    }

    startFungiLifecycle() {
        this.runInitialSearch().then(() => {
            this.startAnsweringMentions();
            this.runFungiLifecycle().then(() => {
                const cronSchedule = '2 * * * *';
                cron.schedule(cronSchedule, () => {
                    this.runFungiLifecycle();
                });
                console.log("Scheduled fungi lifecycle " + cronToHumanReadable(cronSchedule));
            });
        });
    }

    async runInitialSearch() {
        // 0. Initial search
        console.log("runInitialSearch");
        const status = await MycelialFungiHistoryService.mycelialFungiHistoryService.getStatusWithValidFUNGICodeFromFungiTag();
        if (status) {
            // 1. New State: set found rule system as new state
            this.fungiState.setRuleSystem(decode(status.content));
        }
        else {
            // 1. New State: set default rule system as new state
            this.fungiState.setRuleSystem(this.defaultRuleSystem);
        }
        let fungiHistory = FungiHistoryService.fungiHistoryService.getFungiHistory();
        fungiHistory.getFungiStates().push(this.fungiState);
    }

    startAnsweringMentions() {
        // 2. Answer Questions by users
        const answerSchedule = '*/3 * * * *';
        cron.schedule(answerSchedule, () => {
            this.checkForMentionsAndLetFungiAnswer();
        });
        console.log("Scheduled fungi answering " + cronToHumanReadable(answerSchedule));
    }

    async runFungiLifecycle() {
        console.log("runFungiLifecycle");

        // 3. Calculate fitness of current state based on user feedback
        FungiStateFitnessService.fungiStateFitnessService.calculateForFungiState(this.fungiState);

        // 4. Share code health
        this.shareStateUnderFungiTag(this.fungiState.getRuleSystem() + " Fitness: " + this.fungiState.getFitness());

        // 5. Calculate mutation
        const evolvedRuleSystem = this.mutateRuleSystem();

        // 1. New State: set mutate rule system as new state
        this.fungiState = new FungiState(evolvedRuleSystem, 0);
        const fungiHistory = FungiHistoryService.fungiHistoryService.getFungiHistory();
        fungiHistory.push(this.fungiState);
        this.parseAndSetCommandsFromFungiCode(evolvedRuleSystem);
    }

    mutateRuleSystem() {
        const fungiHistory = FungiHistoryService.fungiHistoryService.getFungiHistory();
        const mycelialFungiHistory = MycelialFungiHistoryService.mycelialFungiHistoryService.getMycelialFungiHistory();
        const evolvedRuleSystem = EvolutionaryAlgorithm.evolutionaryAlgorithm.evolve(
            fungiHistory,
            mycelialFungiHistory,
            this.fungiState.getRuleSystem());
        return evolvedRuleSystem;
    }

    parseAndSetCommandsFromFungiCode(code) {
        const SUCCESS = true;
        const FAIL = false;
        console.log("Received fungi code: " + code);
        const staticRuleSystem = this.ruleParser.parse(code);
        this.fungiState.setRuleSystem(staticRuleSystem);
        console.log("Sucessfully parsed and set as commands");
        return SUCCESS;
    }

    shareStateUnderFungiTag(message) {
        send(message + "#" + Config.MYCELIAL_HASHTAG);
    }

    async checkForMentionsAndLetFungiAnswer() {
        const mentions = await getMentionsNotifications();
        for (const mention of mentions) {
            const answer = await this.generateAnswerToText(mention.status.content);
            await sendReply(answer, mention.status);
        }
    }

    async generateAnswerToText(content) {
        console.log("generateAnswerToStatus with content", content);
        const fungiResult = this.ruleParser.calculateResponse(this.fungiState.getRuleSystem(), content);
        console.log("Response: '" + fungiResult + "'");
        return fungiResult;
    }
}
