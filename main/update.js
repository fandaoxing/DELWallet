const os = require('os');
const fs = require('fs');
const path = require('path')
const request = require('request');
const progress = require('request-progress');
const {spawn} = require('child_process');
const {ipcMain } = require('electron');

const {setDelBanStart, getDelD} = require('./deld');
const packageConfig = require( '../package.json');
const {logger} = require('./log');

const isDevMode = process.execPath.match(/[\\/]electron/);

let sender;
ipcMain.on('web-load', (event, arg) => {
    sender = event.sender;
    updateSelf('client', packageConfig.versionWallet).then(res => {
        sender.send('updateStatus', true);
        setDelBanStart(true);
        if(getDelD()){
            var delD = getDelD();
            delD.kill();
        };
    }).catch(rej => {
        console.log(rej);
        sender.send('updateStatus', false);
    });
});

// console.log(os.arch);
// console.log(os.hostname());
// console.log(os.homedir());
const platform = os.platform();

function suffix() {
    return platform == 'win32' ? '.exe' : platform == 'darwin' ? '.dmg' : '';
}

function updateSelf (type, version){
    return new Promise((res, rej) => {
        request('http://del.vroot.win/home/DelWallet/version' + '?' + Date.now(), function (error, response, body) {
            try {
                let data = JSON.parse(body).data;
                if(version != data.version[type].Stable){
                    var name = (type == 'client' ? 'DELWallet.' : 'DELNode.') + data.version[type].Stable + '-' + os.platform() + suffix();
                    let walletUrl = 'http://' + data.host + data.path + 'client/' + data.version[type].Stable + '/' + name;
                    if(data.version[type].StableUrl){
                        walletUrl = data.version[type].StableUrl;
                    };
                    if(type == 'client'){
                        walletDown(walletUrl, name);
                    }else{
                        nodeDown(walletUrl, name);
                    };
                    res(data);
                }else{
                    rej(data);
                };
            }catch (e) {
                console.log(body);
                logger.error(body);
                rej(e);
            };
        });
    });
};

module.exports.updateSelf = updateSelf;

function nodeDown(walletUrl, name) {
    let pathUrl = path.join(__dirname, "../../../Downloads/");
    let fileName = path.join(pathUrl, name);
    console.log(walletUrl);
    fs.mkdir(pathUrl, function (err) {
        fs.unlink(fileName, function (err) {
            progress(request(walletUrl, function (error, response, body) {
                console.log('nodeDown error:', error);
                console.log('nodeDown statusCode:', response && response.statusCode);
                if(!error){
                    fs.copyFile(fileName, path.join(__dirname, "../../../deld.exe"), (err) => {
                        if (err) {
                            console.log(err);
                            logger.error(err);
                        };
                        console.log('deld.exe copy');
                    });
                };
            }), {})
                .on('progress', function (state) {
                    // console.log('progress', state);
                    sender.send('updateProgress', state);
                })
                .on('error', function (err) {
                })
                .on('end', function () {
                })
                .pipe(fs.createWriteStream(fileName));
        });
    });
}

let timeOut = null;
function spawnFile(fileName){
    if(timeOut) return;
    timeOut = setTimeout(() => {
        timeOut = null;
        try {
            spawn(fileName, [], {
                detached : true
            });
        }catch (e) {
            console.log(e);
            logger.error(e);
            spawnFile(fileName);
        };
    }, 1000);
};

function walletDown(walletUrl, name) {
    let pathUrl = path.join(__dirname, "../../../Downloads/");
    let fileName = path.join(pathUrl, name);

    if(platform == 'win32'){
        pathUrl = path.join(os.homedir(), "/Downloads/");
        fileName = path.join(pathUrl, name);
    };
    var progressState = {};
    console.log(walletUrl);
    fs.mkdir(pathUrl, function (err) {
        fs.unlink(fileName, function (err) {
            progress(request(walletUrl, function (error, response, body) {
                console.log('walletDown error:', error);
                console.log('walletDown statusCode:', response && response.statusCode);
                console.log(fileName);
                logger.error('walletDown error:', error);
                logger.error('walletDown statusCode:', response && response.statusCode);
                logger.error(fileName);
                if(error){
                    sender.send('updateStatus', error.message);
                    setDelBanStart(false);
                }else{
                    spawnFile(fileName);
                };
            }), {})
                .on('progress', function (state) {
                    // console.log('progress', state);
                    state.name = name;
                    progressState = state;
                    sender.send('updateProgress', state);
                })
                .on('error', function (err) {
                    sender.send('updateStatus', err.message);
                    setDelBanStart(false);
                })
                .on('end', function () {
                    progressState.percent = 1;
                    progressState.name = name;
                    sender.send('updateProgress', progressState);
                    logger.error('walletDown end :' + fileName);
                    spawnFile(fileName);
                    console.log('walletDown end:' + fileName);
                })
                .pipe(fs.createWriteStream(fileName));
        });
    });
}






