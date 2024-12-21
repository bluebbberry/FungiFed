import 'dotenv/config';

if (!process.env.URL || !process.env.MASTODON_API_KEY || !process.env.ACCOUNT_NAME || !process.env.MYCELIAL_HASHTAG) {
    console.error('Missing program arguments (pass through .env file: URL, MASTODON_API_KEY, ACCOUNT_NAME, MYCELIAL_HASHTAG)!');
    process.exit(1);
}

const URL = process.env.URL;
const MASTODON_API_KEY = process.env.MASTODON_API_KEY;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;
const MYCELIAL_HASHTAG = process.env.MYCELIAL_HASHTAG;

export {URL, ACCOUNT_NAME, MASTODON_API_KEY, MYCELIAL_HASHTAG};
