const fs = require('fs');
const path = require('path');
const glob = require('glob');

function formatPath (filePath) {
    return String(filePath).replace(/\\/g, '/');
}

// 检查本地路径是否存在
function loaclPathExits (localPath) {
    return fs.existsSync(localPath);
}

// 判断是否为目录
function isDirectory (filePath) {
    if(!loaclPathExits(filePath)) {
        return false;
    }
    return fs.statSync(filePath).isDirectory();
}

// 判断是否为文件
function isFile (filePath) {
    if(!loaclPathExits(filePath)) {
        return false;
    }
    return fs.statSync(filePath).isFile();
}

// 根据目录路径读取文件，返回文件列表
function createDirList (localDirPath, remoteDirPath) {
    let fileList = [];
    if (!localDirPath || !remoteDirPath) {
        return fileList;
    }
    fs.readdirSync(localDirPath).forEach(filename => {
        let loaclFilePath = formatPath(path.join(localDirPath, filename)),
            remoteFilePath = formatPath(path.join(remoteDirPath, filename));

        if (isDirectory(loaclFilePath)) {
            fileList = fileList.concat(createDirList(loaclFilePath, remoteFilePath));
        } else {
            fileList.push({
                src: loaclFilePath,
                des: remoteFilePath
            });
        }
    });
    return fileList;
}

// 使用glob 匹配文件
function createGlobList (localPath, remotePath) {
    if (!localPath || !remotePath) {
        return [];
    }
    localPath = formatPath(localPath);
    let localFiles = glob.sync(localPath);

    let res = [];
    localFiles.forEach(filePath => {
        if (isDirectory(filePath)) {
            res = res.concat(createDirList(filePath, remotePath));
        } else {
            let relativePath = path.relative(localPath, filePath);

            // todo 目录这里有点bug，需要保持原有的目录结构
            res.push({
                src: filePath,
                des: path.join(remotePath, path.parse(relativePath).base)
            });
        }
    });
    return res;
}

function getUploadList (localPath, remotePath) {
    localPath = formatPath(path.resolve(localPath));
    remotePath = formatPath(remotePath);

    return isDirectory(localPath)
        ? createDirList(localPath, remotePath)
        : createGlobList(localPath, remotePath);
}

module.exports = {
    formatPath,
    loaclPathExits,
    isDirectory,
    isFile,
    createDirList,
    createGlobList,
    getUploadList
}