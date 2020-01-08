const Jobseeker = require("../models/jobseekers");

const getJobseeker = (key, value) => {
    let query = {};
    if (key == "user_id") {
        query = { user_id: value }
    } else {
        query = { _id: value }
    }
    return new Promise((resolve, reject) => {
        Jobseeker.findOne(query)
            .populate("user_id", "-password")
            .then(doc => {
                if (doc == null) throw new Error("Jobseeker not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}


module.exports = {
    getJobseeker,
}