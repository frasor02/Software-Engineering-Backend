const jwt = require('jsonwebtoken');

// Autorizzazione
module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            error: 'No token provided'
        })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (error){
        return res.status(403).json({
            error: 'Autenticazione token fallita'
        });
    }
};