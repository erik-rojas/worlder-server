module.exports = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.user_id) {
            if (req.user.user_id.role === role) {
                console.log("Role accepted")
                return next();
            } else {
                res.sendError('Only ' + role + ' can perform this action !');
            }
        } else {
            res.sendError('Unauthorized user!');
        }
    }

}