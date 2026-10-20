const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user info to request
            // We use simple object { id, role } to minimize DB calls in middleware
            // unless we really need full user object. Prompt says "Attach req.user = { id, role }"
            req.user = {
                id: decoded.userId, // JWT payload usually has userId
                role: decoded.role
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = authMiddleware;
