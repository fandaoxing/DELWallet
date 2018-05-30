
const state = {
    msg : [],
    msgKey : [],
    msgText : [],
};

const getters = {

};

const actions = {

};

const mutations = {
    addDel (state, param){
        setTimeout(() => {
            this.commit('msg/del', param.id);
        }, param.time || 3500);
    },
    err (state, param){
        if(typeof param != 'object'){
            param = {
                msg : param,
            }
        };
        if(param.msg){
            param.id = (new Date()).getTime() + '' + Math.ceil(Math.random() * 100000);
            param.type = 2;
            this.commit('msg/addText', param);
        }
    },
    add (state, param){
        if(typeof param != 'object'){
            param = {
                msg : param,
            }
        };
        if(param.msg){
            param.id = (new Date()).getTime() + '' + Math.ceil(Math.random() * 100000);
            this.commit('msg/addText', param);
        };
    },
    del (state, id){
        var index = state.msgKey.indexOf(id);
        index = index >= 0 ? index : state.msgText.indexOf(id);
        if(index >= 0){
            state.msg.splice(index, 1);
            state.msgKey.splice(index, 1);
            state.msgText.splice(index, 1);
        };
    },
    addText (state, param){
        var index = state.msgText.indexOf(param.msg);
        if(index >= 0){
            state.msg.splice(index, 1);
            state.msgKey.splice(index, 1);
            state.msgText.splice(index, 1);
        };
        state.msg.unshift(param);
        state.msgKey.unshift(param.id);
        state.msgText.unshift(param.msg);
        this.commit('msg/addDel', param);
    },
    delMsg (state, msg){
        var index = state.msgText.indexOf(msg);
        if(index >= 0){
            state.msg.splice(index, 1);
            state.msgKey.splice(index, 1);
            state.msgText.splice(index, 1);
        };
    },
};

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}
