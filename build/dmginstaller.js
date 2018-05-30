var createDMG = require('electron-installer-dmg');
var path = require('path');
createDMG({
    background : path.join(__dirname, "../renderer/assets/images/dmg_bg.jpg"),
    icon  : path.join(__dirname, "../renderer/assets/images/icon/128x128.ico"),
    overwrite : true,
    "icon-size" : 128,
}, function done (err) {

});