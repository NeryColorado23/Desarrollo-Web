"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVotingReport = exports.getAllVotes = exports.getAvailableVotes = exports.getMyVotes = exports.castVote = void 0;
const Vote_1 = __importDefault(require("../models/Vote"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
const Candidate_1 = __importDefault(require("../models/Candidate"));
// @desc    Emitir voto
// @route   POST /api/votes
// @access  Private
const castVote = async (req, res) => {
    try {
        const { campaignId, candidateId } = req.body;
        const userId = req.user._id;
        // Validar campos requeridos
        if (!campaignId || !candidateId) {
            res.status(400).json({
                success: false,
                message: 'campaignId y candidateId son requeridos',
            });
            return;
        }
        // Verificar que la campaña existe
        const campaign = await Campaign_1.default.findById(campaignId);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaña no encontrada',
            });
            return;
        }
        // Verificar que la campaña está habilitada para votación
        if (!campaign.habilitadaVotacion) {
            res.status(400).json({
                success: false,
                message: 'La votación no está habilitada para esta campaña',
            });
            return;
        }
        // Verificar que la campaña no ha expirado
        const now = new Date();
        if (campaign.fechaFin < now) {
            campaign.estado = 'finalizada';
            campaign.habilitadaVotacion = false;
            await campaign.save();
            res.status(400).json({
                success: false,
                message: 'El periodo de votación ha finalizado',
            });
            return;
        }
        // Verificar que el candidato existe y pertenece a la campaña
        const candidate = await Candidate_1.default.findOne({
            _id: candidateId,
            campaignId,
        });
        if (!candidate) {
            res.status(404).json({
                success: false,
                message: 'Candidato no encontrado en esta campaña',
            });
            return;
        }
        // Verificar cuántos votos ha emitido el usuario en esta campaña
        const userVotesInCampaign = await Vote_1.default.countDocuments({
            userId,
            campaignId,
        });
        if (userVotesInCampaign >= campaign.cantidadVotosPorUsuario) {
            res.status(400).json({
                success: false,
                message: `Ya has emitido el máximo de votos permitidos (${campaign.cantidadVotosPorUsuario}) en esta campaña`,
            });
            return;
        }
        // Verificar si ya votó por este candidato
        const existingVote = await Vote_1.default.findOne({
            userId,
            campaignId,
            candidateId,
        });
        if (existingVote) {
            res.status(400).json({
                success: false,
                message: 'Ya has votado por este candidato',
            });
            return;
        }
        // Registrar el voto
        const vote = await Vote_1.default.create({
            userId,
            campaignId,
            candidateId,
            fechaVoto: new Date(),
        });
        // Incrementar contador de votos del candidato
        candidate.votos += 1;
        await candidate.save();
        res.status(201).json({
            success: true,
            message: 'Voto registrado exitosamente',
            vote: {
                id: vote._id,
                campaignId: vote.campaignId,
                candidateId: vote.candidateId,
                fechaVoto: vote.fechaVoto,
            },
            votosRestantes: campaign.cantidadVotosPorUsuario - userVotesInCampaign - 1,
        });
    }
    catch (error) {
        console.error('Error al emitir voto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al emitir voto',
            error: error.message,
        });
    }
};
exports.castVote = castVote;
// @desc    Obtener votos del usuario
// @route   GET /api/votes/my-votes
// @access  Private
const getMyVotes = async (req, res) => {
    try {
        const userId = req.user._id;
        const votes = await Vote_1.default.find({ userId })
            .populate('campaignId', 'titulo descripcion')
            .populate('candidateId', 'nombre descripcion')
            .sort({ fechaVoto: -1 });
        res.status(200).json({
            success: true,
            count: votes.length,
            votes,
        });
    }
    catch (error) {
        console.error('Error al obtener votos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener votos',
            error: error.message,
        });
    }
};
exports.getMyVotes = getMyVotes;
// @desc    Verificar votos disponibles en campaña
// @route   GET /api/votes/available/:campaignId
// @access  Private
const getAvailableVotes = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const userId = req.user._id;
        const campaign = await Campaign_1.default.findById(campaignId);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaña no encontrada',
            });
            return;
        }
        const userVotesInCampaign = await Vote_1.default.countDocuments({
            userId,
            campaignId,
        });
        const votosDisponibles = campaign.cantidadVotosPorUsuario - userVotesInCampaign;
        res.status(200).json({
            success: true,
            campaignId,
            votosEmitidos: userVotesInCampaign,
            votosDisponibles,
            totalVotosPermitidos: campaign.cantidadVotosPorUsuario,
        });
    }
    catch (error) {
        console.error('Error al verificar votos disponibles:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar votos disponibles',
            error: error.message,
        });
    }
};
exports.getAvailableVotes = getAvailableVotes;
// @desc    Obtener todos los votos (Admin)
// @route   GET /api/votes/all
// @access  Private/Admin
const getAllVotes = async (req, res) => {
    try {
        const votes = await Vote_1.default.find()
            .populate('userId', 'nombreCompleto numeroColegiado')
            .populate('campaignId', 'titulo')
            .populate('candidateId', 'nombre')
            .sort({ fechaVoto: -1 });
        res.status(200).json({
            success: true,
            count: votes.length,
            votes,
        });
    }
    catch (error) {
        console.error('Error al obtener todos los votos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener todos los votos',
            error: error.message,
        });
    }
};
exports.getAllVotes = getAllVotes;
// @desc    Obtener reporte general de votaciones
// @route   GET /api/votes/report
// @access  Private/Admin
const getVotingReport = async (req, res) => {
    try {
        const campaigns = await Campaign_1.default.find();
        const totalVotes = await Vote_1.default.countDocuments();
        const campaignReports = await Promise.all(campaigns.map(async (campaign) => {
            const candidates = await Candidate_1.default.find({ campaignId: campaign._id });
            const campaignVotes = await Vote_1.default.countDocuments({ campaignId: campaign._id });
            const candidateStats = candidates.map((candidate) => ({
                nombre: candidate.nombre,
                votos: candidate.votos,
                porcentaje: campaignVotes > 0
                    ? ((candidate.votos / campaignVotes) * 100).toFixed(2)
                    : '0.00',
            }));
            return {
                campaignId: campaign._id,
                titulo: campaign.titulo,
                estado: campaign.estado,
                fechaInicio: campaign.fechaInicio,
                fechaFin: campaign.fechaFin,
                totalVotos: campaignVotes,
                candidatos: candidateStats,
            };
        }));
        res.status(200).json({
            success: true,
            totalVotosGeneral: totalVotes,
            totalCampañas: campaigns.length,
            campañas: campaignReports,
            fechaReporte: new Date(),
        });
    }
    catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar reporte',
            error: error.message,
        });
    }
};
exports.getVotingReport = getVotingReport;
