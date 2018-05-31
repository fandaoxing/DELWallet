const {app, ipcMain} = require("electron");
const fs = require('fs');
const {execFile} = require('child_process')
const delJs = require('./web3')
const path = require('path')
const {logger} = require('./log');
const {getMining} = require('./web3');
const rimraf = require('rimraf');

const isDevMode = process.execPath.match(/[\\/]electron/);
let delD = null;
let delState = false;
let delBanStart = false;

module.exports.setDelBanStart = (state) => {
    delBanStart = state;
};

module.exports.getDelBanStart = () => {
    return delBanStart;
};

let sender;
ipcMain.on('web-load', (event, arg) => {
    sender = event.sender;
    if(delState && sender && sender.send){
        sender.send('delState', delState);
    };
});

let chaindata;
function setDelState(data) {
    logger.info(data);
    if(/database=/.test(data)){
        chaindata = data.match(/database=(.*)\s*cache=/)[1].replace(/\s*/g, '');
        logger.info(chaindata);
        console.log(data.match(/database=(.*)\s*cache=/)[1]);
    };
    if(/database already contains an incompatible genesis block/.test(data)){
        console.log('删除块数据');
        logger.info('删除块数据');
        if(chaindata){
            rimraf(path.join(chaindata), function (err) {
                if(err) {
                    console.log(err)
                    logger.error(err);
                };
                console.log('删除块数据成功');
                logger.info('删除块数据成功');
            });
        };
    };
    if(/http\:\/\/127.0.0.1:7001/.test(data)){
        delState = true;
        logger.info(`delState : ${delState}`);
        console.log(delState, 'delState');
        if(sender && sender.send){
            if(getMining()){
                sender.send('minerReset');
            };
            sender.send('delState', delState);
        }
    };
};

var startNum = 0;

function delStart(){
    startNum ++;
    if(delBanStart){
        console.log('del 正在自动更新禁止自动启动...');
        logger.error('del 正在自动更新禁止自动启动...');
        return false;
    };
    try {
        if(isDevMode){
            delD = execFile(path.join(__dirname, "../deld.exe"), ['--testnet']);
        }else{
            logger.info(path.join(__dirname, "../../app.asar.unpacked/deld.exe"));
            delD = execFile(path.join(__dirname, "../../app.asar.unpacked/deld.exe"), ['--testnet']);
        };
        delD.stdout.on('data', setDelState);
        delD.stderr.on('data', setDelState);
    }catch (e) {
        logger.error(e);
    };

    delD.on('exit', (data) => {
        console.log('================dele.exe exit==================');
        logger.error('================dele.exe exit==================');
        logger.error(data);
        delState = false;
        delD = null
        if(startNum < 10){
            delStart();
        }else{
            // sender.send('delState', '节点重启失败, 钱包退出<br>' + data);
            setTimeout(function (){
                delStart();
                // app.quit();
            }, 3000);
        };
        if(sender  && sender.send){
            // sender.send('delState', delState);
        }
    });
}

module.exports.getDelD = function () {
    return delD;
};
module.exports.delStart = delStart;
