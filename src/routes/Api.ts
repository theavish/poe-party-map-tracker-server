import { logger } from '@shared';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import superagent from 'superagent';
import { GET_STASH_ITEMS, GET_TRADE_FETCH, POST_TRADE_SEARCH } from '../constants/urls';
import { POE_SESSION_ID as sessionIdCookieName } from '../constants/cookies';

// Init shared
const router = Router();

router.get('/get-stash-items', async (req: Request, res: Response) => {
    const {
        accountName,
        league,
        realm,
        tabIndex,
        tabs,
        sessionId,
    } = req.query;

    superagent.get(GET_STASH_ITEMS)
        .query({
            accountName,
            league,
            realm,
            tabIndex,
            tabs,
        })
        .set('Cookie', `${sessionIdCookieName}=${sessionId}`)
        .end((error, response) => {
            if (error) {
                logger.error(error.message, error);

                return res.status(BAD_REQUEST).json(response.body);
            }

            return res.status(OK).json(response.body);
        });
});

router.post('/trade-search', async (req: Request, res: Response) => {
    const {
        league,
    } = req.query;

    const url = POST_TRADE_SEARCH
        .replace('{league}', league);

    superagent.post(url)
        .send(req.body)
        .then(response => {
            return res.status(OK).json(response.body);
        }, error => {
            return res.status(BAD_REQUEST).json(error.message);
        });
});

router.get('/trade-fetch', async (req: Request, res: Response) => {
    const {
        items,
        query,
    } = req.query;

    const url = GET_TRADE_FETCH
        .replace('{items}', items.toString());

    superagent.get(url)
        .query({
            query,
        })
        .end((error, response) => {
            if (error) {
                logger.error(error.message, error);

                return res.status(BAD_REQUEST).json(response.body);
            }

            return res.status(OK).json(response.body);
        });
});

export default router;
