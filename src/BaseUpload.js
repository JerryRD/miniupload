const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');
const logger = require('../utils/logger');
const {getUploadList} = require('../utils/fileHandler');

module.exports = class BaseUpload {
    constructor(config) {
        this.setHostConfig(config);
        this.emitter = new EventEmitter();
    }

    /**
     * 设置连接参数
     * @param config
     */
    setHostConfig (config) {
        if (!this._checkHostConfigs(config)) {
            this.hostConfig = {};
            return;
        }
        this.hostConfig = {
            host: config.ip,
            port: config.port,
            username: config.username,
            password: config.password,
            sftp: !!config.sftp,
            byParallel: !!config.byParallel,
            src: config.src || '',
            des: config.des || ''
        };
    }

    /**
     * 获取连接参数
     * @returns {{}|{password: *, port: *, host: (string|string), sftp: boolean, byParallel: boolean, username: *}|*}
     */
    getHostConfig () {
        let propertyName = arguments[0];
        if (typeof propertyName === 'string') {
            return this.hostConfig[propertyName];
        }
        return _.cloneDeep(this.hostConfig) || {};
    }

    /**
     * 创建连接器，子类必须实现
     * @private
     */
    _createClient () {}

    /**
     * 连接服务器，子类必须实现
     * @private
     */
    _connectHost () {}

    /**
     * 上传单个文件，子类必须实现
     * @private
     */
    _putSingleFile (client, uploadingFile) {}

    /**
     * 断开连接，子类必须实现
     * @private
     */
    _disconnect () {}

    /**
     * 配置校验，子类必须实现
     * @private
     */
    _checkHostConfigs () {
        return false;
    }

    /**
     * 创建远程目录，子类必须实现
     * @private
     */
    _createRemoteDir() {}

    /**
     * 上传前的参数校验
     * @param file
     * @returns {boolean|string|*}
     * @private
     */
    _shouldUpload (file) {
        return !!file && !!file.src && file.des;
    }

    /**
     * 上传单个文件
     * @param uploadingFile
     * @returns {Promise<boolean|void>}
     * @private
     */
    async _uploadSingleFile (uploadingFile) {
        let uploadClient = this._createClient();
        if (! this._shouldUpload(uploadingFile)) {
            return false;
        }

        let {src, des} = uploadingFile;
        if (! await this._createRemoteDir(uploadClient, des)) {
            return false;
        }

        logger.info(`开始上传 ${src}`);
        this.emitter.emit('singleFileStart', uploadingFile);
        return this._putSingleFile(uploadClient, uploadingFile)
            .then(() => {
                this.emitter.emit('singleFileSuccess', uploadingFile);
                logger.info(`${src} 成功上传至 ${des}`);
            })
            .catch(e => {
                this.emitter.emit('singleFileFaile', e, uploadingFile);
                logger.error(`${src} 上传至 ${des} 失败`, e);
            });
    }

    /**
     * 串行上传
     * @param fileList
     * @returns {Promise<void>}
     * @private
     */
    async _uploadFileListBySerial (fileList) {
        logger.info('开始上传');
        for(let i = 0; i < fileList.length; ++ i) {
            try {
                await this._uploadSingleFile(fileList[i]);
            } catch (e) {
                logger.error(e);
            }
        }
        logger.info('上传已经全部完成');
    }

    /**
     * 并行上传
     * @param fileList
     * @returns {Promise<unknown[]>}
     * @private
     */
    async _uploadFileListByParallel (fileList) {
        logger.info('开始上传');
        return Promise.all(fileList.map(file => {
            return this._uploadSingleFile(file);
        }));
    }

    /**
     * 获取文件上传列表
     * @returns {*[]}
     * @private
     */
    _getUploadList () {
        let {src, des} = this.hostConfig;
        return getUploadList(src, des);
    }

    /**
     * 执行上传
     * @param fileList
     * @returns {Promise<boolean>}
     */
    async upload () {
        let fileList = this._getUploadList();
        logger.info(`开始上传，上传参数为：`, JSON.stringify(this.config, null, 4));
        logger.info(`上传列表为：`, JSON.stringify(fileList, null, 4));

        if (! await this._connectHost()) {
            logger.error('远程服务器连接失败！');
            return false;
        }
        logger.info('远程服务器连接成功！');
        let byParallel = this.getHostConfig('byParallel');
        this.emitter.emit('startUpload', fileList);
        if (byParallel) {
            await this._uploadFileListByParallel(fileList);
        } else {
            await this._uploadFileListBySerial(fileList);
        }
        this.emitter.emit('uploadFinish', fileList);
        await this._disconnect();
    }
}