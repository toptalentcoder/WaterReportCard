import express from 'express';
import { getVersion } from '../health/version';
import { getStatus } from '../health/status';
import { getHealth } from '../health/health';


const router = express.Router();

router.get('/version', getVersion);
router.get('/status', getStatus);
router.get('/health', getHealth);

export default router;
