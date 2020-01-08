const router = require("express").Router();

const { companyCtrl } = require("../../../app/controllers/api");

// Middleware
const {
    jwtAuth, hasRole
} = require('../../middleware');

router.get("/:id/jobs", companyCtrl.getCompanyJobs);
router.get("/applications/:job_id", jwtAuth, hasRole('company'), companyCtrl.getJobApplications);
router.get("/", companyCtrl.getAllCompany);
router.get("/:id", companyCtrl.getCompanyDetails);

module.exports = router