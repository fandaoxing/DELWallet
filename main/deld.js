import {app} from "electron";
const fs = require('fs');
import {execFile} from 'child_process'
import ipcMain from './ipcMain'
import delJs from './web3'
import path from 'path'
export let delD = null;
export let delState = false;

let sender;
ipcMain.on('web-load', (event, arg) => {
    sender = event.sender;
    if(delState && sender && sender.send){
        sender.send('delState', delState);
    };
});

// const out = fs.openSync('./' + Date.now() + '.log', 'a');
function setDelState(data) {
    if(/http\:\/\/127.0.0.1:7001/.test(data) && !delState){
        delState = true;
        if(sender && sender.send){
            sender.send('delState', delState);
        }
    };
}
var startNum = 0;

function delStart(){
    startNum ++;
    delD = execFile(path.join(__dirname, "../deld.exe"), ['--testnet']);

    delD.stdout.on('data', setDelState);
    delD.stderr.on('data', setDelState);

    delD.on('close', (data) => {
        delState = false;
        if(startNum < 10){
            delStart();
        }else{
            sender.send('delState', '节点重启失败, 钱包退出<br>' + data);
            setTimeout(function (){
                app.quit();
            }, 3000);
        };
        if(sender  && sender.send){
            sender.send('delState', delState);
        }
    });
}


export default delStart;
