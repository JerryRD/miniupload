const _ = require('lodash');
const path = require('path');
const DEFAULT_CONFIG = {
    sftp: {
        host: '47.56.223.228',
        port: 22,
        username: 'root',
        password: '2020@host',
        sftp: true,
        sync: true
    },
    ftp: {
        host: '127.0.0.1',
        port: 21,
        sftp: false,
        sync: false
    }
};

// check params
function checkConfigs (configs) {
    configs = configs || {};
    let requires = ['ip', 'port', 'src', 'des'],
        sftpRequires = ['username'];
    if (configs.sftp) {
        requires = requires.concat(sftpRequires);
    }

    let hasRequires = true;
    requires.forEach(item => {
        hasRequires = hasRequires && !!configs[item];
    });
    return hasRequires;
}

module.exports = {
    checkConfigs,
    defaultConfig: DEFAULT_CONFIG
};