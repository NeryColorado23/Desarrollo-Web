// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  numeroColegiado: string;
  nombreCompleto: string;
  correoElectronico: string;
  dpi: string;
  fechaNacimiento: Date;
  contraseña: string;
  rol: 'votante' | 'admin';
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    numeroColegiado: {
      type: String,
      required: [true, 'El número de colegiado es requerido'],
      unique: true,
      trim: true,
    },
    nombreCompleto: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
    },
    correoElectronico: {
      type: String,
      required: [true, 'El correo electrónico es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo válido'],
    },
    dpi: {
      type: String,
      required: [true, 'El DPI es requerido'],
      unique: true,
      trim: true,
      minlength: [13, 'El DPI debe tener 13 dígitos'],
      maxlength: [13, 'El DPI debe tener 13 dígitos'],
    },
    fechaNacimiento: {
      type: Date,
      required: [true, 'La fecha de nacimiento es requerida'],
    },
    contraseña: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    rol: {
      type: String,
      enum: ['votante', 'admin'],
      default: 'votante',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.contraseña);
};

export default mongoose.model<IUser>('User', userSchema);