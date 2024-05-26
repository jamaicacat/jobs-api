const { StatusCodes } = require('http-status-codes')
const Job = require('../models/Job')
const { BadRequestError, NotFoundError } = require('../errors/index')

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req

	const job = await Job.findOne({ _id: jobId, createdBy: userId })

	if (!job) {
		throw new NotFoundError(`No job with id '${jobId}'`)
	}

	res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
	const job = await Job.create({ ...req.body, createdBy: req.user.userId })
	res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
		body: { company, position },
	} = req

	if (!company || !position) {
		throw new BadRequestError('Company or Position field cannot be empty')
	}

	const job = await Job.findOneAndUpdate(
		{ _id: jobId, createdBy: userId },
		{ company, position },
		{ new: true },
	)

	if (!job) {
		throw new NotFoundError(`No job with id '${jobId}'`)
	}

	res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req

	const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })

	if (!job) {
		throw new NotFoundError(`No job with id '${jobId}'`)
	}

	res.status(StatusCodes.OK).json({ job })
}

module.exports = {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob,
}
