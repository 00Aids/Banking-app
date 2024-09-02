import express from "express";
import { formularioLogin, formularioRegistro, registrar, formularioRecuperarContrasena, login } from "../controllers/usuarioController.js";
import { formularioRetiro, formularioDeposito, realizarRetiro, realizarDeposito, listarTransferencias, listarTodasTransferencias } from '../controllers/clienteController.js';
import { formularioTransferencia, realizarTransferencia } from '../controllers/transaccionController.js';

const router = express.Router();

// Rutas de autenticación
router.get('/login', formularioLogin);
router.post('/login', login);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/recuperar-contrasena', formularioRecuperarContrasena);

// Rutas de panel
router.get('/inicioAdmin', listarTodasTransferencias); // Cambia esta línea para incluir la nueva funcionalidad
router.get('/inicioCliente', listarTransferencias);

// Rutas de cliente
router.get('/retiro', formularioRetiro);
router.post('/retiro', realizarRetiro);
router.get('/deposito', formularioDeposito);
router.post('/deposito', realizarDeposito);

// Rutas de transacción
router.get('/transferencia', formularioTransferencia); // Muestra el formulario de transferencia
router.post('/transferencia', realizarTransferencia); // Procesa la transferencia

export default router;