#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');
const { sftpUplFile, sftpUplDir } = require('./sftp');
const { ftpUplFile, ftpUplDir } = require('./ftp');

let myhost = {
    host: '47.56.223.228',
    port: 22,
    username: 'root',
    password: '2020@host'
};

!function run (argv) {
    if (argv.v || argv.version) {
        console.log('miniupl version is 0.1.0');
    } else if (argv.h || argv.help) {
        console.log('usage:');
        console.log('-v --version [show version]')
    } else {
        let host = {
            host: argv.host || argv.h || '',
            port: argv.port || argv.p || '21',
            username: argv.usr || argv.u || 'root',
            password: argv.pwd || '',
        };

        let localPath = argv.src,
            remotePath = argv.des;
        let currentPath = process.cwd();
        if (!localPath) {
            console.log('缺少本地路径！');
            return;
        }
        if (!remotePath) {
            console.log('缺少远程路径！');
            return;
        }

        if (argv.r) {
            argv.s ?
            sftpUplDir(host, path.join(currentPath, localPath), remotePath) :
            ftpUplDir(host, path.join(currentPath, localPath), remotePath);
        } else {
            argv.s ?
            sftpUplFile(host, path.join(currentPath, localPath), remotePath) :
            ftpUplFile(host, path.join(currentPath, localPath), remotePath);
        }
    }
}(minimist(process.argv.slice(2)));


