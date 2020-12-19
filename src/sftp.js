'use strict';
const Client = require('ssh2-sftp-client');
const BaseUpload = require('./BaseUpload');
const {formatPath} = require('./fileHandler');
class SftpUpload extends BaseUpload {
    constructor(props) {
        super(props);
        this.createClient();
    }

    createClient () {
        if(!this.uploadClient) {
            this.uploadClient = new Client();
        }
        return this.uploadClient;
    }

    async connectHost () {
        let uploadClient = this.createClient();
        try {
            await uploadClient.connect(this.getHostConfig());
            return true;
        } catch (e) {
            console.error('connect Error!');
            return false;
        }
    }

    async createRemoteDir (client, remoteDirPath) {
        if (!client) {
            return false;
        }
        let dirpath = path.parse(remoteDirPath).dir;
        try {
            await client.mkdir(formatPath(dirpath), true);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }

    putSingleFile (client, uploadingFile) {
        console.log(`${uploadingFile.src}开始上传`);
        return client.fastPut(uploadingFile.src, formatPath(uploadingFile.des));
    }

    disconnect () {
        this.uploadClient.end();
    }
}

module.exports = SftpUpload;