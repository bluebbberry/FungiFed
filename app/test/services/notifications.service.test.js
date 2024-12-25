// test/notifications.test.js
import assert from "assert";
import sinon from "sinon";
import {getMasto} from "../../src/configs/mastodonclient.js";
import {getMentionsNotifications} from "../../src/services/notifications.service.js";  // Assuming masto is the real class path

// Test suite
/*describe('getMentionsNotifications', function () {
    let mastoStub;

    beforeEach(() => {
        // Create a stub of the masto class
        mastoStub = sinon.stub(getMasto, 'v1').value({
            notifications: {
                list: async () => {
                    // Mock notifications data
                    return [
                        { type: "mention", id: 1, content: "Mention 1" },
                        { type: "follow", id: 2, content: "Follow 1" },
                        { type: "mention", id: 3, content: "Mention 2" },
                        { type: "like", id: 4, content: "Like 1" }
                    ];
                }
            }
        });
    });

    afterEach(() => {
        // Restore the original function after each test
        sinon.restore();
    });

    it('should return only notifications of type "mention"', async function () {
        // Call the function
        const mentions = await getMentionsNotifications();

        // Assert that the returned notifications only contain "mention" type
        assert.strictEqual(mentions.length, 2); // We have 2 mentions in the mock list
        mentions.forEach((mention) => {
            assert.strictEqual(mention.type, "mention");
        });
    });

    it('should return no more than the specified limit of notifications', async function () {
        // Mock the limit parameter (even though we're not using it in the mock, you can adapt this as needed)
        const notifications = await mastoStub.v1.notifications.list({ limit: 30 });

        // Make sure that we do not get more than 30 notifications
        assert.strictEqual(notifications.length, 4); // Should match the mock data length
    });
});*/
