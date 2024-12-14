import express from "express";
import { test, parseFungiCode, getStatusesFromFungiTag, postStatusUnderFungiTag } from "../services/fungi.service.js";

const router = express.Router();

router.get("/", async (request, response) => {
    response.status(200).json({ responseBody: {
        "test": test()
    }});
});

router.post("/", async (request, response) => {
    const fungiCode = JSON.stringify(request.body);
    const success = parseFungiCode(fungiCode);
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

router.post("/tag", async (request, response) => {
    const body = request.body;
    await postStatusUnderFungiTag(body["message"]);
    const success = true;
    response.status(200).json({ responseBody: success });
});

export default router;
