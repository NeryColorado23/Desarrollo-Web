import express from 'express';
import {
  castVote,
  getMyVotes,
  getAvailableVotes,
  getAllVotes,
  getVotingReport,
} from '../controllers/voteController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, castVote);
router.get('/my-votes', protect, getMyVotes);
router.get('/available/:campaignId', protect, getAvailableVotes);
router.get('/all', protect, admin, getAllVotes);
router.get('/report', protect, admin, getVotingReport);

export default router;
