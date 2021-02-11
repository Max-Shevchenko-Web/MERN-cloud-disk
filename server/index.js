const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.routes")
const fileUpload = require("express-fileupload")
const app = express()
const corsMiddleware = require('./middleware/cors.middleware')

const PORT = process.env.PORT || config.get("serverPort")
const URL = config.get("dbUrl")

//наш самодельный cors
app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json())
app.use(express.static('static'))
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)

//функция подключается к ДБ и запускает сервер
const start = async () => {
  try {
      mongoose.set('useCreateIndex', true)
      mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })

      app.listen(PORT, () => {
          console.log('Server started on port ', PORT)
      })
  } catch (e) {

  }
}

start()