<template>
    <header id="header">
        <a href="javascript:;" class="logo" title="DEL Wallet">
            <img src="../assets/images/top_logo.png" alt="">
        </a>
        <section class="header-icon">
            <section class="user-icon">
                <a href="javascript:;" title="退出" @click="quitExit"></a>
            </section>
            <section class="system-btn">
                <a href="javascript:;" title="最小化" @click="min"></a>
                <a href="javascript:;" :class="appMax ? 'active' : ''" title="最大化" @click="max"></a>
                <a href="javascript:;" title="关闭" @click="quit"></a>
            </section>
        </section>
    </header>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        name: "header-components",
        data (){
            return {}
        },
        computed : {
            ...mapState([
                'appMax',
                'lockAccount',
                'lockAccountState',
            ])
        },
        methods : {
            quitExit (){
                if(this.lockAccount) return;
                this.$store.commit('lockAccount', true);
            },
            quit (){
                this.$store.commit('appQuit');
            },
            max (){
                this.$store.commit('appMax');
            },
            min (){
                this.$store.commit('appMin');
            }
        }
    }
</script>
