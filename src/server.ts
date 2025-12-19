// TODO: add docs

import { serve } from 'bun';

import type {
    Route,
    RouteOptions,
    RouteRequest,
    RouteResponse,
    Headers,
    HttpMethod,
} from './types/route';

type WrappedRouteCallback = (request: Request) => Response;

type PreparedRoute = Record<HttpMethod, WrappedRouteCallback>;

export const _routes = new Map<RouteOptions['url'], RouteOptions>();

const wrapRouteCallback = (
    routeOptions: RouteOptions
): WrappedRouteCallback => {
    return () => Response.json();
};

const prepareRoute = (route: Route): Partial<PreparedRoute> => {
    const preparedRoute: Partial<PreparedRoute> = {};

    for (const routeMethod of Object.entries(route) as [
        HttpMethod,

        RouteOptions
    ][]) {
        preparedRoute[routeMethod[0]] = wrapRouteCallback(routeMethod[1]);
    }

    return preparedRoute;
};

const preparedRoutes: Record<RouteOptions['url'], PreparedRoute> = {};

export const listen = (port?: number, hostname?: string): void => {
    serve({
        port,

        hostname,

        routes: preparedRoutes,
    });
};
