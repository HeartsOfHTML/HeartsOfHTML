const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const PORT = process.env.PORT || 5000

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.redirect("/index.html")
})

io.on("connection", (socket) => {
    console.log("A user connected!")

    socket.on("disconnect", () => {
        console.log("A user disconnected.")
    })
})

http.listen(PORT, () => console.log(`App listening on port ${PORT}`))