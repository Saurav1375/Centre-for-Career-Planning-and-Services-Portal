import express from 'express';
import {
  createHRContact,
  getAllHRContacts,
  getHRContactById,
  updateHRContact,
  deleteHRContact,
  assignCallerToHR,
  exportHRContactsCSV,
  assignHRsToCaller,
  unassignHRs,
  toggleApproval,
  requestHRDeletion
} from '../controllers/hrContact.controller.js';

import { protectRoute, trackActivity, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();


// All users (admin + caller) can read
router.get('/', protectRoute, trackActivity, getAllHRContacts);
router.get('/:id', protectRoute, trackActivity, getHRContactById);


// Only admin or caller can create HR contact
router.post('/', protectRoute, trackActivity, authorizeRoles('admin', 'moderator', 'caller'), createHRContact);

// Only admin can update (including assigning HR)
router.put('/:id', protectRoute, trackActivity, authorizeRoles('admin', 'moderator', 'caller'), updateHRContact);

router.patch('/:id/assign', protectRoute, trackActivity, authorizeRoles('admin', 'moderator'), assignCallerToHR);

// Only admin can delete
router.delete('/:id', protectRoute, trackActivity, authorizeRoles('admin'), deleteHRContact);

router.post('/:id/request-deletion', protectRoute, trackActivity, authorizeRoles('admin', 'moderator', 'caller'), requestHRDeletion);

// Only admin can export CSV
router.get('/export/csv', protectRoute, trackActivity, authorizeRoles('admin', 'moderator'), exportHRContactsCSV);


//Assign HR in Bulk
router.post("/assign/:callerId", protectRoute, trackActivity, authorizeRoles("admin", "moderator"), assignHRsToCaller);

// Unassign HR in Bulk
router.post("/unassign", protectRoute, trackActivity, authorizeRoles("admin", "moderator"), unassignHRs);

//Toggle the Approval of the HR
router.put("/:id/toggle-approval", protectRoute, trackActivity, authorizeRoles("admin", "moderator"), toggleApproval);


export default router;
