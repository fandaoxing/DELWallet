const {Tray, Menu} = require("electron");
const packageConfig = require('../package.json')
const path = require('path')
const {ipcMain } = require('electron');

let sender;
module.exports.sender = sender;

ipcMain.on('web-load', (event, arg) => {
    sender = event.sender;
});

const appName = packageConfig.name;
let mainWindow;
let tray;

module.exports.trayMainWindow = (win) => {
    mainWindow = win;
    tray = new Tray(path.join(__dirname, "../static/images/icon/128x128.ico"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出登录',
            click (){
                mainWindow.show();
                sender.send('lockAccount')
            }
        },
        {
            label: '导出钱包',
            click (){
                mainWindow.show();
                sender.send('exportRawKey')
            }
        },
        {
            label: '退出钱包',
            role :'quit'
        },
    ]);
    tray.setToolTip(appName);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        // mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
        mainWindow.show();
    });
}