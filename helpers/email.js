import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
      });

      const { email, nombre, token} = datos

      //enviar el email
      await transport.sendMail({
        from: 'BienesCatises.com',
        to: email,
        subject: 'confirma tu cuenta en bienesCatises',
        text: 'confirma tu cuenta en bienesCatises',
        html: `
            <p> hola ${nombre}, comprueba tu cuenta en BienesCatises </p>

            <p> Tu cuenta ya esta lista, solo debes confirmar en el siguiente enlace: 
            <a href="">Confirmar cuenta</a> </p>
            
            <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje </p>
        `
      })

}

export{
    emailRegistro
}