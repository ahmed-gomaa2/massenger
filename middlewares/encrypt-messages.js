const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = require('../keys').cryptoKey;
const path = require('path');
const fs = require('fs');

// console.log(key);
// const iv = Buffer.from('efb2da92cff888c9c295dc4ee682789c', 'hex')
// const key = Buffer.from('6245cb9b8dab1c1630bb3283063f963574d612ca6ec60bc8a5d1e07ddd3f7c53', 'hex')


/*******************************************/
/* Encrypting Text */
/*******************************************/
exports.encrypt = text => {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    // let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}


/**************************************************/
/* Decrypting text */
/**************************************************/
exports.decrypt = text => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts[0], 'hex');

    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let encryptedText = Buffer.from(textParts[1], 'hex');

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

/*********************************************/
/* Encrypting files */
/*********************************************/
exports.encryptFile = (file) => {
    const iv = crypto.randomBytes(16);
    file.iv = iv.toString('hex');
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return Buffer.concat([cipher.update(file.buffer), cipher.final()]);
}

/*******************************************************/
/* Decrypting files */
/*******************************************************/
exports.decryptFile = (buffer, iv) => {
    iv = Buffer.from(iv, 'hex');
    console.log(key, iv);
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    const decrypted =  Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted;
}

exports.getEncryptedFilePath =  function (filePath) {
    const fileName = path.basename(filePath, path.extname(filePath)) + Date.now() + "_encrypted" + path.extname(filePath);
    return {fileName, filePath: path.join(path.dirname(filePath) , fileName)};
}

exports.saveEncryptedFile =  function (file, encryptFile, getEncryptedFilePath, buffer, filePath) {
    const encrypted = encryptFile(file);

    const fileInfo = getEncryptedFilePath(filePath);
    filePath = fileInfo.filePath;

    file.filename = fileInfo.fileName;

    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath))
    }

    fs.writeFileSync(filePath, encrypted);
}

exports.getEncryptedFile =  function (iv, filePath, getEncryptedFilePath, decryptFile) {
    // filePath = getEncryptedFilePath(filePath);
    const encrypted = fs.readFileSync(filePath);
    const buffer = decryptFile(encrypted, iv);
    return buffer;
}

//
// /*********************************************/
// /* Encrypting files */
// /*********************************************/
// exports.encryptFile = buffer => {
//     // const iv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     return Buffer.concat([cipher.update(buffer), cipher.final()]);
// }
//
// /*******************************************************/
// /* Decrypting files */
// /*******************************************************/
// exports.decryptFile = (buffer) => {
//     console.log(key, iv);
//     const decipher = crypto.createDecipheriv(algorithm, key, iv);
//     const decrypted =  Buffer.concat([decipher.update(buffer), decipher.final()]);
//     return decrypted;
// }
//
// exports.getEncryptedFilePath =  function (filePath) {
//     const fileName = path.basename(filePath, path.extname(filePath)) + Date.now() + "_encrypted" + path.extname(filePath);
//     return {fileName, filePath: path.join(path.dirname(filePath) , fileName)};
// }
//
// exports.saveEncryptedFile =  function (file, encryptFile, getEncryptedFilePath, buffer, filePath) {
//     const encrypted = encryptFile(buffer);
//
//     const fileInfo = getEncryptedFilePath(filePath);
//     filePath = fileInfo.filePath;
//
//     file.filename = fileInfo.fileName;
//
//     if (!fs.existsSync(path.dirname(filePath))) {
//         fs.mkdirSync(path.dirname(filePath))
//     }
//
//     fs.writeFileSync(filePath, encrypted);
// }
//
// exports.getEncryptedFile =  function (filePath, getEncryptedFilePath, decryptFile, key) {
//     // filePath = getEncryptedFilePath(filePath);
//     const encrypted = fs.readFileSync(filePath);
//     const buffer = decryptFile(encrypted);
//     return buffer;
// }
//
