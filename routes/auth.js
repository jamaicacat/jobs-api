const express = require('express')
const router = express.Router()

const { login, register, deleteAll } = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.delete('/', deleteAll)

module.exports = router
