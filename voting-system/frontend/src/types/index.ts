// src/types/index.ts

export interface User {
  id: string;
  numeroColegiado: string;
  nombreCompleto: string;
  correoElectronico: string;
  dpi: string;
  fechaNacimiento?: string;
  rol: 'votante' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

export interface Campaign {
  _id: string;
  titulo: string;
  descripcion: string;
  cantidadVotosPorUsuario: number;
  estado: 'activa' | 'inactiva' | 'finalizada';
  habilitadaVotacion: boolean;
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  _id: string;
  nombre: string;
  descripcion: string;
  fotoUrl?: string;
  campaignId: string;
  votos: number;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  _id: string;
  userId: string;
  campaignId: string;
  candidateId: string;
  fechaVoto: string;
}

export interface CampaignStats {
  candidateId: string;
  nombre: string;
  votos: number;
  porcentaje: string;
}

export interface VoteAvailability {
  campaignId: string;
  votosEmitidos: number;
  votosDisponibles: number;
  totalVotosPermitidos: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginCredentials {
  numeroColegiado: string;
  dpi: string;
  fechaNacimiento: string;
  contraseña: string;
}

export interface RegisterData {
  numeroColegiado: string;
  nombreCompleto: string;
  correoElectronico: string;
  dpi: string;
  fechaNacimiento: string;
  contraseña: string;
}

export interface CampaignFormData {
  titulo: string;
  descripcion: string;
  cantidadVotosPorUsuario: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface CandidateFormData {
  nombre: string;
  descripcion: string;
  fotoUrl?: string;
}