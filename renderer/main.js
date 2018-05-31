import Vue from 'vue';
import router from './router/index'
import store from './store/index'
import App from './app';
import commoncss from "./assets/css/common.scss";

import emptyData from './common/components/empty'
import tableData from './common/components/table'
import msg from './common/components/msg'
import copy from './common/components/copy'


Vue.component('emptyData', emptyData);
Vue.component('tableData', tableData);
Vue.component('msg', msg);
Vue.component('copy', copy);

Vue.mixin({
    methods : {
        localDate (date){
            if(typeof date === 'string' && /T/.test(date)){
                return new Date(date).toLocaleString("zh-Hans-CN",{hour12:false});
            }else{
                return date;
            };
        }
    }
});

export default new Vue({
    el: '#app',
    router,
    store,
    render: render => render(App)
});
