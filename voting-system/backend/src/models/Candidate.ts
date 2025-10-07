// src/models/Candidate.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  nombre: string;
  descripcion: string;
  fotoUrl?: string;
  campaignId: mongoose.Types.ObjectId;
  votos: number;
  createdAt: Date;
  updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del candidato es requerido'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción del candidato es requerida'],
      trim: true,
    },
    fotoUrl: {
      type: String,
      default: '',
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    votos: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICandidate>('Candidate', candidateSchema);