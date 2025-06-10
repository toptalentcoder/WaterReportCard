import express from 'express';
import { verifyCognitoToken } from '../auth/verify-cognito-token';
import { rbacGuard } from '../middleware/rbac-guard';
import { Permission } from '../auth/group-permissions';

const router = express.Router();

router.get('/', verifyCognitoToken, rbacGuard(Permission.ViewDistricts), (req, res) => {
  res.json([{ id: 1, name: 'North Valley', region: 'West' }]);
});

export default router;
