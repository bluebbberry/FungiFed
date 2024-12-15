import express from "express";
import {
    parseAndSetCommandsFromFungiCode,
    getStatusesFromFungiTag,
    postStatusUnderFungiTag,
    generateAnswerToText
} from "../services/fungi.service.js";
import {decode, encode} from 'html-entities';

const router = express.Router();

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
    const success = parseAndSetCommandsFromFungiCode(decodedFungiCode);
    response.status(200).json({ responseBody: success });
});

// ask bot for a reply
router.post("/askforreply", async (request, response) => {
    const text = request.body;
    const textWithoutHtmlEncoded = decode(text["text"]);
    const botResponse = await generateAnswerToText(textWithoutHtmlEncoded);
    response.status(200).json({ responseBody: botResponse });
});

// get statuses from client
router.get("/tag", async (request, response) => {
    try {
        // Send message to mastodon server
        const statuses = await getStatusesFromFungiTag();
        response.status(200).json({ requestBody: statuses });
    } catch (error) {
        console.error("Error fetching posts:", error);
        response.status(500).json({ error: "Failed to fetch posts" });
    }
});

// post statuses to hashtag
router.post("/tag", async (request, response) => {
    const body = request.body;
    await postStatusUnderFungiTag(body["message"]);
    const success = true;
    response.status(200).json({ responseBody: success });
});

export default router;
