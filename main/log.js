const log4js = require('log4js');
const path = require('path')

log4js.configure({
    appenders: {
        delWallet: {
            type: 'file',
            filename: './logs/delWallet.log' ,
            maxLogSize: 10485760,
        }
    },
    categories: {
        default: {
            appenders: ['delWallet'],
            level: 'all'
        }
    }
});

const logger = log4js.getLogger('delWallet');

module.exports.logger = logger;

