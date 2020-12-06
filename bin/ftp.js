const Client = require('ftp');
const fs = require('fs');
const path = require('path');
const ftpClient = new Client();

function ftpUplFile (host, localPath, romotePath) {
    ftpClient.connect(host);
    ftpClient.on('ready', function() {
        ftpClient.put(localPath, romotePath, (err) => {
            ftpClient.end();
            if (err) {
                console.log(err);
            } else {
                console.log('上传成功');
            }
        });
    });
}

function ftpUplDir (host, localPath, romotePath) {
    if(!fs.existsSync(localPath)) {
        console.log('目录不存在！');
        return;
    }

    fs.readdir(localPath, function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        files.forEach(function(filename){
            var filePath = path.join(localPath, filename);
            fs.stat(filePath, function(eror, stats){
                if(eror){
                    console.warn('获取文件stats失败');
                    return ;
                }
                if(stats.isFile()){
                   console.log(filePath);
                    ftpUplFile(host, localPath, romotePath);
                }
                if(stats.isDirectory()){
                    ftpUplDir(host, filePath, romotePath);
                }
            });
        });
    });
}

module.exports = {
    ftpUplFile,
    ftpUplDir
}