const Client = require('ftp');
const path = require('path');
const BaseUpload = require('./BaseUpload');
const {formatPath} = require('./fileHandler');

class FtpUpload extends BaseUpload {
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
            await client.mkdir(formatPath(dirpath), true,
                (e) => {
                    e && console.log(e);
                }
            );
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async putSingleFile (client, uploadingFile) {
        console.log(`${uploadingFile.src}开始上传`);
        return new Promise((resolve, reject) => {
            try {
                client.put(uploadingFile.src, formatPath(uploadingFile.des),
                    (err) => err ? reject(err) : resolve()
                );
            } catch (e) {
                console.log(e);
            }
        });
    }

    disconnect () {
        this.uploadClient.end();
    }
}

module.exports = FtpUpload;