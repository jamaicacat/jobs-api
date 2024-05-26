const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const register = async (req, res) => {
	const user = await User.create({ ...req.body })

	res
		.status(StatusCodes.CREATED)
		.json({ user: { name: user.name }, token: user.createJWT() })
}

const login = async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		throw new BadRequestError('Provide login credentials')
	}

	const user = await User.findOne({ email })

	if (!user) {
		throw new UnauthenticatedError('Invalid credentials')
	}

	const isPasswordCorrect = await user.comparePassword(password)

	if (isPasswordCorrect) {
		res
			.status(StatusCodes.OK)
			.json({ user: { name: user.name }, token: user.createJWT() })
	} else throw new UnauthenticatedError('Invalid credentials')
}

const deleteAll = async (req, res) => {
	res.json(await User.deleteMany({}))
}

module.exports = {
	register,
	login,
	deleteAll,
}
