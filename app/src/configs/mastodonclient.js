import {createRestAPIClient} from "masto";
import * as Config from "./config.js";

const masto = createRestAPIClient({
    url: Config.URL,
    accessToken: Config.MASTODON_API_KEY,
});

export default masto;
