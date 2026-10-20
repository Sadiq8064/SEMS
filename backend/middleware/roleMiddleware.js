const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Role '${req.user ? req.user.role : 'unknown'}' is not authorized.`
            });
        }
        next();
    };
};

module.exports = roleMiddleware;
