const User = require('../models/User');

const userController = {
    // Obtener todos los usuarios (protegido)
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password');
            
            res.json({
                success: true,
                message: 'Usuarios obtenidos exitosamente.',
                data: {
                    users,
                    count: users.length
                }
            });

        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error del servidor al obtener usuarios.'
            });
        }
    },

    // Actualizar usuario por ID (protegido)
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email } = req.body;

            // Validar que el usuario existe
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado.'
                });
            }

            // Actualizar usuario
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { name, email },
                { new: true, runValidators: true }
            ).select('-password');

            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente.',
                data: {
                    user: updatedUser
                }
            });

        } catch (error) {
            console.error('Error actualizando usuario:', error);
            
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido.'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error del servidor al actualizar usuario.'
            });
        }
    },

    // Eliminar usuario por ID (protegido)
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            // Validar que el usuario existe
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado.'
                });
            }

            // Eliminar usuario
            await User.findByIdAndDelete(id);

            res.json({
                success: true,
                message: 'Usuario eliminado exitosamente.'
            });

        } catch (error) {
            console.error('Error eliminando usuario:', error);
            
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido.'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error del servidor al eliminar usuario.'
            });
        }
    }
};

module.exports = userController;