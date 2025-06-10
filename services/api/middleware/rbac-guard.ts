import { Request, Response, NextFunction } from 'express';

import { Permission } from '../auth/group-permissions';
import { getUserPermissions } from '../../../libs/db/models/user';

export function rbacGuard(required: Permission) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any)?.sub;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const perms = await getUserPermissions(userId);
      if (!perms.includes(required)) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      next();
    } catch (err) {
      res.status(500).json({ error: 'RBAC check failed' });
    }
  };
}
