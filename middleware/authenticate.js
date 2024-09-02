export const authenticate = (req, res, next) => {
    if (req.session && req.session.userId) {
        req.userId = req.session.userId;
        return next();
    } else {
        return res.redirect('/login'); // Redirige a la página de login si no está autenticado
    }
};