var createDMG = require('electron-installer-dmg');
var path = require('path');
createDMG({
    appPath : path.join(__dirname, "../out/DELWallet-darwin-x64"),
    out : path.join(__dirname, "../out/darwinx-64-setup"),
    background : path.join(__dirname, "../renderer/assets/images/dmg_bg.jpg"),
    icon  : path.join(__dirname, "../renderer/assets/images/icon/128x128.icns"),
    overwrite : true,
    "icon-size" : 128,
}, function done (err) {
    console.log(err);
});