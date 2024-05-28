const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const User = require('../models/User')

const register = async (req, res) => {
	const user = await User.create({ ...req.body })

	res.status(StatusCodes.CREATED).json({
		user: {
			name: user.name,
			lastName: user.lastName,
			location: user.location,
			email: user.email,
			token: user.createJWT(),
		},
	})
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
		res.status(StatusCodes.OK).json({
			user: {
				name: user.name,
				lastName: user.lastName,
				location: user.location,
				email: user.email,
				token: user.createJWT(),
			},
		})
	} else throw new UnauthenticatedError('Invalid credentials')
}

const updateUser = async (req, res) => {
	const { name, lastName, email, location } = req.body

	if (!name || !lastName || !email || !location) {
		throw new BadRequestError(
			'Provide name, last name, email, location to update user',
		)
	}

	const user = await User.findById(req.user.userId)

	user.name = name
	user.lastName = lastName
	user.email = email
	user.location = location

	await user.save()

	res.status(StatusCodes.OK).json({
		user: {
			name: user.name,
			lastName: user.lastName,
			location: user.location,
			email: user.email,
			token: user.createJWT(),
		},
	})
}

module.exports = {
	register,
	login,
	updateUser,
}
