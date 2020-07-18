const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const PORT = process.env.PORT || 5000

app.use(express.static("public"))
app.use(express.urlencoded())
app.use(express.json())

app.get("/", (req, res) => {
    res.redirect("/index.html")
})

app.get("/socketiotest", (req, res) => {
    switch (req.query.page) {
        case "host":
            res.sendFile(__dirname + "/public/host.html")
            break;

        default:
            res.sendFile(__dirname + "/public/socketiotesthtml.html")
            break;
    }
})

app.post("/socketiotest", (req, res) => {
    switch (req.body.type) {
        case "createRoom":
            // handle createRoom request
            var socket = io.sockets.connected[req.body.socketId]
            var roomName = req.body.roomName
            
            socket.join(roomName)

            console.log("Room created successfully")

            res.send("room created")

            break;
        case "joinRoom":
            // handle createRoom request
            break;

        default:
            break;
    }
})

io.on("connection", (socket) => {
    console.log("A user connected! ID: " + socket.id)

    socket.emit("server sent id", socket.id)

    socket.on("disconnect", () => {
        console.log("A user disconnected.")
    })
})

http.listen(PORT, () => console.log(`App listening on port ${PORT}`))