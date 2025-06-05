import express from 'express'
import dotenv from 'dotenv'
import districtRoute from './routes/district-route.ts'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Routes 
app.use('/districts', districtRoute)

app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`)
})
