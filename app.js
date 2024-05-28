require('dotenv').config()
require('express-async-errors')

// security packages
const helmet = require('helmet')
const xss = require('xss-clean')

const express = require('express')
const app = express()

const path = require('path')

// connect db
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)

app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(express.json())
// security middleware
app.use(helmet())
app.use(xss())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, () =>
			console.log(`✔️  Server is listening on port ${port}...`),
		)
	} catch (error) {
		console.log('❌ Error occured while starting server', error)
	}
}

start()
