import store from './index'
import router from '../router/index'

let ipcRenderer = {};
let routerNmae = '';
let getCoinbase = null;
let getSyncingState = null;
let getBlockNumber = null;
let pollTimer;
if (window.require) {
    ipcRenderer = window.require('electron').ipcRenderer
};

router.beforeEach((to, from, next) => {
    ipcRenderer.send('getCoinbase');
    next();
    routerNmae = to.name;
});

var routerReplace = {
    'common' : [
        'getBalance',
        'voteSurplusBlock',
        'getBlockNumber',
        'getSyncing',
    ],
    'index' : [
        'getVoterFreeze',
        'getFreeze',
        'getPeerCount',
        'getLastTexts',
        'getLastTextsOfficial',
        'getLastTxs',
    ],
    'transfer' : [
        'getGasPrice'
    ],
    'tradeDetail' : [
        'getLastTxs'
    ],
    'news' : [
        'getGasPrice'
    ],
    'mining' : [
        'getVoterFreeze',
        'checkSuperProducer',
        'checkProducer',
        'getVoting',
        'mining',
        'getVoterState',
        'upVoteRound',
        'getBlockReward',
        'round',
    ],
    'system' : [
        'getNetwork',
        'version',
        'packageVersion',
    ]
};

function pollEvent(eventName, keyName) {
    // console.log(eventName, keyName);
    ipcRenderer.on(eventName, (event, res) => {
        // console.log(eventName);
        if(getCoinbase && !getSyncingState){
            if(keyName == routerNmae || keyName == 'common'){
                if(!window[eventName + 'TimeOut']){
                    window[eventName + 'TimeOut'] = setTimeout(function (){
                        // console.log(eventName, keyName);
                        window[eventName + 'TimeOut'] = null;
                        ipcRenderer.send(eventName);
                    }, 1000);
                };
            };
        };
    });
}

function pollDelJs(name){
    for(let keyName in routerReplace){
        routerReplace[keyName].forEach(eventName => {
            pollEvent(eventName, keyName);
        });
    };
};

pollDelJs();


/**
 * 发送 send 到 ipcMain，建立进程通讯
 */
ipcRenderer.send('web-load');

/**
 * deld.exe 启动
 */
ipcRenderer.on('delState', (event, res) => {
    store.commit('delState', res);
    ipcRenderer.send('delState', res);
});

/**
 * 当前账户列表
 */
ipcRenderer.on('accounts', (event, res) => {
    store.commit('accounts', res);
});

/**
 * 获取钱包地址
 */
ipcRenderer.on('getCoinbase', (event, res) => {
    if(res){
        store.commit('getCoinbase', res);

        getCoinbase = res;

        ipcRenderer.send('getBalance');
        ipcRenderer.send('voteSurplusBlock');
        ipcRenderer.send('getBlockNumber');
        ipcRenderer.send('getSyncing');

        ipcRenderer.send('getVoterFreeze');
        ipcRenderer.send('getFreeze');
        ipcRenderer.send('getPeerCount');
        ipcRenderer.send('getLastTexts');
        ipcRenderer.send('getLastTextsOfficial');

        ipcRenderer.send('getGasPrice');

        ipcRenderer.send('getLastTxs');

        ipcRenderer.send('checkSuperProducer');
        ipcRenderer.send('checkProducer');
        ipcRenderer.send('getVoting');
        ipcRenderer.send('mining');
        ipcRenderer.send('getVoterState');
        ipcRenderer.send('upVoteRound');
        ipcRenderer.send('getBlockReward');
        ipcRenderer.send('round');

        ipcRenderer.send('getNetwork');
        ipcRenderer.send('version');
        ipcRenderer.send('packageVersion');

    };
});

/**
 * 登录状态
 */
ipcRenderer.on('loginStatus', (event, res) => {
    if(res.err){
        store.commit('loginStatus', false);
        if(res.err == 'lockAccount'){
            store.commit('msg/add', '退出登录成功');
        }else{
            store.commit('msg/err', '登录失败，请检查你的密码。');
        };
    }else{
        store.commit('loginStatus', true);
        store.commit('msg/add', '登录成功');
    };
    // store.commit('sendAccounts');
    // store.commit('sendGetCoinbase');
    ipcRenderer.send('accounts');
    ipcRenderer.send('getCoinbase');
});

/**
 * 退出登录状态
 */
ipcRenderer.on('lockAccount', (event, res) => {
    store.commit('lockAccount');
});

/**
 * 退出登录状态
 */
ipcRenderer.on('lockAccountState', (event, res) => {
    store.commit('lockAccountState', res);
});

/**
 * 导出钱包
 */
ipcRenderer.on('exportRawKey', (event, res) => {
    store.commit('exportRawKey', true);
});

/**
 * 导出钱包状态
 */
ipcRenderer.on('exportRawKeyState', (event, res) => {
    store.commit('exportRawKeyState', res);
});

/**
 * 获取钱包地址
 */
ipcRenderer.on('getCoinbase', (event, res) => {
    store.commit('getCoinbase', res);
});

/**
 * 可用余额
 */
ipcRenderer.on('getBalance', (event, res) => {
    store.commit('getBalance', res);
});

/**
 * 投票锁定
 */
ipcRenderer.on('getVoterFreeze', (event, res) => {
    store.commit('getVoterFreeze', res);
});

/**
 * 总锁定
 */
ipcRenderer.on('getFreeze', (event, res) => {
    store.commit('getFreeze', res);
});

/**
 * 本轮投票剩余剩余区块
 */
ipcRenderer.on('voteSurplusBlock', (event, res) => {
    store.commit('voteSurplusBlock', res);
});

/**
 * 本轮投票剩余剩余区块
 */
ipcRenderer.on('getLastTxs', (event, res) => {
    store.commit('getLastTxs', res);
});

/**
 * 返回当前区块号
 */
ipcRenderer.on('getBlockNumber', (event, res) => {
    getBlockNumber = res;
    store.commit('getBlockNumber', res);
});

/**
 * 连接节点数
 */
ipcRenderer.on('getPeerCount', (event, res) => {
    store.commit('getPeerCount', res);
});

/**
 * 这个属性是只读的。如果正在同步，返回同步对象。否则返回false。
 * startingBlock：Number - 同步开始区块号
 * currentBlock: Number - 节点当前正在同步的区块号
 * highestBlock: Number - 预估要同步到的区块
 */
ipcRenderer.on('getSyncing', (event, res) => {
    store.commit('getSyncing', res);
    if(res && getBlockNumber < res.highestBlock){
        getBlockNumber = res.highestBlock;
        store.commit('getBlockNumber', getBlockNumber);
    };
    if(res && (res.highestBlock - res.currentBlock) > 250){
        store.commit('getSyncingState', true);
        getSyncingState = true;
        router.push('/index');
        setTimeout(function (){
            ipcRenderer.send('getSyncing');
        }, 1000);
    }else{
        if(getSyncingState){
            getSyncingState = false;
            ipcRenderer.send('getBlockNumber');
            ipcRenderer.send('getCoinbase');
            store.commit('getSyncingState', false);
        };
    }
});

/**
 * 返回当前的gasPrice价格。这个值由最近几个块的gas价格的中值6决定。
 */
ipcRenderer.on('getGasPrice', (event, res) => {
    store.commit('getGasPrice', res);
});

/**
 * 返回当前的gasPrice价格。用来显示给用户看
 */
ipcRenderer.on('getGasPriceView', (event, res) => {
    store.commit('getGasPriceView', res);
});


/**
 * 发送一个交易到网络。
 */
ipcRenderer.on('sendTransaction', (event, res) => {
    // store.commit('sendTransaction', res);
});

/**
 * 返回交易hash
 */
ipcRenderer.on('sendTransactionState', (event, res) => {
    if(res && res.res){
        store.commit('msg/add', '转账成功');
    }else{
        if(res.err){
            store.commit('msg/err', res.err);
        }else{
            store.commit('msg/err', '转账失败');
        };
    };
    store.commit('sendTransactionState', res.res);
});

/**
 * 检查超级节点激活状态
 */
ipcRenderer.on('checkSuperProducer', (event, res) => {
    store.commit('checkSuperProducer', res);
});

/**
 * 主节点激活状态
 */
ipcRenderer.on('checkProducer', (event, res) => {
    store.commit('checkProducer', res);
});

/**
 * 投票激活状态
 */
ipcRenderer.on('getVoting', (event, res) => {
    store.commit('getVoting', res);
});

/**
 * 挖矿状态
 */
ipcRenderer.on('mining', (event, res) => {
    store.commit('mining', res);
});

/**
 * 是否投票給自己
 */
ipcRenderer.on('producerMining', (event, res) => {
    store.commit('producerMining', res);
});

/**
 *  重启开启挖矿
 */
ipcRenderer.on('minerReset', (event, res) => {
    store.commit('minerReset');
});

/**
 * 开启挖矿成功
 */
ipcRenderer.on('minerStart', (event, res) => {
    store.commit('miningState', false);
});

/**
 * 关闭挖矿成功
 */
ipcRenderer.on('minerStop', (event, res) => {
    store.commit('miningState', false);
});

/**
 * 本轮投票数据
 */
ipcRenderer.on('getVoterState', (event, res) => {
    store.commit('getVoterState', res);
});

/**
 * 当前第几轮
 */
ipcRenderer.on('round', (event, res) => {
    store.commit('round', res);
});

/**
 * 上轮投票数据
 */
ipcRenderer.on('upVoteRound', (event, res) => {
    store.commit('upVoteRound', res);
});

/**
 * 投票收益记录
 */
ipcRenderer.on('getBlockReward', (event, res) => {
    store.commit('getBlockReward', res);
});

/**
 * 发送简讯
 */
ipcRenderer.on('sendText', (event, res) => {
    // store.commit('sendText', res);
});

/**
 * 发送简讯返回成功状态
 */
ipcRenderer.on('sendTextState', (event, res) => {
    if(res && res.res){
        store.commit('msg/add', '简讯发送成功');
    }else{
        if(res.err){
            store.commit('msg/err', res.err);
        }else{
            store.commit('msg/err', '简讯发送失败');
        };
    };
    store.commit('sendTextState', res.res);
});

/**
 * 网络协议版本
 */
ipcRenderer.on('getNetwork', (event, res) => {
    store.commit('getNetwork', res);
});

/**
 * 网络协议版本
 */
ipcRenderer.on('version', (event, res) => {
    store.commit('version', res);
});

/**
 * 钱包客户端版本号
 */
ipcRenderer.on('packageVersion', (event, res) => {
    store.commit('packageVersion', res);
});

/**
 * 我的动态
 */
ipcRenderer.on('getLastTexts', (event, res) => {
    store.commit('getLastTexts', res);
});

/**
 * 我的社区
 */
ipcRenderer.on('getLastTextsOfficial', (event, res) => {
    store.commit('getLastTextsOfficial', res);
});

/**
 * 复制
 */
ipcRenderer.on('copyState', (event, res) => {
    store.commit('copyState', res);
});

/**
 * 自动更新状态
 */
ipcRenderer.on('updateStatus', (event, res) => {
    store.commit('updateStatus', res);
});

/**
 * 自动更新下载状态
 */
ipcRenderer.on('updateProgress', (event, res) => {
    store.commit('updateProgress', res);
});


export default ipcRenderer;







