import type { ZodType } from 'zod';

declare module 'crumb-bun' {
    interface Schema {
        zod: ZodType;
    }
}
