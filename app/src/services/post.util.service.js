import masto from "../configs/mastodonclient.js";

async function send(message) {
    const status = await masto.v1.statuses.create({
        status: message,
    });
    console.log(status.url);
}

async function sendReply(message, status) {
    const s = await masto.v1.statuses.create({
        status: message,
        inReplyToId: status.id,
    });
    console.log(s.url);
}

export { send, sendReply };
