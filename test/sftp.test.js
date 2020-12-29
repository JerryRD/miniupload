const Sftp = require('../src/sftp');
const defaultConfig = require('../utils/defaults');
const fileHandler = require('../utils/fileHandler');

describe('Sftp test', () => {
    test('_checkHostConfigs', () => {
        let sftpUpload = new Sftp();
        expect(sftpUpload._checkHostConfigs(defaultConfig.sftp)).toBe(true);
        expect(sftpUpload._checkHostConfigs(defaultConfig.ftp)).toBe(false);
    });

    test('upload', async () => {
        const sftpUpload = new Sftp();
        sftpUpload.setHostConfig(defaultConfig.sftp);
        let {src, des} = defaultConfig.sftp;
        let uploadList =  fileHandler.getUploadList(src, des);
        expect(await sftpUpload.upload(uploadList)).toEqual(void 0);
    });
});