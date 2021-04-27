
const SfpClient = require('ssh2-sftp-client');
const path = require('path');
const BaseUpload = require('./BaseUpload');
const {formatPath} = require('../utils/fileHandler');
const logger = require('../utils/logger');
class SftpUpload extends BaseUpload {
    constructor(props) {
        super(props);
        this._createClient();
    }

    _createClient () {
        if(!this.uploadClient) {
            this.uploadClient = new SfpClient();
        }
        return this.uploadClient;
    }

    _checkHostConfigs (configs) {
        configs = configs || {};
        let requires = ['ip', 'port', 'username', 'password'];
        let hasRequires = true;
        requires.forEach(item => {
            hasRequires = hasRequires && !!configs[item];
        });
        return hasRequires;
    }

    async _connectHost () {
        let uploadClient = this._createClient(),
            hostName = this.getHostConfig('host');
        try {
            this.emitter.emit('startConnect');
            await uploadClient.connect(this.getHostConfig());
            logger.info(`远程服务器 ${hostName} 连接成功`);
            this.emitter.emit('connectSuccess');
            return true;
        } catch (e) {
            this.emitter.emit('connectFailed');
            logger.error(`远程服务器 ${hostName} 连接失败，退出上传`, e);
            return false;
        }
    }

    async _createRemoteDir (client, remoteDirPath) {
        if (!client) {
            return false;
        }
        let dirpath = path.parse(remoteDirPath).dir;
        try {
            await client.mkdir(formatPath(dirpath), true);
            return true;
        } catch (e) {
            e && logger.error(`远程目录 ${remoteDirPath} 创建失败`, e);
            return false;
        }
    }

    _putSingleFile (client, uploadingFile) {
        let {src, des} = uploadingFile;
        return client.fastPut(src, formatPath(des));
    }

    _disconnect () {
        this.uploadClient.end();
        delete this.uploadClient;
        this.emitter.emit('disconnect');
        logger.info(`远程服务器 ${this.getHostConfig('host')} 连接已断开`);
    }
}

module.exports = SftpUpload;