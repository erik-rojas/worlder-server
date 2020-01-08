const { userService } = require("../../services");

const getAllUsers = (req, res) => {
    userService.getAllUsers()
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendData(err.message);
        })
}

const getUser = (req, res) => {
    let id = req.user.user_id._id;
    userService.getUser(id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendData(err.message, res.CODE.BAD_REQUEST);
        })
}

const updateUser = (req, res) => {
    let id = req.user.user_id._id;
    userService.updateUser(id, {
        ...req.body,
        files: req.files
    })
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const changePassword = (req, res) => {
    let id = req.user.user_id._id;
    let oldPass = req.body.old_pass;
    let newPass = req.body.new_pass;
    let newPassRetype = req.body.new_pass_retype;

    userService.changePassword(id, oldPass, newPass, newPassRetype)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })

}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    changePassword
}