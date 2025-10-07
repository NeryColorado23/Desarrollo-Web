// src/models/Campaign.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  titulo: string;
  descripcion: string;
  cantidadVotosPorUsuario: number;
  estado: 'activa' | 'inactiva' | 'finalizada';
  habilitadaVotacion: boolean;
  fechaInicio: Date;
  fechaFin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    titulo: {
      type: String,
      required: [true, 'El título de la campaña es requerido'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción de la campaña es requerida'],
      trim: true,
    },
    cantidadVotosPorUsuario: {
      type: Number,
      required: [true, 'La cantidad de votos por usuario es requerida'],
      min: [1, 'Debe permitir al menos 1 voto por usuario'],
      default: 1,
    },
    estado: {
      type: String,
      enum: ['activa', 'inactiva', 'finalizada'],
      default: 'inactiva',
    },
    habilitadaVotacion: {
      type: Boolean,
      default: false,
    },
    fechaInicio: {
      type: Date,
      required: [true, 'La fecha de inicio es requerida'],
    },
    fechaFin: {
      type: Date,
      required: [true, 'La fecha de fin es requerida'],
      validate: {
        validator: function (this: ICampaign, value: Date) {
          return value > this.fechaInicio;
        },
        message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      },
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.pre('save', function (next) {
  const now = new Date();
  
  if (this.fechaFin < now && this.estado !== 'finalizada') {
    this.estado = 'finalizada';
    this.habilitadaVotacion = false;
  } else if (this.fechaInicio <= now && this.fechaFin > now && this.habilitadaVotacion) {
    this.estado = 'activa';
  }
  
  next();
});

export default mongoose.model<ICampaign>('Campaign', campaignSchema);