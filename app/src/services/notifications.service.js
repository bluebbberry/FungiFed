import masto from "../configs/mastodonclient.js";

export async function getMentionsNotifications() {
    const notifications = await masto.v1.notifications.list({
        limit: 30,
    });
    return notifications.filter((m) => m.type === "mention");
}
