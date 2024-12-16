import express from "express";
import {getMentionsNotifications} from "../services/notifications.service.js";

const router = express.Router();

// get statuses from client
router.get("/mentions", async (request, response) => {
    try {
        // Send message to mastodon server
        const mentions = await getMentionsNotifications();
        response.status(200).json({ requestBody: mentions });
    } catch (error) {
        console.error("Error fetching mention-notifications:", error);
        response.status(500).json({ error: "Failed to fetch mention-notifications" });
    }
});

export default router;
