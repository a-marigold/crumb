import { describe, it, expect } from 'bun:test';

import type { BunRequest } from 'bun';

import {
    wrapRouteCallback,
    prepareRoute,
    prepareRoutes,
    listen,
} from '../server';

import type { WrappedRouteCallback } from '../server';

describe('wrapRouteCallback', () => {
    it('should return a working wrapped callback', () => {
        const responseData = 'Hello';

        const testWrappedCallback = wrapRouteCallback({
            url: '/test',
            method: 'GET',

            handler: (request, response) => {
                return response.send(responseData);
            },
        });

        const mockRequest = new Request('http://localhost:3000') as BunRequest;

        Promise.resolve(testWrappedCallback(mockRequest)).then((response) => {
            const bodyPromise =
                response.body?.json() || Promise.resolve(undefined);
            bodyPromise.then((data) => {
                expect(data).toBe(responseData);
            });
        });
    });
});
