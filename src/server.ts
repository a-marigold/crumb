import { serve } from 'bun';

import type { BunRequest } from 'bun';

import type {
    Route,
    RouteOptions,
    RouteRequest,
    RouteResponse,
    Headers,
    HttpMethod,
} from './types/route';

type WrappedRouteCallback = (request: BunRequest) => Promise<Response>;

type PreparedRoute = Partial<Record<HttpMethod, WrappedRouteCallback>>;

/**
 * Used straight as Bun.serve `routes` object.
 */
type PreparedRoutes = Record<RouteOptions['url'], PreparedRoute>;

/**
 * An internal Map with routes of app. Do not use in user code to prevent undefined errors
 */
export const _routes = new Map<RouteOptions['url'], Route>();

/**
 * Creates a function with handler and all route hooks.
 * The created function can be used as a callback for route in Bun.serve `routes` object.
 *
 * @param routeOptions options of route
 * @returns {WrappedRouteCallback} Function that is ready to be used in Bun.serve `routes`
 */
const wrapRouteCallback = (
    routeOptions: RouteOptions
): WrappedRouteCallback => {
    return (request) => {
        let status: number | undefined = undefined;

        let statusText: string | undefined = undefined;

        let responseBody: unknown = null;
        let headers: Headers = {};

        const routeRequest: RouteRequest = request;

        const bodyPromise = request.body?.json() ?? Promise.resolve(undefined);

        return bodyPromise.then((data) => {
            routeRequest.body = data;

            const routeResponse: RouteResponse = {
                setHeader: (name, value) => {
                    headers[name] = value;
                },

                send: (data, options) => {
                    responseBody = data;

                    status = options?.status;
                    statusText = options?.statusText;
                },
            };

            if (typeof responseBody === 'object') {
                headers['Content-Type'] = 'application/json';
            } else {
                headers['Content-Type'] = 'text/plain';
            }

            routeOptions.onRequest?.(routeRequest, routeResponse);

            routeOptions.preHandler?.(routeRequest, routeResponse);

            routeOptions.handler(routeRequest, routeResponse);

            return new Response(JSON.stringify(responseBody), {
                headers,
                status,
                statusText,
            });
        });
    };
};

/**
 * Prepares a route to be used in Bun.serve `routes` object.
 *
 * @param {Route} route
 *
 * @returns {PreparedRoute} Route object with `GET` or other http method keys with wrapped route callbacks.
 *
 * @example
 * ```typescript
 * prepareRoute({
 *   GET: {
 *     url: '/products',
 *       method: 'GET',
 *       handler: (request, response) => {},
 *   },
 *   POST: {
 *     url: '/products/:id',
 *       method: 'POST',
 *       handler: (request, response) => {},
 *   },
 * });
 *
 * // Output will be:
 *
 * ({
 *   GET: (request: BunRequest) => {
 *     // ...code
 *     return new Response();
 *   },
 *   POST: (request: BunRequest) => {
 *     // ...code
 *     return new Response();
 *   },
 * })
 * ```
 *
 */
const prepareRoute = (route: Route): PreparedRoute => {
    const preparedRoute: Partial<PreparedRoute> = {};

    for (const routeMethod of Object.entries(route) as [
        HttpMethod,

        RouteOptions
    ][]) {
        preparedRoute[routeMethod[0]] = wrapRouteCallback(routeMethod[1]);
    }

    return preparedRoute;
};

/**
 * Calls `prepareRoute` for every route of `_routes` Map and returns prepared routes to use in Bun.serve `routes`.
 *
 * @returns {PreparedRoutes} An object that is used straight in Bun.serve `routes` object.
 */
const prepareRoutes = (): PreparedRoutes => {
    const preparedRoutes: PreparedRoutes = {};

    for (const route of _routes) {
        preparedRoutes[route[0]] = prepareRoute(route[1]);
    }

    return preparedRoutes;
};
/**
 * Starts serving http server.
 *
 * @param {number | string} port port to listen. 3000 by default
 * @param {string} hostname hostname to listen. `0.0.0.0` by default
 *
 *
 *
 *
 * @example
 *
 * ```typescript
 * import { listen } from 'crumb-bun';
 * const PORT = proccess.env['PORT'] || 1000;
 * listen(PORT, 'localhost');
 * ```
 */
export const listen = (port?: number | string, hostname?: string): void => {
    serve({
        port,

        hostname,
        routes: prepareRoutes(),
    });
};
