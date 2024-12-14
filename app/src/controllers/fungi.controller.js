import express from "express";
import { parseAndExecuteFungiCode, getStatusesFromFungiTag, postStatusUnderFungiTag } from "../services/fungi.service.js";

const router = express.Router();

// test if bot alive
router.get("/", async (request, response) => {
    response.status(200).json({ responseBody: {
        "alive": true
    }});
});

// post fungi code to bot to execute
router.post("/", async (request, response) => {
    const fungiCode = JSON.stringify(request.body);
    const success = parseAndExecuteFungiCode(fungiCode);
    response.status(200).json({ responseBody: success });
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
