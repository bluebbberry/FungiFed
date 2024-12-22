import { assert } from 'chai';
import { expect } from "chai";
import sinon from "sinon";
import cron from "node-cron";
import {FungiService} from "../../src/services/fungi.service.js";
import {MycelialFungiHistoryService} from "../../src/services/mycelial-fungi-history.service.js";
import {RuleParserService} from "../../src/services/rule-parser.service.js";
import {StaticRuleSystem} from "../../src/model/StaticRuleSystem.js";
import {StaticRule} from "../../src/model/StaticRule.js";
import {FungiStateFitnessService} from "../../src/services/fungi-state-fitness.service.js";
import {FungiHistoryService} from "../../src/services/fungi-history.service.js";
import {EvolutionaryAlgorithm} from "../../src/services/evolutionary-algorithm.service.js";
import {getMentionsNotifications} from "../../src/services/notifications.service.js";
import {StatusesService} from "../../src/services/statuses.service.js";
import {sendReply} from "../../src/services/post.util.service.js";
import * as Config from "../../src/configs/config.js";

const ruleParser = RuleParserService.parser;
const testCode1 = `
FUNGISTART ONREPLY "Hello" DORESPOND "Hello, Fediverse user!"; FUNGIEND
`;

describe('Test parser', function(){
    it('validate for FUNGI static rule system', function(){
        assert.isFalse(ruleParser.containsValidFUNGI(testCode1));
    });
});

describe("FungiService", () => {
    let fungiService;

    beforeEach(() => {
        fungiService = new FungiService();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("runInitialSearch", () => {
        it("should set the rule system from the hashtag if a valid status is found", async () => {
            const statusMock = { content: "valid fungi code" };
            const parsedRuleSystem = new StaticRuleSystem([new StaticRule("Key", "Value")]);

            sinon.stub(MycelialFungiHistoryService.mycelialFungiHistoryService, "getStatusWithValidFUNGICodeFromFungiTag").resolves(statusMock);
            sinon.stub(RuleParserService.parser, "parse").returns(parsedRuleSystem);

            await fungiService.runInitialSearch();

            expect(fungiService.fungiState.getRuleSystem()).to.deep.equal(parsedRuleSystem);
        });

        it("should set the default rule system if no valid status is found", async () => {
            sinon.stub(MycelialFungiHistoryService.mycelialFungiHistoryService, "getStatusWithValidFUNGICodeFromFungiTag").resolves(null);

            await fungiService.runInitialSearch();

            expect(fungiService.fungiState.getRuleSystem()).to.deep.equal(fungiService.defaultRuleSystem);
        });
    });

    describe("startAnsweringMentions", () => {
        it("should schedule mention answering with the configured cron schedule", () => {
            const cronStub = sinon.stub(cron, "schedule");
            const USER_ANSWERING_SCHEDULE = "*/5 * * * *"; // Example schedule
            //const configStub = sinon.stub(Config, "USER_ANSWERING_SCHEDULE").value("*/5 * * * *"); // Stub the config value

            fungiService.startAnsweringMentions(USER_ANSWERING_SCHEDULE);

            expect(cronStub.calledWith(USER_ANSWERING_SCHEDULE, sinon.match.any)).to.be.true;
        });
    });

    describe("runFungiLifecycle", () => {
        it("should calculate fitness, share state, and set mutated rule system", async () => {
            const fitnessStub = sinon.stub(FungiStateFitnessService.fungiStateFitnessService, "calculateFitnessForFungiState");
            const shareStub = sinon.stub(fungiService, "shareStateUnderFungiTag");
            const mutateStub = sinon.stub(fungiService, "mutateRuleSystem").returns(new StaticRuleSystem([new StaticRule("MutatedKey", "MutatedValue")]));

            await fungiService.runFungiLifecycle();

            expect(fitnessStub.calledWith(fungiService.fungiState)).to.be.true;
            expect(shareStub.called).to.be.true;
            expect(mutateStub.called).to.be.true;

            const newRuleSystem = fungiService.fungiState.getRuleSystem();
            expect(newRuleSystem.rules[0].key).to.equal("MutatedKey");
            expect(newRuleSystem.rules[0].value).to.equal("MutatedValue");
        });
    });

    describe("mutateRuleSystem", () => {
        it("should evolve a new rule system based on history and mycelial data", () => {
            const fungiHistoryStub = sinon.stub(FungiHistoryService.fungiHistoryService, "getFungiHistory").returns({
                getFungiStates: () => []
            });
            const mycelialHistoryStub = sinon.stub(MycelialFungiHistoryService.mycelialFungiHistoryService, "getMycelialFungiHistory").returns({
                getFungiStates: () => []
            });
            const evolveStub = sinon.stub(EvolutionaryAlgorithm.evolutionaryAlgorithm, "evolve").returns(new StaticRuleSystem([new StaticRule("EvolvedKey", "EvolvedValue")]));

            const evolvedRuleSystem = fungiService.mutateRuleSystem();

            expect(evolveStub.called).to.be.true;
            expect(evolvedRuleSystem.rules[0].key).to.equal("EvolvedKey");
            expect(evolvedRuleSystem.rules[0].value).to.equal("EvolvedValue");
        });
    });

    describe("checkForMentionsAndLetFungiAnswer", () => {
        it("should reply to mentions and statuses from the nutritious hashtag", async () => {
            const mentionsMock = [{ status: { content: "mention content" } }];
            const postStatusesMock = [{ content: "status content" }];
            sinon.stub(getMentionsNotifications, "default").resolves(mentionsMock);
            sinon.stub(StatusesService.statusesService, "getStatusesFromTag").resolves(postStatusesMock);

            const sendReplyStub = sinon.stub(sendReply, "default");

            await fungiService.checkForMentionsAndLetFungiAnswer();

            expect(sendReplyStub.called).to.be.true;
        });
    });
});
