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

import { protectRoute, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();


// All users (admin + caller) can read
router.get('/', protectRoute, getAllHRContacts);
router.get('/:id', protectRoute, getHRContactById);


// Only admin or caller can create HR contact
router.post('/', protectRoute, authorizeRoles('admin', 'moderator', 'caller'), createHRContact);

// Only admin can update (including assigning HR)
router.put('/:id', protectRoute, authorizeRoles('admin', 'moderator', 'caller'), updateHRContact);

router.patch('/:id/assign', protectRoute, authorizeRoles('admin', 'moderator'), assignCallerToHR);

// Only admin can delete
router.delete('/:id', protectRoute, authorizeRoles('admin'), deleteHRContact);

router.post('/:id/request-deletion', protectRoute, authorizeRoles('admin', 'moderator', 'caller'), requestHRDeletion);

// Only admin can export CSV
router.get('/export/csv', protectRoute, authorizeRoles('admin', 'moderator'), exportHRContactsCSV);


//Assign HR in Bulk
router.post("/assign/:callerId", protectRoute, authorizeRoles("admin", "moderator"), assignHRsToCaller);

// Unassign HR in Bulk
router.post("/unassign", protectRoute, authorizeRoles("admin", "moderator"), unassignHRs);

//Toggle the Approval of the HR
router.put("/:id/toggle-approval", protectRoute, authorizeRoles("admin", "moderator"), toggleApproval);


export default router;
