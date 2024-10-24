import { Router } from 'express';
import {
  contactUs,
  userStats,
} from '../controller/miscellaneous_controller.js';
import { authorizedRoles, isLoggedIn } from '../middleware/auth_middleware.js';

const router = Router();

// {{URL}}/api/v1/
router.route('/contact').post(contactUs);
router
  .route('/admin/stats/users')
  .get(isLoggedIn, authorizedRoles('ADMIN'), userStats);

export default router;