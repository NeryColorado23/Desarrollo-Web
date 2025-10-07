import express from 'express';
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  toggleVoting,
  deleteCampaign,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getCampaignStats,
} from '../controllers/campaignController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.get('/:id/stats', getCampaignStats);

router.post('/', protect, admin, createCampaign);
router.put('/:id', protect, admin, updateCampaign);
router.patch('/:id/toggle-voting', protect, admin, toggleVoting);
router.delete('/:id', protect, admin, deleteCampaign);

router.post('/:id/candidates', protect, admin, addCandidate);
router.put('/:campaignId/candidates/:candidateId', protect, admin, updateCandidate);
router.delete('/:campaignId/candidates/:candidateId', protect, admin, deleteCandidate);

export default router;
