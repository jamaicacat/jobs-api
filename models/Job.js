const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, 'Provide company name'],
			maxLength: 50,
		},
		position: {
			type: String,
			required: [true, 'Provide position'],
			maxLength: 120,
		},
		status: {
			type: String,
			enum: ['interview', 'declined', 'pending'],
			default: 'pending',
		},
		jobType: {
			type: String,
			enum: ['full-time', 'part-time', 'remote', 'internship'],
			default: 'full-time',
		},
		jobLocation: {
			type: String,
			required: true,
			default: 'Kyiv',
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'Provide an user'],
		},
	},
	{ timestamps: true },
)

module.exports = mongoose.model('Job', JobSchema)
