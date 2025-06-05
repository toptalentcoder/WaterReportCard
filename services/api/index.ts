import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.get('/districts', async (req, res) => {
    const data = await fetchDistrictsFromDB()
    res.json(data)
})

const fetchDistrictsFromDB = async () => {
    return [{ id: 1, name: 'District A' }, { id: 2, name: 'District B' }]
}

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`)
})
