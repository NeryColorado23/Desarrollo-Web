// src/models/Vote.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  userId: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  fechaVoto: Date;
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    fechaVoto: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

voteSchema.index({ userId: 1, campaignId: 1, candidateId: 1 });

export default mongoose.model<IVote>('Vote', voteSchema);