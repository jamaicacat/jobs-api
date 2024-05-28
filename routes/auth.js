const express = require('express')
const router = express.Router()

const rateLimiter = require('express-rate-limit')
const limiter = rateLimiter({
	windowMS: 15 * 60 * 1000,
	max: 10,
	message: {
		msg: 'Too many requests from this IP. Try again later.',
	},
})

const authenticateUser = require('../middleware/authentication')
const authTestUser = require('../middleware/auth-test-user')

const { login, register, updateUser } = require('../controllers/auth')

router.post('/register', limiter, register)
router.post('/login', limiter, login)
router.patch('/updateUser', authenticateUser, authTestUser, updateUser)

module.exports = router
