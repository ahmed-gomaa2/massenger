const express = require('express');
const bodyParser = require('body-parser');
// const formidable = require('express-formidable');
const multer = require('multer');
// const exphbs = require('express-handlebars');
const http = require('http');
const cors = require('cors');
const {Server, Socket} = require('socket.io');
const stream = require("stream");
const registerRoute = require('./api/auth/register');
const loginRoute = require('./api/auth/login');
const loadUserRoute = require('./api/auth/load');
const logoutRoute = require('./api/auth/logout');
const socketConnection = require('./socket');
const usersRoutes = require('./api/users');
const createRoomRoute = require('./api/rooms/create-room');
const getUserRooms = require('./api/rooms/get-user-rooms');
const getRoomMessages = require('./api/rooms/get-room-messages');
const createNewMessageRoute = require('./api/messages/create-message');
const setRoomSeenRoute = require('./api/rooms/make-room-seen');
const setRoomUnSeenRoute = require('./api/rooms/make-room-unseen');
const getMessagesFiles = require('./api/messages/get-message-files');
// const {buildOptions} = require("express-fileupload/lib/utilities");

const {
    encrypt,
    decrypt,
    encryptFile,
    decryptFile,
    getEncryptedFile,
    saveEncryptedFile,
    getEncryptedFilePath
} = require('./middlewares/encrypt-messages');
const path = require("path");
const {cryptoKey} = require("./keys");

const app = express();
// app.engine('hbs', exphbs({extname: '.hbs'}));
// app.set('view engine', 'hbs');

// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
// app.use('/files', express.static('./files'));

// //default options
// app.use(fileUpload({
//     limits: {
//         fileSize: 1024 * 1024
//     },
//     abortOnLimit: true
// }));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


//
// app.get('/', (req, res) => {
//    res.send('Hello from the server!');
// });

socketConnection(app, io);

registerRoute(app);
loginRoute(app);
loadUserRoute(app);
logoutRoute(app);
usersRoutes(app);
createRoomRoute(app);
getUserRooms(app);
getRoomMessages(app);
createNewMessageRoute(app);
setRoomSeenRoute(app);
setRoomUnSeenRoute(app);
getMessagesFiles(app);

const storage = multer.memoryStorage();
const upload = multer({storage})

app.post("/upload", upload.single("file"),  (req, res, next) => {
    console.log("file upload: ", req.file.originalname);
    saveEncryptedFile(encryptFile, getEncryptedFilePath, req.file.buffer, path.join("./uploads", req.file.originalname));
    res.status(201).json( { status: "ok" });
});

app.get("/file/:fileName", (req, res, next) => {
    console.log("Getting file:", req.params.fileName);
    const buffer = getEncryptedFile(path.join("./uploads", req.params.fileName), getEncryptedFilePath, decryptFile);
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    res.writeHead(200, {
        "Content-disposition": "attachment; filename=" + req.params.fileName,
        "Content-Type": "application/octet-stream",
        "Content-Length": buffer.length
    });
    res.end(buffer);
});

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`The app is listening to:${port}`);
});
