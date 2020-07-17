const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static("public"))

app.get("/", function (req, res) {
    res.redirect("/index.html")
})