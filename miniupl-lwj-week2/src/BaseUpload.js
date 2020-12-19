const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');
const path = require('path');
const {formatPath} = require('./fileHandler');

module.exports = class BaseUpload {
    constructor(config) {
        this.setHostConfig(config);
        this.eventEmitter = new EventEmitter();
    }

    createClient () {

    }

    connectHost () {
        return false;
    }

    putSingleFile (client, uploadingFile) {
        return new Promise();
    }

    disconnect () {}

    checkHostConfigs (configs) {
        configs = configs || {};
        let requires = ['ip', 'port'],
            sftpRequires = ['username', 'password'];
        if (configs.sftp) {
            requires = requires.concat(sftpRequires);
        }

        let hasRequires = true;
        requires.forEach(item => {
            hasRequires = hasRequires && !!configs[item];
        });
        return hasRequires;
    }

    setHostConfig (config) {
        if (!this.checkHostConfigs(config)) {
            this.hostConfig = {};
            return;
        }
        this.hostConfig = {
            host: config.ip,
            port: config.port,
            username: config.username,
            password: config.password,
            sftp: !!config.sftp,
            byParallel: !!config.byParallel
        };
    }

    getHostConfig () {
        return _.cloneDeep(this.hostConfig) || {};
    }

    shouldUpload (file) {
        return !!file && !!file.src && file.des;
    }

    // 单文件上传
    async uploadSingleFile (uploadingFile) {
        let uploadClient = this.createClient();
        if (! this.shouldUpload(uploadingFile)) {
            return false;
        }

        console.log()
        if (! await this.createRemoteDir(uploadClient, uploadingFile.des)) {
            return false;
        }

        return this.putSingleFile(uploadClient, uploadingFile)
            .then(() => {
                console.log(`${uploadingFile.src}上传成功`);
            })
            .catch(e => {
                console.log(e);
            });
    }

    // 串行
    async uploadFileListBySerial (fileList) {
        for(let i = 0; i < fileList.length; ++ i) {
            try {
                await this.uploadSingleFile(fileList[i]);
            } catch (e) {
                console.log(e)
            }
        }
    }

    // 并行
    async uploadFileListByParallel (fileList) {
        return Promise.all(fileList.map(file => {
            return this.uploadSingleFile(file);
        }));
    }

    async upload (fileList) {
        if (! await this.connectHost()) {
            console.log('connect failed');
            return false;
        }

        console.log(fileList)
        if (this.getHostConfig().byParallel) {
            await this.uploadFileListByParallel(fileList);
        } else {
            await this.uploadFileListBySerial(fileList);
        }
        await this.disconnect();
    }
}