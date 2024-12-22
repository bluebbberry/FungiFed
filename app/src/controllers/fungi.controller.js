import express from "express";
import { FungiService } from "../services/fungi.service.js";
import { decode } from 'html-entities';
import {RuleParserService} from "../services/rule-parser.service.js";
import {StatusesService} from "../services/statuses.service.js";
import * as Config from "../configs/config.js";

const router = express.Router();
const fungiService = FungiService.fungiService;

// test if bot alive
router.get("/", async (request, response) => {
    response.status(200).json({ responseBody: {
        "alive": true
    }});
});

// post fungi code to bot to execute on next reply
router.post("/", async (request, response) => {
    const fungiCode = request.body;
    const decodedFungiCode = decode(fungiCode["content"]);
    const staticRuleSystem = RuleParserService.parser.parse(decodedFungiCode);
    const success = fungiService.setCommandsFromFungiCode(staticRuleSystem);
    response.status(200).json({ responseBody: success });
});

// ask bot for a reply
router.post("/askforreply", async (request, response) => {
    const text = request.body;
    const textWithoutHtmlEncoded = decode(text["text"]);
    const botResponse = fungiService.generateAnswerToText(textWithoutHtmlEncoded);
    response.status(200).json({ responseBody: botResponse });
});

// get statuses from client
router.get("/tag", async (request, response) => {
    try {
        // Send message to mastodon server
        const statuses = await StatusesService.statusesService.getStatusesFromTag(Config.MYCELIAL_HASHTAG, 40);
        response.status(200).json({ requestBody: statuses });
    } catch (error) {
        console.error("Error fetching posts:", error);
        response.status(500).json({ error: "Failed to fetch posts" });
    }
});

// post statuses to hashtag
router.post("/tag", async (request, response) => {
    const body = request.body;
    await fungiService.shareStateUnderFungiTag(body["message"]);
    const success = true;
    response.status(200).json({ responseBody: success });
});

export default router;
