<template>
    <section id="main">
        <section v-if="delState">
            <login v-if="accountsState && !loginStatus" />
            <register v-if="!accountsState && !loginStatus" />
            <section class="main" v-if="loginStatus">
                <left-components />
                <section class="main-right">
                    <router-view/>
                </section>
            </section>
        </section>
        <ready v-if="!delState" />
        <header-components :class="!loginStatus ? 'login-head' : ''" />
        <msg />
    </section>
</template>

<script>
    import leftComponents from './components/left'
    import headerComponents from './components/header'
    import ready from './common/components/ready'
    import login from './components/login'
    import register from './components/register'
    import { mapState } from 'vuex';
    export default {
        name: "app",
        data (){
            return {
            };
        },
        computed : {
            ...mapState([
                'delState',
                'accountsState',
                'loginStatus',
                'exportRawKey',
                'exportRawKeyState',
                'lockAccount',
                'lockAccountState',
                'copyState',
            ])
        },
        watch : {
            copyState (n, o){
                if(n){
                    this.$store.commit('msg/add', {
                        title : '复制成功',
                        msg : n,
                        time : 4000
                    });
                };
            },
            delState (n, o){
                if(n == false){
                    this.$store.commit('msg/err', '节点异常退出！');
                };
                if(typeof n == 'string'){
                    this.$store.commit('msg/err', n);
                };
            },
            // lockAccount (n, o){
            //     if(n == null){
            //         this.$store.commit('msg/add', {
            //             time : 3000,
            //             msg : '退出登录成功'
            //         });
            //     };
            // },
            exportRawKey (n, o){
                if(n == null){
                    this.$store.commit('msg/add', {
                        time : 5000,
                        msg : '导出钱包私钥成功，已复制到剪贴板<br />' + this.exportRawKeyState
                    });
                };
            },
        },
        components : {headerComponents, leftComponents, login, ready, register},
        created (){},
        mounted (){},
        methods :{

        }
    }
</script>

