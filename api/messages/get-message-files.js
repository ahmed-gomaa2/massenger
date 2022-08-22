const {
    encrypt,
    decrypt,
    encryptFile,
    decryptFile,
    getEncryptedFile,
    saveEncryptedFile,
    getEncryptedFilePath
} = require('../../middlewares/encrypt-messages');
const stream = require("stream");
const path = require("path");


module.exports = app => {
    app.get('/files/:iv/:fileName', (req, res) => {
        const buffer = getEncryptedFile(req.params.iv, path.join('./files/', req.params.fileName), getEncryptedFilePath, decryptFile);
        const readStream = new stream.PassThrough();
        readStream.end(buffer);

        res.writeHead(200, {
            "Content-disposition": "attachment; filename=" + req.params.fileName,
            "Content-Type": "application/octet-stream",
            "Content-Length": buffer.length
        });
        res.end(buffer);
    });
}