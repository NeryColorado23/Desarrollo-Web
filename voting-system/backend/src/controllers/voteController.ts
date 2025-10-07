// src/controllers/voteController.ts
import { Request, Response } from 'express';
import Vote from '../models/Vote';
import Campaign from '../models/Campaign';
import Candidate from '../models/Candidate';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Emitir voto
// @route   POST /api/votes
// @access  Private
export const castVote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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
    const campaign = await Campaign.findById(campaignId);

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
    const candidate = await Candidate.findOne({
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
    const userVotesInCampaign = await Vote.countDocuments({
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
    const existingVote = await Vote.findOne({
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
    const vote = await Vote.create({
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
  } catch (error: any) {
    console.error('Error al emitir voto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al emitir voto',
      error: error.message,
    });
  }
};

// @desc    Obtener votos del usuario
// @route   GET /api/votes/my-votes
// @access  Private
export const getMyVotes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id;

    const votes = await Vote.find({ userId })
      .populate('campaignId', 'titulo descripcion')
      .populate('candidateId', 'nombre descripcion')
      .sort({ fechaVoto: -1 });

    res.status(200).json({
      success: true,
      count: votes.length,
      votes,
    });
  } catch (error: any) {
    console.error('Error al obtener votos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener votos',
      error: error.message,
    });
  }
};

// @desc    Verificar votos disponibles en campaña
// @route   GET /api/votes/available/:campaignId
// @access  Private
export const getAvailableVotes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const userId = req.user._id;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: 'Campaña no encontrada',
      });
      return;
    }

    const userVotesInCampaign = await Vote.countDocuments({
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
  } catch (error: any) {
    console.error('Error al verificar votos disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar votos disponibles',
      error: error.message,
    });
  }
};

// @desc    Obtener todos los votos (Admin)
// @route   GET /api/votes/all
// @access  Private/Admin
export const getAllVotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const votes = await Vote.find()
      .populate('userId', 'nombreCompleto numeroColegiado')
      .populate('campaignId', 'titulo')
      .populate('candidateId', 'nombre')
      .sort({ fechaVoto: -1 });

    res.status(200).json({
      success: true,
      count: votes.length,
      votes,
    });
  } catch (error: any) {
    console.error('Error al obtener todos los votos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener todos los votos',
      error: error.message,
    });
  }
};

// @desc    Obtener reporte general de votaciones
// @route   GET /api/votes/report
// @access  Private/Admin
export const getVotingReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campaigns = await Campaign.find();
    const totalVotes = await Vote.countDocuments();

    const campaignReports = await Promise.all(
      campaigns.map(async (campaign) => {
        const candidates = await Candidate.find({ campaignId: campaign._id });
        const campaignVotes = await Vote.countDocuments({ campaignId: campaign._id });
        
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
      })
    );

    res.status(200).json({
      success: true,
      totalVotosGeneral: totalVotes,
      totalCampañas: campaigns.length,
      campañas: campaignReports,
      fechaReporte: new Date(),
    });
  } catch (error: any) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte',
      error: error.message,
    });
  }
};