const express = require('express')
const router = express.Router()

const {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob,
	showStats,
} = require('../controllers/jobs')

const authTestUser = require('../middleware/auth-test-user')

router.route('/').post(authTestUser, createJob).get(getAllJobs)
router.route('/stats').get(showStats)
router
	.route('/:id')
	.get(getJob)
	.patch(authTestUser, updateJob)
	.delete(authTestUser, deleteJob)

module.exports = router
