import express from 'express'
import UserRouter from './routes/user.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT_BACK || 3900

const app = express()

app.use(express.json())

app.use('/api/user', UserRouter)

app.get('/api', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
