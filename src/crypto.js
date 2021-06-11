const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const tempSecretKey = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN : "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const secretKey = crypto.createHash('sha256').update(String(tempSecretKey)).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16);
const tmp = require('tmp');

const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

const encryptBuffer = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decryptBuffer = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

const fs = require('fs');
var zlib = require('zlib');
const ecnryptFile = (filePath) => {

    
    return new Promise((resolve, reject) => {
        const tmpobj = tmp.fileSync();
        const hash = crypto.createHash('sha256').update(secretKey).digest('hex');
        // encrypto data
        let cipher = crypto.createCipheriv('aes-256-ecb', hash.substring(0, 32), '');
        // cipher.setAutoPadding(false)
        
        let fileData = fs.readFileSync(filePath)
        let encryptedData = Buffer.concat([cipher.update(fileData), cipher.final()]);
        fs.writeFileSync(tmpobj.name, encryptedData)
        resolve(tmpobj.name)
        return
        // // input file
        // const r = fs.createReadStream(filePath);

        // var zip = zlib.createGzip();
      
        // // encrypt content
        // const encrypt = crypto.createCipheriv(algorithm, secretKey, iv);

      
        // // write file
        // const w = fs.createWriteStream(tmpobj.name);

        // // start pipe
        // r
        // // .pipe(zip)
        // .pipe(encrypt).pipe(w);
        
        // r.on('error', function (error) {
        //     console.log("read error")
        //     reject(error.message)
        // })
        // zip.on('error', function (error) {
        //     console.log("zip error")
        //     reject(error.message)
        // })
        // encrypt.on('error', function (error) {
        //     console.log("encrypt error")
        //     reject(error.message)
        // })
        // w.on('error', function (error) {
        //     console.log("write error")
        //     reject(error.message)
        // })
        // w.on('close', function () {
        //     resolve(tmpobj.name)
        //     // resolve(fs.readFileSync(tmpobj.name))
        // })
  })
  

  
  return 
}

const decryptFile = ({filePath = null, fileBuffer = null}) => {

    return new Promise((resolve, reject) => {
        const tmpobj = tmp.fileSync();
        const hash = crypto.createHash('sha256').update(secretKey).digest('hex');
        // decrypto data
        let decipher = crypto.createDecipheriv('aes-256-ecb', hash.substring(0, 32), '');
        // the decrypto key point
        // decipher.setAutoPadding(false);
        fileD = fs.readFileSync(filePath).toString()
        fs.writeFileSync(tmpobj.name, Buffer.concat([decipher.update(fs.readFileSync(filePath)), decipher.final()]))
        resolve(tmpobj.name)
        return
        // // input file
        // let r = null;
        // var unzip = zlib.createGunzip();
        // if (filePath != null) r= fs.createReadStream(filePath)
        // else {
        //     const {Duplex} = require('stream'); // Native Node Module 

        //     function bufferToStream(myBuuffer) {
        //         let tmp = new Duplex();
        //         tmp.push(myBuuffer);
        //         tmp.push(null);
        //         return tmp;
        //     }

        //     const myReadableStream = bufferToStream(fileBuffer);
        //     r = myReadableStream;

        //     // const { Readable } = require('stream');
        //     // function bufferToStream(binary) {

        //     //     const readableInstanceStream = new Readable({
        //     //       read() {
        //     //         this.push(binary);
        //     //         this.push(null);
        //     //       }
        //     //     });
            
        //     //     return readableInstanceStream;
        //     // }
        //     // // const r = Readable.from(fileBuffer.toString());
        //     // r = bufferToStream(fileBuffer)
        // }
      
        // // decrypt content
        // const decrypt = crypto.createDecipheriv(algorithm, secretKey, iv);

      
        // // write file
        // let w = null
        // if (filePath != null) w = fs.createWriteStream(tmpobj.name);
        // else  w = fs.createWriteStream(tmpobj.name);
        

        // // start pipe
        // r.pipe(decrypt)
        // // .pipe(unzip)
        // .pipe(w);
        
        // r.on('error', function (error) {
        //     console.log("read error")
        //     reject(error.message)
        // })
        // decrypt.on('error', function (error) {
        //     console.log("decrypt error")
        //     reject(error.message)
        // })
        // unzip.on('error', function (error) {
        //     console.log("unzip error")
        //     reject(error.message)
        // })
        // w.on('error', function (error) {
        //     console.log("write error")
        //     reject(error.message)
        // })
        // w.on('close', function () {
        //     if (filePath != null ) resolve(tmpobj.name)
        //     else resolve(tmpobj.name)
        //     // else resolve(fs.readFileSync(tmpobj.name))
        // })
    })
}

module.exports = {
    encryptBuffer,
    decryptBuffer,
    ecnryptFile,
    decryptFile
};