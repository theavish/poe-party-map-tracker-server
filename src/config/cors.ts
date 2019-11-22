import cors from 'cors';

const originWhitelist = [
    'http://localhost:3000',
];

export const corsOptions: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'X-Access-Token',
        'PoE-Session-Id',
    ],
    credentials: true,
    methods: 'GET,OPTIONS',
    origin: (origin, callback) => {
        // can add `|| !origin` to this conditional to allow testing in the browser
        if (originWhitelist.indexOf(origin as string) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), undefined);
        }
    },
};
