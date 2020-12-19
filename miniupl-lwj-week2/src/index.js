const {checkConfigs, defaultConfig} = require('../config');
const {getUploadList} = require('./fileHandler');
const SftpUpload = require('./sftp');
const FtpUpload = require('./ftp');
module.exports = function (config) {
    if (!checkConfigs(config)) {
        return ;
    }
    let sftp = new SftpUpload(config);
    let ftp = new FtpUpload(config);
    if (config.sftp) {
        sftp.upload(getUploadList(config.src, config.des))
    } else {
        ftp.upload(getUploadList(config.src, config.des))
    }
}