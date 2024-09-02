//const express = require('express') //   CommonJS
import express from "express";  //EMAscript
import usuariosRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'
import session from 'express-session';



//crear la app
const app = express()

app.use(session({
    secret: 'tu_secreto_aqui',  
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
}));

// Habilitar lectura de datos de formulario
app.use( express.urlencoded({extended:true}) ) /*se habilita la entrada de datos de un formulario*/

//conexion a la base de datos

try {
    await db.authenticate();
    db.sync() /* crea la tabla de usuarios si no existe */
    console.log('conexion a la base de datos');
} catch (error) {
    console.log (error)
}

//habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

//carpeta publica
app.use(express.static('public') )


//Routin 
//app.get('/', usuariosRoutes) //.get busca esa ruta en especifica,exacta ('/')
//app.use('/', usuariosRoutes) //.use busca todas las rutas que inicien en ('/')
app.use('/auth', usuariosRoutes)

//definir un puerto y arrancar el proyecto
const port = 3300

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})