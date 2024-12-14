import express from "express";
import { test, parseFungiCode } from "../services/fungi.service.js";
import masto from "../configs/mastodonclient.js";

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
        const statuses = await masto.v1.timelines.tag.$select("fungi").list({
            limit: 30,
        });
        response.status(200).json({ requestBody: statuses });
    } catch (error) {
        console.error("Error fetching posts:", error);
        response.status(500).json({ error: "Failed to fetch posts" });
    }
});

export default router;
