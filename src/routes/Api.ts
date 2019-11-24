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
        .then(response => res.status(OK).json(response.body),
              error => genericHandleError(error, res));
});

router.post('/trade-search', async (req: Request, res: Response) => {
    const {
        league,
    } = req.query;

    const url = POST_TRADE_SEARCH
        .replace('{league}', league);

    superagent.post(url)
        .send(req.body)
        .then(response => res.status(OK).json(response.body),
              error => genericHandleError(error, res));
});

router.get('/trade-fetch', async (req: Request, res: Response) => {
    const {
        items,
        query,
    } = req.query;
    const itemsList = items.split(',');
    const fetchApiItemCountLimit = 10; // this comes from their api
    const responseCollection: Array<object> = [];

    console.log('number of items: ', itemsList.length)

    for (let i = 0; i < itemsList.length; i += fetchApiItemCountLimit) {
        const batchItems = itemsList.slice(i, i + fetchApiItemCountLimit);

        const url = GET_TRADE_FETCH
            .replace('{items}', batchItems.toString());

        await superagent.get(url)
            .query(query)
            .then(response => responseCollection.push(...response.body.result),
                  error => genericHandleError(error, res));
    }

    return res.status(OK).json({ result: responseCollection });
});

const genericHandleError = (error: Error, res: Response) =>
    logger.error(error.message, error) || res.status(BAD_REQUEST).json(error.message);

export default router;
