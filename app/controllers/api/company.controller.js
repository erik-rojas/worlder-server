const { companyService } = require("../../services");

const getCompanyJobs = (req, res) => {
    companyService.getCompanyJobs(req.params.id, req.query)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const getAllCompany = (req, res) => {
    console.log("hehe", req.query)
    companyService.getAllCompany(req.query)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const getCompanyDetails = (req, res) => {
    companyService.getCompanyDetails(req.params.id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const getJobApplications = (req, res) => {
    companyService.getJobApplications(req.user._id, req.params.job_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

module.exports = {
    getCompanyJobs,
    getAllCompany,
    getCompanyDetails,
    getJobApplications,
};
