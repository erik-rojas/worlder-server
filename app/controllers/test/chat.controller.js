const index = (req, res) => {
    res.render("test/chat/index", {
        userAuth: req.session.userAuth
    });
}

const enterRoom = (req, res) => {
    res.render("test/chat/room", {
        room_id: req.params.room_id,
        fullname: req.session.userAuth.fullname
    })
}


module.exports = {
    index,
    enterRoom
}