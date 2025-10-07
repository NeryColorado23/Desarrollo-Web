"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampaignStats = exports.deleteCandidate = exports.updateCandidate = exports.addCandidate = exports.deleteCampaign = exports.toggleVoting = exports.updateCampaign = exports.getCampaignById = exports.getAllCampaigns = exports.createCampaign = void 0;
const Campaign_1 = __importDefault(require("../models/Campaign"));
const Candidate_1 = __importDefault(require("../models/Candidate"));
const Vote_1 = __importDefault(require("../models/Vote"));
// @desc    Crear nueva campaña
// @route   POST /api/campaigns
// @access  Private/Admin
const createCampaign = async (req, res) => {
    try {
        const { titulo, descripcion, cantidadVotosPorUsuario, fechaInicio, fechaFin, } = req.body;
        // Validar campos requeridos
        if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos',
            });
            return;
        }
        // Validar fechas
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
        if (endDate <= startDate) {
            res.status(400).json({
                success: false,
                message: 'La fecha de fin debe ser posterior a la fecha de inicio',
            });
            return;
        }
        // Crear campaña
        const campaign = await Campaign_1.default.create({
            titulo,
            descripcion,
            cantidadVotosPorUsuario: cantidadVotosPorUsuario || 1,
            fechaInicio: startDate,
            fechaFin: endDate,
            estado: 'inactiva',
            habilitadaVotacion: false,
        });
        res.status(201).json({
            success: true,
            message: 'Campaña creada exitosamente',
            campaign,
        });
    }
    catch (error) {
        console.error('Error al crear campaña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear campaña',
            error: error.message,
        });
    }
};
exports.createCampaign = createCampaign;
// @desc    Obtener todas las campañas
// @route   GET /api/campaigns
// @access  Public
const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign_1.default.find().sort({ createdAt: -1 });
        // Actualizar estados de campañas basado en fechas
        const now = new Date();
        for (const campaign of campaigns) {
            if (campaign.fechaFin < now && campaign.estado !== 'finalizada') {
                campaign.estado = 'finalizada';
                campaign.habilitadaVotacion = false;
                await campaign.save();
            }
        }
        res.status(200).json({
            success: true,
            count: campaigns.length,
            campaigns,
        });
    }
    catch (error) {
        console.error('Error al obtener campañas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener campañas',
            error: error.message,
        });
    }
};
exports.getAllCampaigns = getAllCampaigns;
// @desc    Obtener campaña por ID con candidatos
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaña no encontrada',
            });
            return;
        }
        // Obtener candidatos de la campaña
        const candidates = await Candidate_1.default.find({ campaignId: campaign._id });
        // Verificar si la campaña ha expirado
        const now = new Date();
        if (campaign.fechaFin < now && campaign.estado !== 'finalizada') {
            campaign.estado = 'finalizada';
            campaign.habilitadaVotacion = false;
            await campaign.save();
        }
        res.status(200).json({
            success: true,
            campaign,
            candidates,
        });
    }
    catch (error) {
        console.error('Error al obtener campaña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener campaña',
            error: error.message,
        });
    }
};
exports.getCampaignById = getCampaignById;
// @desc    Actualizar campaña
// @route   PUT /api/campaigns/:id
// @access  Private/Admin
const updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaña no encontrada',
            });
            return;
        }
        const { titulo, descripcion, cantidadVotosPorUsuario, fechaInicio, fechaFin, } = req.body;
        // Actualizar campos
        if (titulo)
            campaign.titulo = titulo;
        if (descripcion)
            campaign.descripcion = descripcion;
        if (cantidadVotosPorUsuario)
            campaign.cantidadVotosPorUsuario = cantidadVotosPorUsuario;
        if (fechaInicio)
            campaign.fechaInicio = new Date(fechaInicio);
        if (fechaFin)
            campaign.fechaFin = new Date(fechaFin);
        // Validar fechas
        if (campaign.fechaFin <= campaign.fechaInicio) {
            res.status(400).json({
                success: false,
                message: 'La fecha de fin debe ser posterior a la fecha de inicio',
            });
            return;
        }
        await campaign.save();
        res.status(200).json({
            success: true,
            message: 'Campaña actualizada exitosamente',
            campaign,
        });
    }
    catch (error) {
        console.error('Error al actualizar campaña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar campaña',
            error: error.message,
        });
    }
};
exports.updateCampaign = updateCampaign;
// @desc    Habilitar/Deshabilitar votación
// @route   PATCH /api/campaigns/:id/toggle-voting
// @access  Private/Admin
const toggleVoting = async (req, res) => {
    try {
        const campaign = await Campaign_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaña no encontrada',
            });
            return;
        }
        const now = new Date();
        // Verificar si la campaña ha expirado
        if (campaign.fechaFin < now) {
            res.status(400).json({
                success: false,
                message: 'No se puede habilitar una campaña que ya finalizó',
            });
            return;
        }
        // Alternar el estado de votación
        campaign.habilitadaVotacion = !campaign.habilitadaVotacion;
        campaign.estado = campaign.habilitadaVotacion ? 'activa' : 'inactiva';
        await campaign.save();
        res.status(200).json({
            success: true,
            message: `Votación ${campaign.habilitadaVotacion ? 'habilitada' : 'deshabilitada'} exitosamente`,
            campaign,
        });
    }
    catch (error) {
        console.error('Error al cambiar estado de votación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar estado de votación',
            error: error.message,
        });
    }
};
exports.toggleVoting = toggleVoting;
// @desc    Eliminar campaña
// @route   DELETE /api/campaigns/:id
// @access  Private/Admin
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaña no encontrada',
            });
            return;
        }
        // Eliminar candidatos asociados
        await Candidate_1.default.deleteMany({ campaignId: campaign._id });
        // Eliminar votos asociados
        await Vote_1.default.deleteMany({ campaignId: campaign._id });
        // Eliminar campaña
        await Campaign_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Campaña eliminada exitosamente',
        });
    }
    catch (error) {
        console.error('Error al eliminar campaña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar campaña',
            error: error.message,
        });
    }
};
exports.deleteCampaign = deleteCampaign;
// @desc    Agregar candidato a campaña
// @route   POST /api/campaigns/:id/candidates
// @access  Private/Admin
const addCandidate = async (req, res) => {
    try {
        const campaign = await Campaign_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaña no encontrada',
            });
            return;
        }
        const { nombre, descripcion, fotoUrl } = req.body;
        if (!nombre || !descripcion) {
            res.status(400).json({
                success: false,
                message: 'Nombre y descripción son requeridos',
            });
            return;
        }
        const candidate = await Candidate_1.default.create({
            nombre,
            descripcion,
            fotoUrl: fotoUrl || '',
            campaignId: campaign._id,
            votos: 0,
        });
        res.status(201).json({
            success: true,
            message: 'Candidato agregado exitosamente',
            candidate,
        });
    }
    catch (error) {
        console.error('Error al agregar candidato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar candidato',
            error: error.message,
        });
    }
};
exports.addCandidate = addCandidate;
// @desc    Actualizar candidato
// @route   PUT /api/campaigns/:campaignId/candidates/:candidateId
// @access  Private/Admin
const updateCandidate = async (req, res) => {
    try {
        const { campaignId, candidateId } = req.params;
        const candidate = await Candidate_1.default.findOne({
            _id: candidateId,
            campaignId,
        });
        if (!candidate) {
            res.status(404).json({
                success: false,
                message: 'Candidato no encontrado',
            });
            return;
        }
        const { nombre, descripcion, fotoUrl } = req.body;
        if (nombre)
            candidate.nombre = nombre;
        if (descripcion)
            candidate.descripcion = descripcion;
        if (fotoUrl !== undefined)
            candidate.fotoUrl = fotoUrl;
        await candidate.save();
        res.status(200).json({
            success: true,
            message: 'Candidato actualizado exitosamente',
            candidate,
        });
    }
    catch (error) {
        console.error('Error al actualizar candidato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar candidato',
            error: error.message,
        });
    }
};
exports.updateCandidate = updateCandidate;
// @desc    Eliminar candidato
// @route   DELETE /api/campaigns/:campaignId/candidates/:candidateId
// @access  Private/Admin
const deleteCandidate = async (req, res) => {
    try {
        const { campaignId, candidateId } = req.params;
        const candidate = await Candidate_1.default.findOne({
            _id: candidateId,
            campaignId,
        });
        if (!candidate) {
            res.status(404).json({
                success: false,
                message: 'Candidato no encontrado',
            });
            return;
        }
        // Eliminar votos del candidato
        await Vote_1.default.deleteMany({ candidateId: candidate._id });
        await Candidate_1.default.findByIdAndDelete(candidateId);
        res.status(200).json({
            success: true,
            message: 'Candidato eliminado exitosamente',
        });
    }
    catch (error) {
        console.error('Error al eliminar candidato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar candidato',
            error: error.message,
        });
    }
};
exports.deleteCandidate = deleteCandidate;
// @desc    Obtener estadísticas de campaña
// @route   GET /api/campaigns/:id/stats
// @access  Public
const getCampaignStats = async (req, res) => {
    try {
        const campaign = await Campaign_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaña no encontrada',
            });
            return;
        }
        const candidates = await Candidate_1.default.find({ campaignId: campaign._id });
        const totalVotes = await Vote_1.default.countDocuments({ campaignId: campaign._id });
        const candidateStats = candidates.map((candidate) => ({
            candidateId: candidate._id,
            nombre: candidate.nombre,
            votos: candidate.votos,
            porcentaje: totalVotes > 0 ? ((candidate.votos / totalVotes) * 100).toFixed(2) : '0.00',
        }));
        res.status(200).json({
            success: true,
            campaign: {
                id: campaign._id,
                titulo: campaign.titulo,
                estado: campaign.estado,
                totalVotos: totalVotes,
            },
            candidateStats,
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message,
        });
    }
};
exports.getCampaignStats = getCampaignStats;
