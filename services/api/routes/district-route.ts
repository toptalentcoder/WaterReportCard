import express from 'express'
import { authGuard } from '../../../libs/shared/iam/middleware/authGuard'
import { Permission } from '../../../libs/shared/iam/enums/permissions'
import { getDistricts } from '../controllers/district-controller'

const router = express.Router()

router.get('/', authGuard(Permission.ViewDistricts), getDistricts)

export default router;
