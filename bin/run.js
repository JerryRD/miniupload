#!/usr/bin/env node
const {MiniUpl} = require('../index');
const Ftp = require('../src/ftp');

const { Command } = require('commander');
const program = new Command();

program.version('0.1.0', '-v, -V', '显示当前版本');
program
    .name('miniupl')
    .usage('[options]');

program
    .option('--protocol <protocol>', '使用的上传协议', 'sftp')

    .requiredOption('--ip <ip>', '远程服务器IP，必填')
    .option('--port <port>', '远程端口', '22')
    .option('--usn --username <username>', '用户名', '')
    .option('--pwd --password <password>', '登录密码', '')

    .requiredOption('--src <src>', '源文件或目录的路径，必填', '')
    .requiredOption('--des <des>', '目标路径，必填，只能输入一个', '')
    .requiredOption('--byParallel <byParallel>', '是否并行上传', true)

    .helpOption('-h, --help', '帮助文档');

let sftpArgv = [
    '--ip',
    '47.56.223.228',
    '--usn',
    'root',
    '--pwd',
    '2020@host',
    '--src',
    './bin/*',
    '--des',
    '/root/lwj',
    '--byParallel',
    true
];

let ftpArgv = [
    '--ip',
    '127.0.0.1',
    '--port',
    '21',
    '--src',
    './bin/*',
    '--des',
    '/root/lwj',
    '--byParallel',
    false,
    '--protocol',
    'ftp'
];

program.parse([
    ... process.argv.slice(0, 2),
    // ... sftpArgv
    ... ftpArgv
]);

// program.parse(process.argv);

let {
    protocol,
    ip,
    port,
    username,
    password,
    src,
    des,
    byParallel
} = program;

let params = {
    protocol,
    ip,
    port,
    username,
    password,
    src,
    des,
    byParallel
};

let uploader = new Ftp(params);
uploader.list();