const router = require('express').Router();

// Controller
const {
    jobseekerCtrl
} = require("../../../app/controllers/api");

// Middleware
const {
    jwtAuth, hasRole
} = require('../../middleware');


router.get("/:id", jobseekerCtrl.getJobseeker);
router.get("/detail/saved-jobs", jwtAuth, hasRole('seeker'), jobseekerCtrl.getAllSavedJobs);
router.put("/detail/saved-jobs/:job_id", jwtAuth, hasRole('seeker'), jobseekerCtrl.toggleSavedJob);
router.get("/detail/applied-jobs", jwtAuth, hasRole('seeker'), jobseekerCtrl.getAppliedJobs);
// APPLICATIONS
router.get("/detail/my-applications", jwtAuth, hasRole('seeker'), jobseekerCtrl.getSeekerApplications);
router.get("/detail/followed-companies", jwtAuth, hasRole('seeker'), jobseekerCtrl.getFollowedCompany);
router.put("/detail/followed-companies/:company_id", jwtAuth, hasRole('seeker'), jobseekerCtrl.toggleFollowCompany);

module.exports = router;
