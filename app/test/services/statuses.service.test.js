import { assert } from 'chai';
import sinon from 'sinon';
import { StatusesService } from "../../src/services/statuses.service.js";

describe('StatusesService', function () {
    let getMastoStub;
    let mastoClientMock;
    let service;

    beforeEach(() => {
        // Mock the Masto client methods
        mastoClientMock = {
            v1: {
                statuses: {
                    $select: sinon.stub().returns({
                        fetch: sinon.stub(),
                    }),
                },
                timelines: {
                    tag: {
                        $select: sinon.stub().returns({
                            list: sinon.stub(),
                        }),
                    },
                },
            },
        };

        // Stub getMasto to return the mock client
        getMastoStub = sinon.stub().returns(mastoClientMock);

        // Inject the mock getMasto function into the service
        service = new StatusesService(getMastoStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getStatusById', function () {
        it('should fetch a status by ID', async function () {
            const statusId = '12345';
            const mockStatus = { id: statusId, content: 'Hello World!' };
            mastoClientMock.v1.statuses.$select().fetch.resolves(mockStatus);

            const result = await service.getStatusById(statusId);

            assert.isTrue(mastoClientMock.v1.statuses.$select().fetch.calledOnce);
            assert.deepEqual(result, mockStatus);
        });
    });

    describe('getStatusesFromTag', function () {
        it('should fetch statuses by tag name', async function () {
            const tagName = 'example';
            const numOfStatuses = 10;
            const mockStatuses = Array(numOfStatuses).fill({ id: 'status', content: 'Test Status' });
            mastoClientMock.v1.timelines.tag.$select().list.resolves(mockStatuses);

            const result = await service.getStatusesFromTag(tagName, numOfStatuses);

            assert.isTrue(mastoClientMock.v1.timelines.tag.$select().list.calledOnce);
            assert.deepEqual(result, mockStatuses);
        });
    });
});
