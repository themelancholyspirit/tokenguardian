require('dotenv').config()

const express = require('express')
const app = express()

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const connectDB = require('./dbConnect')
const User = require('./User')

const port = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.redirect('/api-docs')
})


app.use('/auth', authRouter)
app.use('/profile', profileRouter)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

async function startServer() {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => 
            console.log(`Server is listening on port ${port}`)
        )
    } catch (error) {
        console.log(error)

        console.log("Error starting the server.")        
    }
}

startServer()