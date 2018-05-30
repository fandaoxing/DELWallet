<template>
    <section class="main-box system-box">
        <section class="main-list">
            <section class="list-type-2">
                <h4><small>系统设置</small></h4>
                <table>
                    <tr>
                        <td>钱包版本号</td>
                        <td><copy :val="packageVersion">{{packageVersion}}</copy></td>
                    </tr>
                    <tr>
                        <td>内核版本号</td>
                        <td><copy :val="version">{{version}}</copy></td>
                    </tr>
                    <tr>
                        <td>网络协议版本</td>
                        <td><copy :val="getNetwork">{{getNetwork}}</copy></td>
                    </tr>
                </table>
                <section class="system-btn">
                    <button class="btn" type="button" @click="exportW">导出钱包{{exportRawKey ? '...' : ''}}</button>
                    <button class="btn" type="button" @click="quitExit">退出登录{{lockAccount ? '...' : ''}}</button>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "system",
        data (){
            return {};
        },
        computed : {
            ...mapState([
                'getNetwork',
                'version',
                'packageVersion',
                'exportRawKeyState',
                'exportRawKey',
                'lockAccount',
                'lockAccountState',
            ])
        },
        watch : {
        },
        methods : {
            exportW (){
                if(this.exportRawKey) return;
                this.$store.commit('exportRawKey', true);
            },
            quitExit (){
                if(this.lockAccount) return;
                this.$store.commit('lockAccount', true);
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";
    .system-box{
        table{
            margin-top: 25px;
            width: 100%;
            max-width: 480px;
            td{
                border: solid 1px $borderColor;
                padding: 15px;
                &:nth-child(1){
                    width: 30%;
                }
                &:nth-child(2){
                    width: 70%;
                }
            }
        }
        .system-btn{
            margin-top: 30px;
            .btn:nth-child(1){
                background: $mainColor;
                color: $mainBg;
                margin-right: 36px;
                &:hover{
                    color: $mainColor;
                    background: transparent;
                }
            }
        }
    }
</style>