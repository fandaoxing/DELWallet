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

export default new Vue({
    el: '#app',
    router,
    store,
    render: render => render(App)
});
