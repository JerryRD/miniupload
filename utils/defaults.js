const DEFAULT_CONFIG = {
    sftp: {
        ip: '47.56.223.228',
        port: 22,
        username: 'root',
        password: '2020@host',
        byParallel: true,
        src: './bin/*',
        des: '/root/lwj',
        protocol: 'sftp'
    },
    ftp: {
        ip: '127.0.0.1',
        port: 21,
        byParallel: false,
        src: './bin/*',
        des: '/root/lwj',
        protocol: 'ftp'
    }
};

module.exports = DEFAULT_CONFIG;