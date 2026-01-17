import Fastify from 'fastify';

import { PORT } from './constants';

const fastify = Fastify({ logger: false });

fastify.route({
    url: '/',
    method: 'POST',
    handler: (request, response) => {
        return response.send(request.body);
    },
});

fastify.listen({ port: PORT }, () => {
    Bun.stdout.write('Fastify is running\n');
});
