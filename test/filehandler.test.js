const fileHandler = require('../utils/fileHandler');
const {
    formatPath,
    loaclPathExits,
    isDirectory,
    isFile,
    createDirList,
    createGlobList,
    getUploadList
} = fileHandler;

describe('FileHandler test', () => {
    test('formatPath', () => {
        expect(formatPath('\\ss\\ss\\sss.txt')).toBe('/ss/ss/sss.txt');
    });

    test('loaclPathExits', () => {
        expect(loaclPathExits('./utils/fileHandler.js')).toBe(true);
        expect(loaclPathExits('\\ss\\ss\\sss.txt')).toBe(false);
        expect(loaclPathExits('')).toBe(false);
        expect(loaclPathExits()).toBe(false);
    });

    test('isDirectory', () => {
        expect(isDirectory('./test')).toBe(true);
        expect(isDirectory('./src')).toBe(true);
        expect(isDirectory('')).toBe(false);
        expect(isDirectory('./tttt')).toBe(false);
        expect(isDirectory('./src/fileHandler')).toBe(false);
    });

    test('isFile', () => {
        expect(isFile('./utils/fileHandler.js')).toBe(true);
        expect(isFile('./index.js')).toBe(true);
        expect(isFile('./test')).toBe(false);
        expect(isFile('')).toBe(false);
        expect(isFile('../test.txt')).toBe(false);
        expect(isFile('./src')).toBe(false);
    });

    const paths = [
        { src: 'E:/00_dev/miniupl/bin/run.js',
        des: '\\root\\lwj\\run.js' },
        { src: 'E:/00_dev/miniupl/bin/run.js',
            des: '/root/lwj/run.js' },
        { src: 'E:/00_dev/miniupl/bin/test/testupl.txt',
            des: '/root/lwj/test/testupl.txt' },
        { src: 'E:/00_dev/miniupl/bin/test/tttt/qqqq/qqq.js',
            des: '/root/lwj/test/tttt/qqqq/qqq.js' },
        { src: 'E:/00_dev/miniupl/bin/test/tttt/ttt.txt',
            des: '/root/lwj/test/tttt/ttt.txt' },
        { src: 'E:/00_dev/miniupl/bin/test/uuu.html',
            des: '/root/lwj/test/uuu.html' }
    ];

    test('getUploadList', () => {
        expect(getUploadList('./bin/*', '/root/lwj'))
            .toEqual(paths);
    });

});
