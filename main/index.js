const {app, BrowserWindow, Tray, Menu} = require("electron");
require('./squirre');
const {enableLiveReload} = require("electron-compile");
const installExtension = require("electron-devtools-installer");
const {VUEJS_DEVTOOLS} = require("electron-devtools-installer");
const path = require('path');

const {setMainWindow} = require('./ipcMain');
const {logger} = require('./log');
const update = require( './update');
const packageConfig = require( '../package.json');
const {trayMainWindow} = require('./tray');
const {delStart} = require( './deld');

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
    try{
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
            icon: path.join(__dirname, "../static/images/icon/128x128.ico"),
        });
    }catch (e) {
        logger.error(e);
    }

    try{
        trayMainWindow(mainWindow);
        setMainWindow(mainWindow);
    }catch (e) {
        logger.error(e);
    }

    try {
        mainWindow.loadURL(isDevMode ? 'http://localhost:8080' : `file://${path.join(__dirname, "../dist/index.html")}`);
    }catch (e) {
        logger.error(e);
    };

    // mainWindow.loadURL(isDevMode ? 'http://localhost:8080' : `file://${path.join(__dirname, "../dist/index.html")}`);
    // mainWindow.loadURL(isDevMode ? 'http://localhost:8080' : `file://${__dirname}/../dist/index.html`);
    // mainWindow.loadURL(isDevMode ? 'http://localhost:8080' : path.join(__dirname, "../dist/index.html"));

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
