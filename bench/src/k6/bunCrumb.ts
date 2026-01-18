import { PORT } from './constants';

import { listen, createRoute } from '../../../dist';

//
createRoute({
    url: '/',

    method: 'POST',

    handler: (request, response) => {
        return request.handleBody().then(response.send);
    },
});

listen({ port: PORT });
