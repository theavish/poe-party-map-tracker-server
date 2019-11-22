import { logger } from '@shared';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { corsOptions } from '../config/cors';
import cors from 'cors';
import superagent from 'superagent';
import { GET_STASH_ITEMS } from '../constants/urls';
import { POE_SESSION_ID as sessionIdCookieName } from '../constants/cookies';

// Init shared
const router = Router();

router.get('/get-stash-items', cors(corsOptions), async (req: Request, res: Response) => {
    const {
        sessionId,
    } = req.query;

    superagent.get(GET_STASH_ITEMS)
        .query(req.query)
        .set('Cookie', `${sessionIdCookieName}=${sessionId}`)
        .end((error, response) => {
            if (error) {
                logger.error(error.message, error);

                return res.status(BAD_REQUEST).json(error.stack);
            }

            return res.status(OK).json(response.body);
        });
});

export default router;
