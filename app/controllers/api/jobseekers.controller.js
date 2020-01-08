const { jobseekerService } = require("../../services");

const getJobseeker = (req, res) => {
    let id = req.params.id;
    jobseekerService.getJobseeker("_id", id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendData(err.message);
    })
}

const getAppliedJobs = (req, res) => {
    jobseekerService.getAppliedJobs(req.user._id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}
// SAVED JOBS

const getAllSavedJobs = (req, res) => {
    jobseekerService.getAllSavedJobs(req.user._id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const toggleSavedJob = (req, res) => {
    jobseekerService.toggleSavedJob(req.user._id, req.params.job_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

// APPLICATIONS
const getSeekerApplications = (req, res) => {
    jobseekerService.getSeekerApplications(req.user._id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

// FOLLOWED COMPANY

const getFollowedCompany = (req, res) => {
    jobseekerService.getFollowedCompany(req.user._id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const toggleFollowCompany = (req, res) => {
    jobseekerService.toggleFollowCompany(req.user._id, req.params.company_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

module.exports = {
    getJobseeker,
    getAppliedJobs,
    getAllSavedJobs,
    toggleSavedJob,
    // APPLICATIONS
    getSeekerApplications,
    getFollowedCompany,
    toggleFollowCompany

}