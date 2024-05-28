require('dotenv').config()

const { BadRequestError } = require('../errors/index')

const TEST_USER_ID = process.env.TEST_USER_ID

const authTestUser = async (req, res, next) => {
	if (req.user.userId === TEST_USER_ID) {
		throw new BadRequestError('You cannot perform this action for test user.')
	}
	next()
}

module.exports = authTestUser
