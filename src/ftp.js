
const FtpClient = require('ftp');
const path = require('path');
const BaseUpload = require('./BaseUpload');
const {formatPath} = require('../utils/fileHandler');
const logger = require('../utils/logger');

class FtpUpload extends BaseUpload {
    constructor(props) {
        super(props);
        this._createClient();
    }

    list () {
        this.uploadClient.list('/', function(err, list) {
            if (err) throw err;
            console.dir(list);
            c.end();
          });
    }

    _createClient () {
        if(!this.uploadClient) {
            this.uploadClient = new FtpClient();
        }
        return this.uploadClient;
    }

    _checkHostConfigs (configs) {
        configs = configs || {};
        let requires = ['ip', 'port'];
        let hasRequires = true;
        requires.forEach(item => {
            hasRequires = hasRequires && !!configs[item];
        });
        return hasRequires;
    }

    async _connectHost () {
        let uploadClient = this._createClient();
        try {
            this.emitter.emit('startConnect');
            await uploadClient.connect(this.getHostConfig());
            this.emitter.emit('connectSuccess');
            return true;
        } catch (e) {
            e && logger.error(`远程服务器 ${this.getHostConfig('host')} 连接失败`, e);
            this.emitter.emit('connectFailed');
            return false;
        }
    }

    async _createRemoteDir (client, remoteDirPath) {
        if (!client) {
            return false;
        }
        let dirpath = path.parse(remoteDirPath).dir;
        await client.mkdir(formatPath(dirpath), true,
            (e) => {
                e && logger.error(`远程目录 ${remoteDirPath} 创建失败`, e);
            }
        );
        return true;
    }

    async _putSingleFile (client, uploadingFile) {
        return new Promise((resolve, reject) => {
            client.put(
                uploadingFile.src,
                formatPath(uploadingFile.des),
                (err) => err ? reject(err) : resolve()
            );
        });
    }

    _disconnect () {
        this.uploadClient.end();
        delete this.uploadClient;
        this.emitter.emit('disconnect');
        logger.info(`远程服务器 ${this.getHostConfig('host')} 连接已断开`);
    }
}

module.exports = FtpUpload;