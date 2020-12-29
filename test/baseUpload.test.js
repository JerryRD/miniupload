const BaseUpload = require('../src/BaseUpload');
const defaultConfig = require('../utils/defaults');

describe('BaseUpload test', () => {
    test('hostConfig', () => {
        let baseUpload = new BaseUpload();
        baseUpload.setHostConfig();
        expect(baseUpload.getHostConfig()).toEqual({});
    });
});