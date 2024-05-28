require('dotenv').config()

const mockData = require('./mock-data.json')

const connectDB = require('./db/connect')
const Job = require('./models/Job')

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		await Job.create(mockData)

		console.log('Successfully populated DB')
		process.exit(0)
	} catch (error) {
		console.error(`Error occured while populating data to DB ${error}`)
		process.exit(1)
	}
}

start()
