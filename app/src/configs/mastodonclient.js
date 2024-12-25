import { createRestAPIClient } from "masto";
import * as Config from "./config.js";

let mastoInstance = null; // Singleton instance

// Function to get or create the Mastodon client
const getMasto = () => {
    if (!mastoInstance) {
        mastoInstance = createRestAPIClient({
            url: Config.URL,
            accessToken: Config.MASTODON_API_KEY,
        });
    }
    return mastoInstance;
};

// Default export: The singleton instance
export { getMasto };
