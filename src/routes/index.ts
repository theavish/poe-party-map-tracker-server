import { Router } from 'express';
import ApiRouter from './Api';
import cors from 'cors';
import { corsOptions } from '../config/cors';

// Init router and path
const router = Router();
router.options("*", cors(corsOptions));

// Add sub-routes
router.use('/api', ApiRouter);

// Export the base-router
export default router;
