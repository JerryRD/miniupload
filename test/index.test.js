const {Ftp, MiniUpl} = require('../index');
const defaultConfig = require('../utils/defaults');

describe('MiniUpl ', () => {
    test('constructor', () => {
        const miniUpl = new MiniUpl();
        expect(miniUpl.config).toEqual({});
    });

    test('uploadFtp', async () => {
        const ftpUpl = new Ftp({
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
});