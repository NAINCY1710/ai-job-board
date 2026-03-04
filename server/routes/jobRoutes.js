import express from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getJobApplicants, // add this
} from '../controllers/jobController.js';
import { protect, recruiterOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, recruiterOnly, createJob);
router.put('/:id', protect, recruiterOnly, updateJob);
router.delete('/:id', protect, recruiterOnly, deleteJob);
router.post('/:id/apply', protect, applyToJob);
router.get('/:id/applicants', protect, recruiterOnly, getJobApplicants); // add this

export default router;