"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voteController_1 = require("../controllers/voteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, voteController_1.castVote);
router.get('/my-votes', authMiddleware_1.protect, voteController_1.getMyVotes);
router.get('/available/:campaignId', authMiddleware_1.protect, voteController_1.getAvailableVotes);
router.get('/all', authMiddleware_1.protect, authMiddleware_1.admin, voteController_1.getAllVotes);
router.get('/report', authMiddleware_1.protect, authMiddleware_1.admin, voteController_1.getVotingReport);
exports.default = router;
