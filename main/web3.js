const DelJs = require('deljs')
// const Tx = require('ethereumjs-tx');
const {clipboard, ipcMain} = require('electron')

// const {ipcMain} = require('./ipcMain')
const packageConfig = require('../package.json')

const {logger} = require('./log');

let delState;
let delJs;
let sender;
let loginObject;
let coinbase;
let voteRound;
let mining = false;
let miningManual = false;
let producerMining = false;

module.exports.getMining = function (){
    return mining;
};

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
        // console.log(res, 'getAccounts');
        sender.send('accounts', res);
    });
};

let delJsStart = () => {

    if(delJs) return;

    /**
     * setProvider
     * @type {Web3|*}
     */
    delJs = new DelJs();
    delJs.setProvider(new DelJs.providers.HttpProvider('http://127.0.0.1:7001'));

    // delJs.eth.getTransactionCount('0x3b28a24ac49d60658c6170bd4af7ca0ffa03e53a', function (err, nonce){
    //     if (err)  console.log(err, 'nonce');
    //     console.log(nonce, 'nonce');
    //     delJs.eth.estimateGas({
    //         to: '0xa92d6ddd973ec94f0cc3700287cc09c9c148aade',
    //         data: delJs.toHex('签名数据'),
    //     }, (err, estimategas) => {
    //         if (err)  console.log(err, 'estimategas');
    //         console.log(estimategas, 'estimategas');
    //         var rawTx = {
    //             nonce: nonce,
    //             gasLimit: estimategas,
    //             from : '0x3b28a24ac49d60658c6170bd4af7ca0ffa03e53a',
    //             to: '0xa92d6ddd973ec94f0cc3700287cc09c9c148aade',
    //             data: delJs.toHex('签名数据')
    //         }
    //         var tx = new Tx(rawTx);
    //         tx.sign(new Buffer('6de2ba56f488178d1737e427658c5aaedf9c8ff2bec50f97d3a79d86852240e3', 'hex'));
    //         var serializedTx = tx.serialize();
    //         delJs.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    //             if (err)  console.log(err, 'sendRawTransaction err');
    //             console.log(hash, 'sendRawTransaction');
    //         });
    //     });
    // });

    /**
     * 获取钱包地址
     */
    ipcMain.on('getCoinbase', (event, arg) => {
        delJs.eth.getCoinbase((err, res) => {
            if(err){
                logger.error(err);
                return;
            }
            if(coinbase){
                sender.send('getCoinbase', coinbase);
            }else{
                coinbase = res;
                sender.send('getCoinbase', res);
            };
            // console.log(res, 'getCoinbase');
            // delJs.eth.sendTransaction({
            //     from : coinbase,
            //     to : '32a0c7a5a644d421b400c3edea8424b2e440ec1e',
            //     data : '测试 sendTransaction'
            // }, (err, addr) => {
            //     if(err) console.error(err);
            //     console.log(addr, 'sendTransaction');
            // });
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
            if(err){
                logger.error(err);
            }
            loginObject = {err, res};
            sender.send('loginStatus', loginObject);
        });
    });

    /**
     * 导入钱包
     */
    ipcMain.on('importRawKey', (event, arg) => {
        delJs.personal.importRawKey(arg.privateKey, arg.password, (err, res) => {
            if(err){
                logger.error(err);
            }
            loginObject = {err, res};
            sender.send('loginStatus', loginObject);
        });
    });

    /**
     * 导出钱包
     */
    ipcMain.on('exportRawKey', (event, arg) => {
        // console.log(arg, 'exportRawKey');
        delJs.personal.unlockAccount(coinbase, arg, (err, res) => {
            if(err){
                logger.error(err);
            }
            console.log(res, 'exportRawKey');
            try{
                delJs.personal.exportRawKey(coinbase, (err, res) => {
                    // console.log(res, 'exportRawKey');
                    clipboard.writeText(res);
                    sender.send('exportRawKeyState', res);
                });
            }catch (e) {
                console.log(e.message);
                logger.error(e);
            };
        });

    });

    /**
     * 登录
     */
    ipcMain.on('unlockAccount', (event, arg) => {
        delJs.personal.unlockAccount(arg.accounts, arg.password, (err, res) => {
            if(err){
                logger.error(err);
            }
            loginObject = {err, res};
            sender.send('loginStatus', loginObject);
        });
    });

    /**
     * 退出登录
     */
    ipcMain.on('lockAccount', (event, arg) => {
        delJs.personal.lockAccount(coinbase, (err, res) => {
            if(err){
                logger.error(err);
            }
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
            if(err){
                logger.error(err);
            }
            // console.log(viewUnit(res), 'getBalance');
            sender.send('getBalance', viewUnit(res));
        });
    });

    /**
     * 投票锁定
     */
    ipcMain.on('getVoterFreeze', (event, arg) => {
        delJs.eth.getVoterFreeze(coinbase, "latest", (err, res) => {
            if(err){
                logger.error(err);
            }
            sender.send('getVoterFreeze', viewUnit(res));
        });
    });

    /**
     * 总锁定
     */
    ipcMain.on('getFreeze', (event, arg) => {
        delJs.eth.getFreeze(coinbase, "latest", (err, res) => {
            if(err){
                logger.error(err);
            }
            sender.send('getFreeze', viewUnit(res));
        });
    });

    /**
     * 本轮投票剩余剩余区块
     */
    ipcMain.on('voteSurplusBlock', (event, arg) => {
        delJs.eth.getRoundNumberByBlockNumber('latest', (err, round) => {
            if(err){
                logger.error(err);
            }
            // console.log(round);
            sender.send('round', round);
            voteRound = round;
            delJs.eth.getEndBlockNumberByRoundNumber(round, (err, endBlock) => {
                if(err){
                    logger.error(err);
                }
                // console.log(endBlock, 'getEndBlockNumberByRoundNumber');
                sender.send('endBlock', endBlock);
                delJs.eth.getBlockNumber((err, res) => {
                    if(err){
                        logger.error(err);
                    }
                    // console.log(endBlock - res, 'voteSurplusBlock');
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
            if(err){
                logger.error(err);
            }
            if(Array.isArray(res)){
                res.forEach((item) => {
                    item.price = viewUnit(item.price);
                    item.value = viewUnit(item.value);
                });
            };
            // console.log(res, 'getLastTxs');
            sender.send('getLastTxs', res);
        });
    });

    /**
     * 返回当前区块号
     */
    ipcMain.on('getBlockNumber', (event, arg) => {
        delJs.eth.getBlockNumber((err, res) => {
            if(err){
                logger.error(err);
            }
            // console.log(res, 'getBlockNumber');
            sender.send('getBlockNumber', res);
        });
    });

    /**
     * 连接节点数
     */
    ipcMain.on('getPeerCount', (event, arg) => {
        delJs.net.getPeerCount((err, res) => {
            if(err){
                logger.error(err);
            }
            sender.send('getPeerCount', res);
        });
    });

    /**
     * 同步数据
     */
    ipcMain.on('getSyncing', (event, arg) => {
        delJs.eth.getSyncing((err, res) => {
            if(err){
                logger.error(err);
            }
            // console.log(res, 'getSyncing');
            sender.send('getSyncing', res);
        });
    });

    /**
     * 我的动态
     */
    ipcMain.on('getLastTexts', (event, arg) => {
        delJs.eth.getLastTexts(5, [coinbase], (err, res) => {
            if(err){
                logger.error(err);
            }
            // console.log(res, 'getLastTexts');
            sender.send('getLastTexts', res);
        });
    });

    /**
     * 我的社区
     */
    ipcMain.on('getLastTextsOfficial', (event, arg) => {
        delJs.eth.getLastTexts(5, ['0x24aa4f9961078c788c397dd27a71b0c5211c2931'], (err, res) => {
            if(err){
                logger.error(err);
            }
            // console.log(res, 'getLastTextsOfficial');
            sender.send('getLastTextsOfficial', res);
        });
    });

    /**
     * 返回当前的gas价格。这个值由最近几个块的gas价格的中值6决定。
     */
    ipcMain.on('getGasPrice', (event, arg) => {
        delJs.eth.getGasPrice((err, res) => {
            if(err){
                logger.error(err);
            }
            var vPrice = res * 21000;
            sender.send('getGasPriceView', viewUnit(vPrice));
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
            arg.gasPrice = delJs.toWei(arg.gasPrice / 210000, 'ether').replace(/\.[0-9]*/, '');
            // console.log(arg.gasPrice);
        };
        delJs.personal.unlockAccount(coinbase, arg.password, (err, res) => {
            try{
                delete arg.password;
                // console.log(arg);
                delJs.eth.sendTransaction(arg, (err, addr) => {
                    // console.log(addr, 'hash sendTransaction');
                    var msg = null;
                    if(err){
                        msg = err.message;
                        logger.error(err);
                        if(msg && /gas\s\*\sprice\s\+\svalue/.test(msg)){
                            msg = '转账金额大于你的余额';
                        };
                    };
                    sender.send('sendTransactionState', {err : msg, res : addr});
                });
            }catch (e) {
                sender.send('sendTransactionState', {err : e.message, res : null});
                console.log(e.message);
                logger.error(e);
            };
        });
    });

    /**
     * 超级节点状态
     */
    ipcMain.on('checkSuperProducer', (event, arg) => {
        delJs.eth.checkSuperProducer(coinbase, (err, res) => {
            if(err){
                logger.error(err);
            }
            sender.send('checkSuperProducer', res);
        });
    });

    /**
     * 主节点状态
     */
    ipcMain.on('checkProducer', (event, arg) => {
        delJs.eth.checkProducer(coinbase, (err, res) => {
            if(err){
                logger.error(err);
            }
            sender.send('checkProducer', res);
        });
    });

    /**
     *  投票状态
     */
    ipcMain.on('getVoting', (event, arg) => {
        delJs.eth.getVoting((err, res) => {
            if(err){
                logger.error(err);
            }
            // console.log(res, '===========getVoting=========');
            sender.send('getVoting', res);
        });
    });

    /**
     *  挖矿状态
     */
    ipcMain.on('mining', (event, arg) => {
        // console.log('-----------------mining------------------');
        delJs.eth.getMining((err, res) => {
            if(err){
                logger.error(err);
            }
            // console.log(res, 'mining');
            if(miningManual){
                mining = res;
                miningManual = false;
            };
            sender.send('mining', res);
            sender.send('producerMining', producerMining);
        });
    });

    /**
     *  开始挖矿
     */
    ipcMain.on('minerStart', (event, arg) => {
        // console.log(arg);
        delJs.eth.startAutoVote(arg, (err, res) => {
            if(err){
                logger.error(err);
            }
            delJs.miner.start((err, res) => {
                if(err){
                    logger.error(err);
                }
                producerMining = arg.producer ? arg.producer : false;
                // console.log(res, 'start');
                miningManual = true;
                sender.send('minerStart');
            });
        });
    });

    /**
     *  重启开始挖矿
     */
    ipcMain.on('minerReset', (event, arg) => {
        if(producerMining){
            arg.producer = producerMining;
        };
        delJs.eth.startAutoVote(arg, (err, res) => {
            if(err){
                logger.error(err);
            }
            delJs.miner.start((err, res) => {
                if(err){
                    logger.error(err);
                }
            });
        });
    });

    /**
     *  停止挖矿
     */
    ipcMain.on('minerStop', (event, arg) => {
        delJs.eth.stopAutoVote((err, res) => {
            if(err){
                logger.error(err);
            }
            delJs.miner.stop((err, res) => {
                if(err){
                    logger.error(err);
                }
                miningManual = true;
                sender.send('minerStop');
            });
        });
    });

    /**
     *  本轮投票数据
     */
    ipcMain.on('getVoterState', (event, arg) => {
        delJs.eth.getVoterState(coinbase, (err, res) => {
            if(err){
                logger.error(err);
            }
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
        if(voteRound){
            delJs.eth.getBeginBlockNumberByRoundNumber(voteRound - 1, (err, res) => {
                if(err){
                    logger.error(err);
                }
                // console.log(res, 'getBeginBlockNumberByRoundNumber');
                delJs.eth.getVoterState(coinbase, res, (err, res) => {
                    if(err){
                        logger.error(err);
                    }
                    if(res && res.vote){
                        res.vote = viewUnit(res.vote);
                    }
                    sender.send('upVoteRound', res);
                })
            });
        };
    });

    /**
     *  投票收益记录
     */
    ipcMain.on('getBlockReward', (event, arg) => {
        delJs.eth.getBlockReward(30, coinbase, (err, res) => {
            if(err){
                logger.error(err);
            };
            // console.log(res);
            if(Array.isArray(res)){
                res.forEach((item) => {
                    item.block_reward = viewUnit(item.block_reward);
                    item.super_coinbase_reward = viewUnit(item.super_coinbase_reward);
                    item.coinbase_reward = viewUnit(item.coinbase_reward);
                    item.vote_reward = viewUnit(item.vote_reward);
                    item.total = item.block_reward + item.super_coinbase_reward + item.coinbase_reward + item.vote_reward;
                });
            };
            // console.log(res, 'getBlockReward');
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
            if(err){
                logger.error(err);
            }
            try{
                delete arg.password;
                // console.log(arg, 'sendText arg,');
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
                logger.error(e);
            };
        });
    });

    /**
     *  节点的版本信息
     */
    ipcMain.on('version', (event, arg) => {
        delJs.version.getNode((err, res) => {
            if(err){
                logger.error(err);
            }
            sender.send('version', res);
        });
    });

    /**
     *  网络协议版本
     */
    ipcMain.on('getNetwork', (event, arg) => {
        delJs.version.getNetwork((err, res) => {
            if(err){
                logger.error(err);
            }
            sender.send('getNetwork', res);
        });
    });

    /**
     *  钱包客户端版本号
     */
    ipcMain.on('packageVersion', (event, arg) => {
        sender.send('packageVersion', packageConfig.versionWallet);
    });

};

ipcMain.on('delState', (event, arg) => {
    delState = arg;
    if(delState && sender){
        delJsStart();
    };
});

module.exports.delJsStart = delJsStart;
module.exports.delJs = function () {
    return delJs;
};

































