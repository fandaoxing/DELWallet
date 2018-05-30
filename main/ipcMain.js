
import { app, ipcMain , clipboard} from 'electron';

let mainWindow;
// mainWindow.setProgressBar(0.5);

export let sender;

ipcMain.on('web-load', (event, arg) => {
    sender = event.sender;
});

//关闭
ipcMain.on('app-quit', (event, arg) => {
    // app.relaunch();
    app.quit();
});


//最大化
ipcMain.on('app-max', (event, arg) => {
    if(arg){
        mainWindow.maximize();
    }else{
        mainWindow.unmaximize();
    }
});

//最小化
ipcMain.on('app-min', (event, arg) => {
    mainWindow.minimize();
    mainWindow.setSkipTaskbar(true);
});

//复制
ipcMain.on('copy', (event, arg) => {
    clipboard.writeText(arg);
    console.log(arg, '==============================copy=========================');
    sender.send('copyState', arg);
});


export const setMainWindow = (win) => {
    mainWindow = win;
}

export default ipcMain;