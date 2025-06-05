import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt'
import { hasPermission } from '../services/rbac'
import { Permission } from '../enums/permissions'

declare global {
  namespace Express {
    interface Request {
      user?: any  // Or your User type
    }
  }
}

export function authGuard(required: Permission) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    try {
      const user = verifyJwt(token)
      const allowed = await hasPermission(user.sub, required)
      if (!allowed) {
        res.status(403).json({ error: 'Forbidden' })
        return
      }

      req.user = user
      next()
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' })
    }
  }
}
