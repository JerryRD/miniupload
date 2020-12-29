const {getUploadList} = require('./utils/fileHandler');
const SftpUpload = require('./src/sftp');
const FtpUpload = require('./src/ftp');
const logger = require('./utils/logger');

module.exports = class MiniUpl {
    constructor(config) {
        this.config = config || {};
        logger.info('初始化上传参数', config);
    }

    setConfig() {
        let arg_0 = arguments[0];
        if (typeof arg_0 === 'object') {
            this.config = arg_0;
        }
        if (typeof arg_0 === 'string') {
            this.config[arg_0] = arguments[1];
        }
    }

    getConfig() {
        if (arguments[0]) {
            return this.config[arguments[0]];
        }
        return this.config;
    }

    getLastUploadFile() {}

    getLastUploadSuccess() {}

    getLastUploadFailure() {}

    upload () {
        let {src, des, protocol} = this.getConfig();
        let uploadList = getUploadList(src, des);
        logger.info(`开始上传，上传参数为：`, JSON.stringify(this.getConfig(), null, 4));
        logger.info(`上传列表为：`, JSON.stringify(uploadList, null, 4));
        let protocolClass = {
            sftp: SftpUpload,
            ftp: FtpUpload
        }
        if (!protocolClass[protocol]) {
            return '不支持该上传协议';
        }
        let client = new protocolClass[protocol](this.getConfig());
        client.upload(uploadList);
    }
}