const mongoose = require("mongoose");
const User = mongoose.model("User");

const checkEmailAvailable = (email) => {
    return new Promise((resolve, reject) => {
        if (email) {
            User.findOne({ email: email })
                .then(doc => {
                    if (doc == null) {
                        resolve(true);
                    } else {
                        return reject({ message: "Email not available. Please use another one." });
                    }
                })
                .catch(err => {
                    return reject(err);
                })
        } else {
            return reject({ message: "Empty email" });
        }

    })
}

module.exports = {
    checkEmailAvailable,
}