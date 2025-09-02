export const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admin can perform this action' });
    }
    next();
};
