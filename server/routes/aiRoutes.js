import express from 'express';
import { 
  analyzeResume, 
  getJobRecommendations,
  generateJobDescription 
} from '../controllers/aiController.js';
import { protect, recruiterOnly } from '../middleware/authMiddleware.js';
import { generateCoverLetter } from '../controllers/aiController.js'

const router = express.Router();

router.post('/analyze-resume', protect, analyzeResume);
router.get('/recommendations', protect, getJobRecommendations);
router.post('/generate-description', protect, recruiterOnly, generateJobDescription);
router.post('/generate-cover-letter', protect, generateCoverLetter)

export default router;