"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Campaign.ts
const mongoose_1 = __importStar(require("mongoose"));
const campaignSchema = new mongoose_1.Schema({
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
            validator: function (value) {
                return value > this.fechaInicio;
            },
            message: 'La fecha de fin debe ser posterior a la fecha de inicio',
        },
    },
}, {
    timestamps: true,
});
campaignSchema.pre('save', function (next) {
    const now = new Date();
    if (this.fechaFin < now && this.estado !== 'finalizada') {
        this.estado = 'finalizada';
        this.habilitadaVotacion = false;
    }
    else if (this.fechaInicio <= now && this.fechaFin > now && this.habilitadaVotacion) {
        this.estado = 'activa';
    }
    next();
});
exports.default = mongoose_1.default.model('Campaign', campaignSchema);
