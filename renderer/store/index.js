import Vue from 'vue';
import Vuex from 'vuex';
import msg from './msg'
import ipcRenderer from './ipcRenderer';

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        appQuit : false,
        appMax : false,
        appMin : false,
        delState : false,
        accounts : [],
        accountsState : false,
        newAccount : '',
        loginStatus : false,
        importRawKey : {},
        unlockAccount : {},
        getCoinbase : '',
        getBalance : '',
        getVoterFreeze : '',
        getFreeze : '',
        voteSurplusBlock : '',
        getBlockNumber : 0,
        getLastTxs : [],
        getPeerCount : '',
        getSyncing : {},
        sendTransaction : null,
        getGasPrice : '',
        sendTransactionState : false,
        checkSuperProducer : false,
        checkProducer : false,
        getVoting : false,
        mining : false,
        setMining : false,
        miningState : false,
        getVoterState : {},
        upVoteRound : {},
        password : '',
        sendTransactionRecord : [],
        round : 0,
        getBlockReward : [],
        sendText : null,
        sendTextState : null,
        version : '',
        packageVersion : '',
        getNetwork : '',
        getLastTexts : [],
        getLastTextsOfficial : [],
        exportRawKey : null,
        exportRawKeyState : null,
        lockAccount : null,
        lockAccountState : null,
        copy : null,
        copyState : null,
        getGasPriceView : null,
        getSyncingState : false,
        minerReset : false,
        sendAccounts : false,
        sendGetCoinbase : false,
        updateStatus : false,
        producerMining : false,
        updateProgress : {},
    },
    getters : {
        password (state){
            return state.password;
        }
    },
    actions : {
    },
    mutations : {
        producerMining (state, param){
            state.producerMining = param;
        },
        updateProgress (state, param){
            state.updateProgress = param;
        },
        updateStatus (state, param){
            state.updateStatus = param;
        },
        sendGetCoinbase (state, param){
            ipcRenderer.send('getCoinbase');
        },
        sendAccounts (state, param){
            ipcRenderer.send('accounts');
        },
        minerReset (state, param){
            ipcRenderer.send('minerReset', {
                voters : state.accounts,
                password : state.password
            });
        },
        getSyncingState (state, param){
            state.getSyncingState = param;
        },
        getGasPriceView (state, param){
            state.getGasPriceView = param;
        },
        copyState (state, param){
            state.copyState = param;
        },
        copy (state, param){
            state.copy = param;
            ipcRenderer.send('copy', param);
        },
        lockAccountState (state, param){
            state.lockAccount = null;
            state.lockAccountState = param;
        },
        lockAccount (state, param){
            state.lockAccount = param;
            ipcRenderer.send('lockAccount');
        },
        exportRawKeyState (state, param){
            state.exportRawKey = null
            state.exportRawKeyState = param;
        },
        exportRawKey (state, param){
            state.exportRawKey = param;
            ipcRenderer.send('exportRawKey', state.password);
        },
        getLastTextsOfficial (state, param){
            state.getLastTextsOfficial = param || [];
        },
        getLastTexts (state, param){
            state.getLastTexts = param || [];
        },
        packageVersion (state, param){
            state.packageVersion = param;
        },
        getNetwork (state, param){
            state.getNetwork = param;
        },
        version (state, param){
            state.version = param;
        },
        sendTextState (state, param){
            state.sendTextState = param;
            state.sendText = null;
        },
        sendText (state, param){
            state.sendText = param;
            ipcRenderer.send('sendText', Object.assign({}, param, {
                password : state.password
            }));
        },
        getBlockReward(state, param){
            state.getBlockReward = param || [];
        },
        upVoteRound(state, param){
            state.upVoteRound = param || {};
        },
        round(state, param){
            state.round = param;
        },
        getVoterState(state, param){
            state.getVoterState = param || {};
        },
        miningState(state, param){
            state.miningState = param;
        },
        mining(state, param){
            state.mining = param;
        },
        setMining(state, param){
            state.setMining = param;
            this.commit('miningState', true);
            //eth.startAutoVote({voters:eth.accounts, password:"123456"})
            if(param.mining){
                var voteParam = {
                    voters : state.accounts,
                    password : state.password
                };
                if(param.producer){
                    voteParam.producer = state.getCoinbase;
                };
                ipcRenderer.send('minerStart', voteParam);
            }else{
                ipcRenderer.send('minerStop');
            }

        },
        password(state, param){
            state.password = param;
        },
        getVoting(state, param){
            state.getVoting = param;
        },
        checkProducer(state, param){
            state.checkProducer = param;
        },
        checkSuperProducer(state, param){
            state.checkSuperProducer = param;
        },
        sendTransactionRecord(state, param){
            state.sendTransactionRecord.push(param);
        },
        sendTransactionState (state, param){
            if(param){
                var sendTransaction = Object.assign({}, state.sendTransaction);
                sendTransaction.hash = param;
                sendTransaction.time = new Date().toLocaleString("zh-Hans-CN",{hour12:false});
                this.commit('sendTransactionRecord', sendTransaction);
            };
            state.sendTransactionState = param;
            state.sendTransaction = null;
        },
        sendTransaction (state, param){
            state.sendTransaction = param;
            ipcRenderer.send('sendTransaction', Object.assign({}, param, {
                password : state.password
            }));
        },
        getGasPrice (state, param){
            state.getGasPrice = param;
        },
        getSyncing (state, param){
            state.getSyncing = param;
        },
        getPeerCount (state, param){
            state.getPeerCount = param;
        },
        getBlockNumber (state, param){
            state.getBlockNumber = param;
        },
        getLastTxs (state, param){
            state.getLastTxs = param || [];
        },
        voteSurplusBlock (state, param){
            state.voteSurplusBlock = param;
        },
        getFreeze (state, param){
            state.getFreeze = param;
        },
        getVoterFreeze (state, param){
            state.getVoterFreeze = param;
        },
        getCoinbase (state, param){
            state.getCoinbase = param;
        },
        getBalance (state, param){
            state.getBalance = param;
        },
        unlockAccount (state, param){
            state.unlockAccount = {
                accounts : state.accounts[0],
                password : param
            };
            ipcRenderer.send('unlockAccount', state.unlockAccount);
        },
        importRawKey (state, param){
            state.importRawKey = param;
            ipcRenderer.send('importRawKey', param);
        },
        newAccount (state, param){
            state.newAccount = param;
            ipcRenderer.send('newAccount', param);
        },
        loginStatus (state, param){
            state.loginStatus = param;
        },
        accounts (state, param){
            if(param && Array.isArray(param) && param.length){
                state.accounts = param;
                state.accountsState = true;
            }else{
                state.accounts = [];
                state.accountsState = false;
            }
        },
        delState (state, param){
            state.delState = param;
        },
        appQuit (state, param){
            ipcRenderer.send('app-quit');
        },
        appMax (state){
            state.appMax = !state.appMax;
            ipcRenderer.send('app-max', state.appMax);
        },
        appMin (state){
            ipcRenderer.send('app-min');
        }
    },
    modules : {
        msg
    },
})
