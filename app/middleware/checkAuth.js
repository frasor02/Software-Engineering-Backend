const jwt = require('jsonwebtoken');

// Autorizzazione
module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            error: 'No token provided'
        })
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
        if (err) {
            switch (err.name) {
                case 'TokenExpiredError': {
                    return res.status(403).json({
                        error: err.message // 'jwt expired'
                    });
                    break;
                }
                case 'JsonWebTokenError': {
                    return res.status(403).json({
                        error: err.message
                    });
                }
                case 'NotBeforeError': {
                    return res.status(403).json({
                        error: err.message // 'jwt not active'
                    })
                }
                default: {
                    return res.status(403).json({
                        error: 'Autenticazione token fallita'
                    });
                    break;
                }
            }
        }
        next();
    });
};