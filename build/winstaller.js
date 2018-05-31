var electronInstaller = require('electron-winstaller');
var path = require('path');
resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: path.join(__dirname, "../out/DELWallet-win32-x64"),
    outputDirectory: path.join(__dirname, "../out/install"),
    authors: 'DELWallet',
    exe: 'DELWallet.exe',
    noMsi : true,
    iconUrl: path.join(__dirname, "../renderer/assets/images/icon/128x128.ico"),
    setupIcon: path.join(__dirname, "../renderer/assets/images/icon/128x128.ico"),
    skipUpdateIcon: path.join(__dirname, "../renderer/assets/images/icon/128x128.ico"),
});
console.log('正在进行打包...');
setInterval(function (){
    console.log('测试打包进程是否挂了╮(╯▽╰)╭' + new Date().toString());
}, 5000)
resultPromise.then(() => {
    console.log("It worked!");
    process.exit(1);
}, (e) => console.log(`No dice: ${e.message}`));