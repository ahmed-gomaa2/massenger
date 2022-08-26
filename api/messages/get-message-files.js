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
    app.get('/files/:iv/:filename', async (req, res) => {
        const Key = `files/${req.params.filename}`;
        const buffer = await getEncryptedFile(req.params.iv, Key, getEncryptedFilePath, decryptFile);

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