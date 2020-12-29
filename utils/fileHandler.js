const fs = require('fs');
const path = require('path');
const glob = require('glob');
const logger = require('./logger');

function formatPath (filePath) {
    return String(filePath).replace(/\\/g, '/');
}

/**
 * 检查本地路径是否存在
 * @param localPath
 * @returns {boolean}
 */
function loaclPathExits (localPath) {
    if (!localPath) {
        return false;
    }
    return fs.existsSync(localPath);
}

/**
 * 判断是否为目录
 * @param filePath
 * @returns {boolean}
 */
function isDirectory (filePath) {
    if(!loaclPathExits(filePath)) {
        return false;
    }
    return fs.statSync(filePath).isDirectory();
}

/**
 * 判断是否为文件
 * @param filePath
 * @returns {boolean}
 */
function isFile (filePath) {
    if(!loaclPathExits(filePath)) {
        return false;
    }
    return fs.statSync(filePath).isFile();
}

/**
 * 根据目录路径读取文件，返回文件列表
 * @param localDirPath
 * @param remoteDirPath
 * @returns {[]}
 */
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

/**
 * 使用glob 匹配文件
 * @param localPath
 * @param remotePath
 * @returns {[]|*[]}
 */
function createGlobList (localPath, remotePath) {
    if (!localPath || !remotePath) {
        return [];
    }
    localPath = formatPath(localPath);
    let localFiles = glob.sync(localPath);
    let localDir = path.parse(localPath).dir;
    let res = [];
    localFiles.forEach(filePath => {
        if (isDirectory(filePath)) {
            res = res.concat(createDirList(localDir, remotePath));
        } else {
            let relativePath = path.relative(localDir, filePath);
            res.push({
                src: filePath,
                des: path.join(remotePath, path.parse(relativePath).base)
            });
        }
    });
    return res;
}

/**
 * 获取文件上传列表
 * @param localPath
 * @param remotePath
 * @returns {*[]}
 */
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