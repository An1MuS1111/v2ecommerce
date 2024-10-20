const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()


app.use(cors());
app.use(express.json());





// import routes
const usersRouter = require('./routes/users')



// use routes
app.use('/users', usersRouter)




const PORT = process.env.PORT || 4444
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})