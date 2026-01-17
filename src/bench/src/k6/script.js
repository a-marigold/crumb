import { PORT } from './constants.js';

import http from 'k6/http';

//

export const options = {
    scenarios: {
        load: {
            executor: 'constant-arrival-rate',

            rate: 16000,
            timeUnit: '1s',

            duration: '30s',
            preAllocatedVUs: 1000,

            maxVUs: 3000,
        },
    },
};

//

export default () => {
    http.post(
        'http://localhost:' + PORT + '/',

        JSON.stringify({ key: 'value' }),

        { headers: { 'Content-Type': 'application/json' } },
    );
};
