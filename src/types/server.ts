import type { Validate } from './schema';

/**
 *
 *
 * Type of `options` parameter in `listen` function
 */
export interface ListenOptions {
    /**
     * Server port to listen
     */
    port?: number | string;

    /**
     * Server hostname to listen
     * @example `localhost`, `0.0.0.0`
     *
     */

    hostname?: string;

    /**
     * Development flag.
     *
     * @default NODE_ENV enviroment variable value
     */
    development?: boolean;

    /**
     * Global schema validator function that will be used in every route
     */
    schemaValidator?: Validate;
}
