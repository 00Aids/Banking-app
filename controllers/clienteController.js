import Usuario from '../models/Usuario.js';
import Transaccion from '../models/Transaccion.js';

export const formularioRetiro = async (req, res) => {
    const userId = req.session.userId;
    try {
        const usuario = await Usuario.findByPk(userId);
        res.render('auth/retiro', { 
            pagina: 'Retiro',
            dinero: usuario.dinero
        });
    } catch (error) {
        res.status(500).render('auth/retiro', { 
            pagina: 'Retiro', 
            error: 'Error al cargar la información del usuario.' 
        });
    }
};

export const formularioDeposito = async (req, res) => {
    const userId = req.session.userId;
    try {
        const usuario = await Usuario.findByPk(userId);
        res.render('auth/deposito', { 
            pagina: 'Deposito',
            dinero: usuario.dinero
        });
    } catch (error) {
        res.status(500).render('auth/deposito', { 
            pagina: 'Deposito', 
            error: 'Error al cargar la información del usuario.' 
        });
    }
};

export const realizarRetiro = async (req, res) => {
    const { cantidad } = req.body;
    const userId = req.session.userId;

    try {
        const usuario = await Usuario.findByPk(userId);

        if (usuario.dinero >= cantidad) {
            usuario.dinero -= cantidad;
            await usuario.save();
            res.render('auth/retiro', { 
                pagina: 'Retiro', 
                dinero: usuario.dinero, 
                success: 'Retiro realizado con éxito.' 
            });
        } else {
            res.render('auth/retiro', { 
                pagina: 'Retiro', 
                dinero: usuario.dinero, 
                error: 'Fondos insuficientes para realizar el retiro.' 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/retiro', { 
            pagina: 'Retiro', 
            error: 'Error al procesar la solicitud de retiro.' 
        });
    }
};

export const realizarDeposito = async (req, res) => {
    const { cantidad } = req.body;
    const userId = req.session.userId;

    try {
        const usuario = await Usuario.findByPk(userId);

        if (cantidad > 0) {  // Verifica que la cantidad sea positiva
            usuario.dinero += parseFloat(cantidad);
            await usuario.save();
            res.render('auth/deposito', { 
                pagina: 'Deposito', 
                dinero: usuario.dinero, 
                success: 'Deposito realizado con éxito.' 
            });
        } else {
            res.render('auth/deposito', { 
                pagina: 'Deposito', 
                dinero: usuario.dinero, 
                error: 'Cantidad inválida para realizar el depósito.' 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/deposito', { 
            pagina: 'Deposito', 
            error: 'Error al procesar la solicitud de deposito.' 
        });
    }
};

export const listarTransferencias = async (req, res) => {
    const userId = req.session.userId;
    try {
        const usuario = await Usuario.findByPk(userId);
        const transferencias = await Transaccion.findAll({ where: { envia: usuario.cuenta } });

        res.render('auth/inicioCliente', { 
            pagina: 'Inicio Cliente',
            cuenta: usuario.cuenta,
            transferencias
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/inicioCliente', { 
            pagina: 'Inicio Cliente', 
            error: 'Error al cargar las transferencias.' 
        });
    }
};

export const listarTodasTransferencias = async (req, res) => {
    try {
        const transferencias = await Transaccion.findAll();

        res.render('auth/inicioAdmin', { 
            pagina: 'Inicio Admin',
            transferencias
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/inicioAdmin', { 
            pagina: 'Inicio Admin', 
            error: 'Error al cargar las transferencias.' 
        });
    }
};