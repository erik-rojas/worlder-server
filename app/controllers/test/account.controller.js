const mongoose = require("mongoose");
const { wrap: async } = require("co");


const User = mongoose.model("User");


const login = async (req, res) => {
    let error = "";
    switch (req.method) {
        case "GET": return res.render("test/account/login", { error });
        case "POST": {
            const user = req.body;
            if (user.username === "" || user.password === "") {
                error = "Username or password invalid";
                return res.render("test/account/login", { error });
            }
            const userFound = await User.findOne(user).exec();
            if (userFound === null) {
               error = "Username or password incorrect"
            }
            if (error) {
                return res.render("test/account/login", { error });
            }
            req.session.userAuth = userFound;
            res.redirect("/test/chat");
        }
    }
}

const register = async (req, res) => {
    let error = "";
    switch (req.method) {
        case "GET": return res.render("test/account/register", { error });
        case "POST": {
            const user = req.body;
            if (
                user.username === "" ||
                user.password === "" ||
                user.confirm === "" ||
                user.fullname === ""
            ) {
                error = "Some feild is empty!";
            }

            if (user.password !== user.confirm) error = "Confirm password incorrect!";

            try {
                const userSave = new User(user);
                await userSave.save();
            } catch(er) {
                error = "can not save user";
            }
 
            if (error !== "") return res.render("test/account/register", { error });
            return res.redirect("/test/login");
        }
    }
}

const logout = (req, res) => {
    delete req.session.userAuth;
    res.redirect("/test/login");
}

module.exports = {
    login,
    register,
    logout
}