import assert from 'assert';
import sinon from 'sinon';
import masto from '../../src/configs/mastodonclient.js';
import {StatusesService} from "../../src/services/statuses.service.js";

describe('StatusesService', function () {
    let statusesService;

    beforeEach(function () {
        statusesService = StatusesService.statusesService;
    });

    afterEach(function () {
        // Restore the original behavior of any stubbed methods.
        sinon.restore();
    });

    describe('getStatusById', function () {
        it('should fetch a status by ID', async function () {
            const mockId = '12345';
            const mockStatus = { id: mockId, content: 'Mock Status Content' };

            // Stub the masto client method to simulate API response
            const fetchStub = sinon.stub(masto.v1.statuses.$select(mockId), 'fetch').resolves(mockStatus);

            const result = await statusesService.getStatusById(mockId);

            assert(fetchStub.calledOnce, 'Expected fetch to be called once');
            assert.strictEqual(result, mockStatus, 'The result should match the mock status');
        });
    });

    describe('getStatusesFromTag', function () {
        it('should fetch statuses from a tag', async function () {
            const mockTag = 'mocktag';
            const mockStatuses = [
                { id: '1', content: 'First mock status' },
                { id: '2', content: 'Second mock status' },
            ];

            // Stub the masto client method to simulate API response
            const listStub = sinon.stub(masto.v1.timelines.tag.$select(mockTag), 'list').resolves(mockStatuses);

            const result = await statusesService.getStatusesFromTag(mockTag, 2);

            assert(listStub.calledOnce, 'Expected list to be called once');
            assert.strictEqual(listStub.args[0][0].limit, 2, 'The limit parameter should be passed correctly');
            assert.deepStrictEqual(result, mockStatuses, 'The result should match the mock statuses');
        });

        it('should use default numOfStatuses when not provided', async function () {
            const mockTag = 'mocktag';
            const mockStatuses = [
                { id: '1', content: 'First mock status' },
                { id: '2', content: 'Second mock status' },
                // more mock statuses...
            ];

            const listStub = sinon.stub(masto.v1.timelines.tag.$select(mockTag), 'list').resolves(mockStatuses);

            const result = await statusesService.getStatusesFromTag(mockTag);

            assert(listStub.calledOnce, 'Expected list to be called once');
            assert.strictEqual(listStub.args[0][0].limit, 40, 'Default limit should be 40');
        });
    });
});
