import express from "express";
import * as Config from "../configs/config.js";
import masto from "../configs/mastodonclient.js";

const router = express.Router();

router.get("/:id", async (request, response) => {
    const status = await masto.v1.statuses.$select(request.params.id).fetch();
    response.status(200).json({ requestBody: {
        "id": status.id,
        "content": status.content,
        "favourites_count": status.favouritesCount
    }});
});

export default router;
