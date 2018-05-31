const packager = require('electron-packager');
var path = require('path');
const fs = require('fs');
const {exec} = require('child_process')
console.log('electron-packager');

function packageState(platform, arch, callback){
    packager({
        "dir" : path.join(__dirname, "../"),
        "out" : path.join(__dirname, "../out"),
        "platform": platform,
        "arch": arch,
        "overwrite": true,
        // "asar": true,
        "asar": {
            unpack : 'deld.exe',
        },
        "icon": path.join(__dirname, platform == 'darwin' ? "../static/images/icon/128x128.icns" : '../static/images/icon/128x128.ico'),
        "ignore" : [
            "renderer",
            "logs",
            // "config",
            // "build",
            // "static",
            // "deld.exe",
            ".babelrc",
            ".postcssrc",
            "README.md",
            ".idea",
        ]
    }).then(appPaths => {
        console.log(appPaths);
        // fs.copyFile(path.join(__dirname, "../deld.exe"), path.join(appPaths[0], "./deld.exe"), (err) => {
        //     if (err) console.log(err);
        //     console.log('deld.exe copy');
        // });
    }).catch(err => {
        console.log(err);
    })
};
// packageState('darwin', 'x64');
packageState('win32', 'x64');
// packageState('win32', 'ia32');
// packageState('linux', 'x64');
// packageState('linux', 'ia32');



