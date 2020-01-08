module.exports = (req, res, next) => {
    res.sendData = (data = {}, code = res.CODE.GET_OK) => {
        res.status(code).json({
            success: true,
            data,
        })
    }

    res.sendError = (message = 'Bad Request', code = res.CODE.BAD_REQUEST, errors = []) => {
        res.status(+code).json({
            success: false,
            message,
            errors,
        })
    }

    next();
}