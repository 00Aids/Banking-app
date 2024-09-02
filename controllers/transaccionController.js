import Usuario from '../models/Usuario.js';
import Transaccion from '../models/Transaccion.js';

export const formularioTransferencia = async (req, res) => {
    const userId = req.session.userId;
    try {
        const usuario = await Usuario.findByPk(userId);
        res.render('auth/transferencia', { 
            pagina: 'Transferencia',
            dinero: usuario.dinero 
        });
    } catch (error) {
        res.status(500).render('auth/transferencia', { 
            pagina: 'Transferencia', 
            error: 'Error al cargar la información del usuario.' 
        });
    }
};

export const realizarTransferencia = async (req, res) => {
    const { cuentaDestino, cantidad } = req.body;
    const userId = req.session.userId;

    try {
        const usuarioOrigen = await Usuario.findByPk(userId);
        const usuarioDestino = await Usuario.findOne({ where: { cuenta: cuentaDestino } });

        if (usuarioDestino && usuarioOrigen.dinero >= parseFloat(cantidad)) {
            // Actualizar saldos de cuentas
            usuarioOrigen.dinero -= parseFloat(cantidad);
            usuarioDestino.dinero += parseFloat(cantidad);

            await usuarioOrigen.save();
            await usuarioDestino.save();

            // Registrar transacción
            await Transaccion.create({
                envia: usuarioOrigen.cuenta,
                recibe: usuarioDestino.cuenta,
                dinero: parseFloat(cantidad)
            });

            res.render('auth/transferencia', { 
                pagina: 'Transferencia', 
                dinero: usuarioOrigen.dinero, 
                success: 'Transferencia realizada con éxito.' 
            });
        } else {
            res.render('auth/transferencia', { 
                pagina: 'Transferencia', 
                dinero: usuarioOrigen.dinero, 
                error: 'Fondos insuficientes o cuenta destino no válida.' 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/transferencia', { 
            pagina: 'Transferencia', 
            error: 'Error al procesar la solicitud de transferencia.' 
        });
    }
};