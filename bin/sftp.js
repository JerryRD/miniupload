'use strict';
const Client = require('ssh2-sftp-client');
let sftpClient = new Client();

function sftpUplFile (host, localPath, romotePath) {
    sftpClient.connect(host).then(() => {
        return sftpClient.fastPut(localPath, romotePath);
        })
        .then((data) => {
            console.log('上传成功');
            sftpClient.end();
        })
        .catch((err) => {
            console.log(`上传失败: ${err.message}`);
            sftpClient.end();
        });
}

function sftpUplDir (host, localPath, romotePath) {
    (async function () {
        try {
            await sftpClient.connect(host);
            sftpClient.on('upload', info => {
                console.log(`${info.source}: 上传完成`);
            });
            return await sftpClient.uploadDir(localPath, romotePath);
        } finally {
            sftpClient.end();
        }
    })().then(msg => {
        console.log('上传成功！');
    }).catch(err => {
        console.log(`上传失败: ${err.message}`);
    });
}

module.exports = {
    sftpUplFile,
    sftpUplDir
}