const {Ftp} = require('../index');
const defaultConfig = require('../utils/defaults');
const fileHandler = require('../utils/fileHandler');
const logger = require('../utils/logger');

describe('Ftp test', () => {
    test('config', () => {
        const ftpUpload = new Ftp();
        expect(ftpUpload._checkHostConfigs(defaultConfig.ftp)).toBe(true);
        expect(ftpUpload._checkHostConfigs({})).toBe(false);
    });

    test('upload', async () => {
        const ftpUpload = new Ftp();
        ftpUpload.setHostConfig(defaultConfig.ftp);
        let {src, des} = defaultConfig.ftp;
        let uploadList =  fileHandler.getUploadList(src, des);
        logger.info(uploadList);
        expect(await ftpUpload.upload(uploadList)).toEqual(void 0);
    });
});