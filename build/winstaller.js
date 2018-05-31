var electronInstaller = require('electron-winstaller');
var path = require('path');
var os = require('os');
const packageConfig = require( '../package.json');

let version = packageConfig.versionWallet;

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: path.join(__dirname, "../out/DELWallet-win32-x64"),
    outputDirectory: path.join(__dirname, "../out/win32-x64-setup-" + version),
    loadingGif: path.join(__dirname, "../static/images/install-load.gif"),
    // exe: 'DELWallet.exe',
    noMsi : true,
    noDelta : true,
    iconUrl: path.join(__dirname, "../static/images/icon/128x128.ico"),
    setupIcon: path.join(__dirname, "../static/images/icon/128x128.ico"),
    skipUpdateIcon: path.join(__dirname, "../static/images/icon/128x128.ico"),
});
console.log('正在进行打包...');
setInterval(function (){
    console.log('测试打包进程是否挂了╮(╯▽╰)╭' + new Date().toString());
}, 5000);
resultPromise.then(() => {
    console.log("It worked!");
    process.exit(1);
}, (e) => {
    console.log(`No dice: ${e.message}`)
    process.exit(1);
});