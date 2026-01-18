import { serve, stdout } from 'bun';

import { PORT } from './constants';

serve({
    routes: {
        '/': {
            POST: (request) => {
                return request.json().then(
                    (body) =>
                        new Response(JSON.stringify(body), {
                            headers: { 'Content-Type': 'application/json' },
                        }),
                );
            },
        },
    },
    port: PORT,
});
stdout.write('Bun is running\n');
