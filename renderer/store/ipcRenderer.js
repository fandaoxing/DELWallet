import store from './index'

let ipcRenderer = {};
let pollTimer;
if (window.require) {
    ipcRenderer = window.require('electron').ipcRenderer
};
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
        ipcRenderer.send('getBalance');
        ipcRenderer.send('getVoterFreeze');
        ipcRenderer.send('getFreeze');
        ipcRenderer.send('voteSurplusBlock');
        ipcRenderer.send('getLastTxs');
        ipcRenderer.send('getBlockNumber');
        ipcRenderer.send('getPeerCount');
        ipcRenderer.send('getSyncing');
        ipcRenderer.send('getGasPrice');
        ipcRenderer.send('checkSuperProducer');
        ipcRenderer.send('checkProducer');
        ipcRenderer.send('getVoting');
        ipcRenderer.send('mining');

        ipcRenderer.send('getVoterState');
        ipcRenderer.send('round');
        ipcRenderer.send('upVoteRound');
        ipcRenderer.send('getBlockReward');

        ipcRenderer.send('getNetwork');
        ipcRenderer.send('version');
        ipcRenderer.send('packageVersion');
        ipcRenderer.send('getLastTexts');
        ipcRenderer.send('getLastTextsOfficial');
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
    ipcRenderer.send('accounts');
    ipcRenderer.send('getCoinbase');
    if(!pollTimer){
        pollTimer = setInterval(function (){
            ipcRenderer.send('getCoinbase');
        }, 1000);
    };
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
});

/**
 * 返回当前的gas价格。这个值由最近几个块的gas价格的中值6决定。
 */
ipcRenderer.on('getGasPrice', (event, res) => {
    store.commit('getGasPrice', res);
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


export default ipcRenderer;







