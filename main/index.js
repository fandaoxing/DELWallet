import {app, BrowserWindow, Tray, Menu} from "electron";
require('./squirre');
import {enableLiveReload} from "electron-compile";
import installExtension, {VUEJS_DEVTOOLS} from "electron-devtools-installer";
import path from 'path'
import packageConfig from '../package.json'
import {trayMainWindow} from './tray'
import ipcMain, {setMainWindow} from './ipcMain'
import delStart from './deld'

let mainWindow;

/**
 * 判断重复打开
 * @type {boolean}
 */
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus()
    }
});
if (isSecondInstance) {
    app.quit();
}

const appName = packageConfig.name;
app.setName(appName);

const isDevMode = process.execPath.match(/[\\/]electron/);
// const isDevMode = true;

if (isDevMode) {
    enableLiveReload();
}

/**
 *  执行启动 delStart
 */
delStart();

const createWindow = async () => {

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        minWidth : 1024,
        minHeight : 680,
        skipTaskbar : false,
        focusable : true,
        title : appName,
        frame: false,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#323c6d',
        icon: path.join(__dirname, "../renderer/assets/images/icon/128x128.ico"),
    });

    setMainWindow(mainWindow);
    trayMainWindow(mainWindow);

    mainWindow.loadURL(isDevMode ? 'http://localhost:8080' : `file://${__dirname}/../dist/index.html`);


    if (isDevMode) {
        await installExtension(VUEJS_DEVTOOLS);
        // mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};



app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
