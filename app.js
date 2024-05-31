const express = require('express')
const app = express()
const path = require("path")
const socket = require("socket.io")
const http = require("http")
const {Chess} = require("chess.js")
const server = http.createServer(app)
const io = socket(server)
const chess = new Chess();
let players = {}
let currentPlayer = "W"


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
    res.render('index')
})

io.on("connection", function (uniquesocket) {
    console.log("connected")
    if(!players.white){
        players.white = uniquesocket.id
        uniquesocket.emit("player role","w");
    }
    else if(!players.black){
        players.black = uniquesocket.id
        uniquesocket.emit("player role","b");
    }
    else{
        uniquesocket.emit("spactator role")
    }
    uniquesocket.on("disconnect", function () {
      if(uniquesocket.id == players.white){
        delete players.white;
      }
      else if(uniquesocket.id === players.black){
        delete players.black;
      }
    })
    uniquesocket.on("move",function(move){
        try{
            if(chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if(chess.turn() === "b" && uniquesocket.id !== players.black) return;
            const result = chess.move(move)
            if(result){
                currentPlayer = chess.turn();
                io.emit("move",move)
                io.emit("bordstate",chess.fen())
            }
            else {
                console.log("illegal move",move)
                uniquesocket.emit("illegal move",move)
            }
        }
        catch(err){
            console.log(err)
            uniquesocket.emit("illegal move",move)
        }
    })
})

server.listen(3000)