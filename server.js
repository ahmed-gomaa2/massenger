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

require('dotenv').config();

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
const {S3UploadV2} = require("./middlewares/aws-multer-upload");

const app = express();
// app.engine('hbs', exphbs({extname: '.hbs'}));
// app.set('view engine', 'hbs');

// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept");
//     next();
// });
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
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
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

const upload = multer({
    storage
});

app.post('/upload', upload.array('files'), async (req, res) => {
    const file = req.files[0]
    console.log(file);
    const result = await S3UploadV2(file.originalname, file.buffer);
    res.json({status: 'success', result});
})

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`The app is listening to:${port}`);
});

