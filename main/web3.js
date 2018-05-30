import DelJs from 'deljs'
import ipcMain from './ipcMain'
import packageConfig from '../package.json'
import {clipboard} from 'electron'

let delState;
let delJs;
let sender;
let loginObject;
let coinbase;
let voteRound;
let accountsPassword;

let ipcMainSend;
sender = {};
sender.send = function (event, param){
    if(ipcMainSend && ipcMainSend.send){
        try{
            ipcMainSend.send(event, param);
        }catch (e) {
            console.error(e.message, 'ipcMainSend send');
        }
    }
};

/**
 * 第一次建立通讯，拿到 event.sender， 发送消息到渲染进程
 */
ipcMain.on('web-load', (event, arg) => {
    ipcMainSend = event.sender;
    if(loginObject){
        sender.send('packageVersion', packageConfig.version);
        sender.send('loginStatus', loginObject);
    };
    if(delState && sender){
        delJsStart();
    };
});

/**
 * 以太坊单位转换为 ether
 * @param res
 * @returns {string}
 */
let viewUnit = res => {
    var str = Number.parseFloat(delJs.fromWei(res, 'ether').toString());
    if(/\e/.test(str)){
        return str.toLocaleString('hanidec', {minimumFractionDigits : 8}).replace(/\,/g, '');
    }else{
        return str;
    };

};

/**
 * 获取账户列表
 */
let getAccounts = () => {
    delJs.eth.getAccounts((err, res) => {
        if(err) return;
        console.log(res, 'getAccounts');
        sender.send('accounts', res);
    });
};

export let delJsStart = () => {

    if(delJs) return;

    /**
     * setProvider
     * @type {Web3|*}
     */
    delJs = new DelJs();
    delJs.setProvider(new DelJs.providers.HttpProvider('http://127.0.0.1:7001'));

    /**
     * 获取钱包地址
     */
    ipcMain.on('getCoinbase', (event, arg) => {
        delJs.eth.getCoinbase((err, res) => {
            if(err){
                console.log(err, 'getCoinbase Err');
                return;
            }
            if(coinbase){
                sender.send('getCoinbase', coinbase);
            }else{
                coinbase = res;
                sender.send('getCoinbase', res);
            };
            console.log(res, 'getCoinbase');
        });
    });

    /**
     * 获取账户列表
     */
    ipcMain.on('accounts', (event, arg) => {
        getAccounts();
    });
    getAccounts();

    /**
     * 设置密码
     */
    ipcMain.on('newAccount', (event, arg) => {
        delJs.personal.newAccount(arg, (err, res) => {
            loginObject = {err, res};
            sender.send('loginStatus', loginObject);
        });
    });

    /**
     * 导入钱包
     */
    ipcMain.on('importRawKey', (event, arg) => {
        delJs.personal.importRawKey(arg.privateKey, arg.password, (err, res) => {
            loginObject = {err, res};
            sender.send('loginStatus', loginObject);
        });
    });

    /**
     * 导出钱包
     */
    ipcMain.on('exportRawKey', (event, arg) => {
        console.log(arg, 'exportRawKey');
        delJs.personal.unlockAccount(coinbase, arg, (err, res) => {
            console.log(res, 'exportRawKey');
            try{
                delJs.personal.exportRawKey(coinbase, (err, res) => {
                    console.log(res, 'exportRawKey');
                    clipboard.writeText(res);
                    sender.send('exportRawKeyState', res);
                });
            }catch (e) {
                console.log(e.message);
            };
        });

    });

    /**
     * 登录
     */
    ipcMain.on('unlockAccount', (event, arg) => {
        delJs.personal.unlockAccount(arg.accounts, arg.password, (err, res) => {
            loginObject = {err, res};
            sender.send('loginStatus', loginObject);
        });
    });

    /**
     * 退出登录
     */
    ipcMain.on('lockAccount', (event, arg) => {
        delJs.personal.lockAccount(coinbase, (err, res) => {
            loginObject = {err : 'lockAccount', res};
            sender.send('loginStatus', loginObject);
            sender.send('lockAccountState', res);
        });
    });

    /**
     * 可用余额
     */
    ipcMain.on('getBalance', (event, arg) => {
        delJs.eth.getBalance(coinbase, "latest", (err, res) => {
            console.log(viewUnit(res), 'getBalance');
            sender.send('getBalance', viewUnit(res));
        });
    });

    /**
     * 投票锁定
     */
    ipcMain.on('getVoterFreeze', (event, arg) => {
        delJs.eth.getVoterFreeze(coinbase, "latest", (err, res) => {
            sender.send('getVoterFreeze', viewUnit(res));
        });
    });

    /**
     * 总锁定
     */
    ipcMain.on('getFreeze', (event, arg) => {
        delJs.eth.getFreeze(coinbase, "latest", (err, res) => {
            sender.send('getFreeze', viewUnit(res));
        });
    });

    /**
     * 本轮投票剩余剩余区块
     */
    ipcMain.on('voteSurplusBlock', (event, arg) => {
        delJs.eth.getRoundNumberByBlockNumber('latest', (err, round) => {
            // console.log(round);
            sender.send('round', round);
            voteRound = round;
            delJs.eth.getEndBlockNumberByRoundNumber(round, (err, endBlock) => {
                // console.log(endBlock, 'getEndBlockNumberByRoundNumber');
                sender.send('endBlock', endBlock);
                delJs.eth.getBlockNumber((err, res) => {
                    console.log(endBlock - res, 'voteSurplusBlock');
                    sender.send('voteSurplusBlock', endBlock - res);
                })
            })
        });
    });

    /**
     * 最近交易
     */
    ipcMain.on('getLastTxs', (event, arg) => {
        delJs.eth.getLastTxs(30, [coinbase], (err, res) => {
            // console.log(res, 'getLastTxs');
            if(Array.isArray(res)){
                res.forEach((item) => {
                    item.price = viewUnit(item.price);
                    item.value = viewUnit(item.value);
                });
            };
            sender.send('getLastTxs', res);
        });
    });

    /**
     * 返回当前区块号
     */
    ipcMain.on('getBlockNumber', (event, arg) => {
        delJs.eth.getBlockNumber((err, res) => {
            console.log(res, 'getBlockNumber');
            sender.send('getBlockNumber', res);
        });
    });

    /**
     * 连接节点数
     */
    ipcMain.on('getPeerCount', (event, arg) => {
        delJs.net.getPeerCount((err, res) => {
            sender.send('getPeerCount', res);
        });
    });

    /**
     * 同步数据
     */
    ipcMain.on('getSyncing', (event, arg) => {
        delJs.eth.getSyncing((err, res) => {
            sender.send('getSyncing', res);
        });
    });

    /**
     * 我的动态
     */
    ipcMain.on('getLastTexts', (event, arg) => {
        delJs.eth.getLastTexts(5, [coinbase], (err, res) => {
            console.log(res, 'getLastTexts');
            sender.send('getLastTexts', res);
        });
    });

    /**
     * 我的社区
     */
    ipcMain.on('getLastTextsOfficial', (event, arg) => {
        delJs.eth.getLastTexts(5, ['0x24aa4f9961078c788c397dd27a71b0c5211c2931'], (err, res) => {
            console.log(res, 'getLastTextsOfficial');
            sender.send('getLastTextsOfficial', res);
        });
    });

    /**
     * 返回当前的gas价格。这个值由最近几个块的gas价格的中值6决定。
     */
    ipcMain.on('getGasPrice', (event, arg) => {
        delJs.eth.getGasPrice((err, res) => {
            sender.send('getGasPrice', viewUnit(res));
        });
    });

    /**
     * 发送一个交易到网络。
     */
    ipcMain.on('sendTransaction', (event, arg) => {
        arg.from = coinbase;
        arg.value = delJs.toWei(arg.value, 'ether');
        if(arg.gasPrice){
            arg.gasPrice = delJs.toWei(arg.gasPrice, 'ether');
        };
        delJs.personal.unlockAccount(coinbase, arg.password, (err, res) => {
            try{
                delete arg.password;
                console.log(arg);
                delJs.eth.sendTransaction(arg, (err, addr) => {
                    console.log(addr, 'hash sendTransaction');
                    var msg = null;
                    if(err){
                        msg = err.message;
                        if(msg && /gas\s\*\sprice\s\+\svalue/.test(msg)){
                            msg = '转账金额大于你的余额';
                        };
                    };
                    sender.send('sendTransactionState', {err : msg, res : addr});
                });
            }catch (e) {
                sender.send('sendTransactionState', {err : e.message, res : null});
                console.log(e.message);
            };
        });
    });

    /**
     * 超级节点状态
     */
    ipcMain.on('checkSuperProducer', (event, arg) => {
        delJs.eth.checkSuperProducer(coinbase, (err, res) => {
            sender.send('checkSuperProducer', res);
        });
    });

    /**
     * 主节点状态
     */
    ipcMain.on('checkProducer', (event, arg) => {
        delJs.eth.checkProducer(coinbase, (err, res) => {
            sender.send('checkProducer', res);
        });
    });

    /**
     *  投票状态
     */
    ipcMain.on('getVoting', (event, arg) => {
        delJs.eth.getVoting((err, res) => {
            sender.send('getVoting', res);
        });
    });

    /**
     *  挖矿状态
     */
    ipcMain.on('mining', (event, arg) => {
        delJs.eth.getMining((err, res) => {
            console.log(res, 'mining');
            sender.send('mining', res);
        });
    });

    /**
     *  开始挖矿
     */
    ipcMain.on('minerStart', (event, arg) => {
        console.log(arg);
        delJs.eth.startAutoVote(arg, (err, res) => {
            delJs.miner.start((err, res) => {
                console.log(res, 'start');
                sender.send('minerStart');
            });
        });
    });

    /**
     *  停止挖矿
     */
    ipcMain.on('minerStop', (event, arg) => {
        delJs.eth.stopAutoVote((err, res) => {
            delJs.miner.stop((err, res) => {
                sender.send('minerStop');
            });
        });
    });

    /**
     *  本轮投票数据
     */
    ipcMain.on('getVoterState', (event, arg) => {
        delJs.eth.getVoterState(coinbase, (err, res) => {
            if(res && res.vote){
                res.vote = viewUnit(res.vote);
            }
            sender.send('getVoterState', res);
        });
    });

    /**
     *  上轮投票数据
     */
    ipcMain.on('upVoteRound', (event, arg) => {
        delJs.eth.getBeginBlockNumberByRoundNumber(voteRound - 1, (err, res) => {
            delJs.eth.getVoterState(coinbase, res, (err, res) => {
                if(res && res.vote){
                    res.vote = viewUnit(res.vote);
                }
                sender.send('upVoteRound', res);
            })
        });
    });

    /**
     *  投票收益记录
     */
    ipcMain.on('getBlockReward', (event, arg) => {
        delJs.eth.getBlockReward(30, coinbase, (err, res) => {
            if(Array.isArray(res)){
                res.forEach((item) => {
                    item.block_reward = viewUnit(item.block_reward);
                    item.super_coinbase_reward = viewUnit(item.super_coinbase_reward);
                    item.coinbase_reward = viewUnit(item.coinbase_reward);
                    item.vote_reward = viewUnit(item.vote_reward);
                    item.total = item.block_reward + item.super_coinbase_reward + item.coinbase_reward + item.vote_reward;
                });
            };
            console.log(res, 'getBlockReward');
            sender.send('getBlockReward', res);
        });
    });

    /**
     *  发送简讯
     */
    ipcMain.on('sendText', (event, arg) => {
        arg.from = coinbase;
        if(arg.gasPrice){
            arg.gasPrice = delJs.toWei(arg.gasPrice, 'ether');
        };
        delJs.personal.unlockAccount(coinbase, arg.password, (err, res) => {
            try{
                delete arg.password;
                console.log(arg, 'sendText arg,');
                delJs.eth.sendText(arg, (err, addr) => {
                    if(err) console.error(err);
                    var msg = null;
                    if(err){
                        msg = err.message;
                        if(msg && /gas\s\*\sprice\s\+\svalue/.test(msg)){
                            msg = '转账金额大于你的余额';
                        };
                    };
                    console.log(addr, 'sendText addr -----------------------------------------');
                    sender.send('sendTextState', {err : msg, res : addr});
                });
            }catch (e) {
                console.log(e.message);
            };
        });
    });

    /**
     *  节点的版本信息
     */
    ipcMain.on('version', (event, arg) => {
        delJs.version.getNode((err, res) => {
            sender.send('version', res);
        });
    });

    /**
     *  网络协议版本
     */
    ipcMain.on('getNetwork', (event, arg) => {
        delJs.version.getNetwork((err, res) => {
            sender.send('getNetwork', res);
        });
    });

    /**
     *  钱包客户端版本号
     */
    ipcMain.on('packageVersion', (event, arg) => {
        sender.send('packageVersion', packageConfig.version);
    });

};

ipcMain.on('delState', (event, arg) => {
    delState = arg;
    if(delState && sender){
        delJsStart();
    };
});

export default DelJs;

































