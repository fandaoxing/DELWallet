import Vue from 'vue'
import Router from 'vue-router'

import index from '../components/index'
import transfer from '../components/transfer'
import tradeDetail from '../components/tradeDetail'
import mining from '../components/mining'
import news from '../components/news'
import system from '../components/system'

Vue.use(Router);

const router = new Router({
    routes : [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/transfer',
            name: 'transfer',
            component: transfer
        },
        {
            path: '/tradeDetail',
            name: 'tradeDetail',
            component: tradeDetail
        },
        {
            path: '/mining',
            name: 'mining',
            component: mining
        },
        {
            path: '/news',
            name: 'news',
            component: news
        },
        {
            path: '/system',
            name: 'system',
            component: system
        },
    ]
});


router.beforeEach((to, from, next) => {
    next();
});

export default  router
