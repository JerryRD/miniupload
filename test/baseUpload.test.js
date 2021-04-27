const BaseUpload = require('../src/BaseUpload');

describe('BaseUpload test', () => {
    test('hostConfig', () => {
        let baseUpload = new BaseUpload();
        baseUpload.setHostConfig();
        expect(baseUpload.getHostConfig()).toEqual({});
    });
});