const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/db')
require('dotenv').config()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World')
})
app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/appRoutes.js'))
connectDB()

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

