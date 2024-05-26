require('dotenv').config()
require('express-async-errors')

// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

// swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const express = require('express')
const app = express()

// connect db
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

// security middleware
app.set('trust proxy', 1)
app.use(
	rateLimit({
		windowsMs: 15 * 60 * 1000,
		max: 100,
	}),
)
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res) => {
	res.send('<h1>Jobs API</h1><a href="api-docs">Documentation</a>')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

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
