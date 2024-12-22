import { assert } from 'chai';
import {cronToHumanReadable} from "../../src/services/post.util.service.js";

describe('cronToHumanReadable', () => {
    describe('Valid Cron Expressions', () => {
        it('should return "every minute every hour every day every month every weekday" for "* * * * *"', () => {
            const result = cronToHumanReadable('* * * * *');
            assert.strictEqual(result, 'every minute every hour every day every month every weekday');
        });

        it('should handle specific minute and hour: "15 10 * * *"', () => {
            const result = cronToHumanReadable('15 10 * * *');
            assert.strictEqual(result, 'at minute 15 at hour 10 every day every month every weekday');
        });

        it('should handle ranges: "0-30 9-17 * * *"', () => {
            const result = cronToHumanReadable('0-30 9-17 * * *');
            assert.strictEqual(result, 'from 0 to 30 minute from 9 to 17 hour every day every month every weekday');
        });

        it('should handle lists: "0,15,30,45 * * * *"', () => {
            const result = cronToHumanReadable('0,15,30,45 * * * *');
            assert.strictEqual(result, 'at 0, 15, 30, 45 minute every hour every day every month every weekday');
        });

        it('should handle steps: "*/15 * * * *"', () => {
            const result = cronToHumanReadable('*/15 * * * *');
            assert.strictEqual(result, 'every 15 minute every hour every day every month every weekday');
        });

        it('should handle combinations: "*/10 8-18/2 * 1,7 1-5"', () => {
            const result = cronToHumanReadable('*/10 8-18/2 * 1,7 1-5');
            assert.strictEqual(result, 'every 10 minute every 2 hour from 8 to 18 every day on January, July from 1 to 5 weekday');
        });
    });

    describe('Invalid Cron Expressions', () => {
        it('should throw an error for invalid cron expressions', () => {
            assert.throws(() => cronToHumanReadable('invalid cron'), /Invalid cron expression/);
        });

        it('should throw an error for too few fields', () => {
            assert.throws(() => cronToHumanReadable('* * *'), /Invalid cron expression/);
        });
    });

    describe('Edge Cases', () => {
        it('should handle a single specific month: "* * * 12 *"', () => {
            const result = cronToHumanReadable('* * * 12 *');
            assert.strictEqual(result, 'every minute every hour every day on December every weekday');
        });

        it('should handle a single specific day of the week: "* * * * 0"', () => {
            const result = cronToHumanReadable('* * * * 0');
            assert.strictEqual(result, 'every minute every hour every day every month on Sunday');
        });

        it('should handle full ranges for all parts: "0-59 0-23 1-31 1-12 0-6"', () => {
            const result = cronToHumanReadable('0-59 0-23 1-31 1-12 0-6');
            assert.strictEqual(result, 'from 0 to 59 minute from 0 to 23 hour from 1 to 31 day from 1 to 12 month from 0 to 6 weekday');
        });
    });
});
