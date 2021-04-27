
const Sftp = require('./src/sftp');
const Ftp = require('./src/ftp');
const logger = require('./utils/logger');

let protocolClass = {
    sftp: Sftp,
    ftp: Ftp
};

class MiniUpl {
    constructor(config) {
        this.config = config || {};
        
        logger.info('初始化上传参数', config);
    }

    upload () {
        let {protocol} = this.config;
        if (!protocolClass[protocol]) {
            return '不支持该上传协议';
        }
        let client = new protocolClass[protocol](this.config);
        client.upload();
    }

    list () {
        
    }
}

module.exports = {
    MiniUpl,
    Ftp,
    Sftp
};
