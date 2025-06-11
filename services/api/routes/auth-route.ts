import express from 'express';
import { RequestHandler } from 'express';
import { signup, signin, confirmSignup } from '../controllers/auth-controller';

const router = express.Router();

router.post('/signup', signup as RequestHandler);
router.post('/signin', signin as RequestHandler);
router.post('/confirm', confirmSignup as RequestHandler);

export default router;
