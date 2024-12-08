const express = require('express')
const lib  = require('./lib/scripts')
const x    = require("./lib/connections.js")
const port = 112
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser');
var MySQLStore = require('connect-mysql')(session)
app.use(bodyParser.urlencoded({ extended: false }));
var userRouter = require('./routes/user')
var pagesRouter = require('./routes/page')
var statsRouter = require('./routes/stat')
var hitRouter   = require('./routes/hit')
var cors = require('cors')
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
// Init
app.use(bodyParser.json());
const server = require('http').createServer(app);const io = require('socket.io')(server);




app.use(session({
    proxy: true,
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({config:x.credentials.mysql}),
    cookie : {
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + (6*30 * 86400 * 1000))
      }
}));

app.use((req, res, next)=>{
    console.log(req.sessionID +" \x1b[31m "+ req.session.uid + " \x1b[33m " + req.method + " - " + req.path + "\x1b[0m")
    if(req.method === 'POST' && !req.password) console.log(req.body)
   // console.log(JSON.stringify(req.get("X-Real-IP")))

    next()
})

////


// io.on('connection', (socket) => { 
//      console.log('a user connected');  
//         socket.on('disconnect', () => {
//             console.log('user disconnected');  
//         });
//         socket.on('data', (data) => {
//             console.log(data);  
//         });
//         socket.on('handshake', (data) => {

//         });
// });

app.get('', (req, res)=>{
    res.sendFile("/home/rasmus/Desktop/VeebsterCurrent/express/index.html")
})
app.use('/hit/', hitRouter)
app.use('/user/', userRouter)
app.use('/page/', pagesRouter)
app.use('/stat/', statsRouter)




app.use('*', (req, res)=>{
    res.status(404)
    res.send("¤=¤")
})

server.listen(port, ()=>{
    lib.success("SERVER LISTENING ON PORT " + port)
})