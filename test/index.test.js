const MiniUpl = require('../index');
const defaultConfig = require('../utils/defaults');

describe('MiniUpl ', () => {
    test('constructor', () => {
        const miniUpl = new MiniUpl();
        expect(miniUpl.getConfig()).toEqual({});
    });

    test('setConfig', () => {
        const miniUpl = new MiniUpl();
        miniUpl.setConfig();
        expect(miniUpl.getConfig()).toEqual({});

        miniUpl.setConfig(defaultConfig.sftp);
        expect(miniUpl.getConfig()).toEqual(defaultConfig.sftp);
    });


    test('uploadFtp', async () => {
        const ftpUpl = new MiniUpl({
            ip: '127.0.0.1',
            port: 21,
            byParallel: true,
            src: './bin/*',
            des: '/root/lwj',
            protocol: 'ftp'
        });
        let res = await ftpUpl.upload();
        expect(res).toBe(void 0);
    });

    // test('uploadSftp', async () => {
    //     const miniUpl = new MiniUpl({
    //         ip: '47.56.223.228',
    //         port: 22,
    //         username: 'root',
    //         password: '2020@host',
    //         byParallel: true,
    //         src: './bin/*',
    //         des: '/root/lwj',
    //         protocol: 'sftp'
    //     });
    //     let res = await miniUpl.upload();
    //     expect(res).toBe(void 0);
    // });
});