const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (jwt.decode(token, process.env.JWT_KEY)._type != 'UtenteAdmin') {
        return res.status(403).json({
            error: 'Richiesta non permessa'
        });
    }
    next();
};