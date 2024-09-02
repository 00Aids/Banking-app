import { check, validationResult } from 'express-validator';
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { generarNumeroCuenta } from "../helpers/numCuenta.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {  //.render es una funcion que se va a encargar de mostrar una vista
        pagina: 'Iniciar Sesion'
    });
};

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {  //.render es una funcion que se va a encargar de mostrar una vista
        pagina: 'Crear cuenta'
    });
};

const registrar = async (req, res) => {
    // Validación
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('El campo email debe que contener un email').run(req);
    await check('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe ser al menos de 6 caracteres').equals(req.body.repetir_contrasena).withMessage('Las contraseñas no son iguales').run(req);
    await check('identificacion').notEmpty().withMessage('La identificacion es obligatoria').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    // Extraer los datos
    const { nombre, email, contrasena, identificacion, rol } = req.body;

    // Verificar que el usuario no esté duplicado
    const existe_usuario = await Usuario.findOne({ where: { email } });
    const existe_usuario2 = await Usuario.findOne({ where: { identificacion } });

    if (existe_usuario) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{ msg: 'Ese correo ya se encuentra registrado' }],
            usuario: { nombre: req.body.nombre }
        });
    }

    if (existe_usuario2) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{ msg: 'Esa identificacion ya se encuentra registrada' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    // Almacenar usuario (sin encriptar contraseña)
    const usuarioData = {
        nombre,
        email,
        contrasena, // Almacena la contraseña tal cual
        identificacion,
        rol,
        cuenta: generarNumeroCuenta(),
        token: generarId()
    };

    if (rol === 'cliente') {
        usuarioData.dinero = 1000000;
    }

    const usuario = await Usuario.create(usuarioData);

    res.redirect('/auth/login');
};



const login = async (req, res) => {
    console.log("Ingreso al login");

    await check('email').isEmail().withMessage('El campo email debe contener un email').run(req);
    await check('contrasena').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            errores: resultado.array()
        });
    }

    const { email, contrasena } = req.body;

    console.log("email y contraseña", email, contrasena);

    let usuario; // Asegúrate de definir la variable usuario

    try {
        usuario = await Usuario.findOne({ where: { email } });
        console.log("Después de buscar usuario", usuario);
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{ msg: 'Hubo un error al verificar el usuario' }]
        });
    }

    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{ msg: 'El usuario no existe' }]
        });
    }

    // Verificar la contraseña sin encriptar
    if (contrasena !== usuario.contrasena) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{ msg: 'Contraseña incorrecta' }]
        });
    }

    console.log("Contraseña ingresada", contrasena, "Contraseña de la bd", usuario.contrasena);

    // Autenticación exitosa
    req.session.userId = usuario.id; // Almacena el ID del usuario en la sesión

    if (usuario.rol === 'administrador') {
        return res.redirect('/auth/inicioAdmin');
    } else {
        return res.redirect('/auth/inicioCliente');
    }
};

const formularioRecuperarContrasena = (req, res) => {
    res.render('auth/recuperar-contrasena', {  //.render es una función que se va a encargar de mostrar una vista
        pagina: 'Recuperar Contraseña'
    });
};

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioRecuperarContrasena,
    login
};