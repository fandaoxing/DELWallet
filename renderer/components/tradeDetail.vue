<template>
    <section class="main-box">
        <section class="main-list">
            <section class="big">
                <h4><small>交易明细</small></h4>
                <table-data class="tradeDetail-table">
                    <dl slot="head">
                        <dd>时间</dd>
                        <dd>HASH</dd>
                        <dd>转入地址</dd>
                        <dd>转出地址</dd>
                        <dd class="type-select">
                            <span>全部</span>
                            <ul>
                                <li>转账</li>
                                <li>简讯</li>
                                <li>投票</li>
                            </ul>
                        </dd>
                        <dd>手续费</dd>
                        <dd>金额</dd>
                    </dl>
                    <dl slot="body" v-for="item in getLastTxs">
                        <dd>{{item.time}}</dd>
                        <dd><copy :val="item.hash" class="wrap" :title="item.hash">{{item.hash}}</copy></dd>
                        <dd><copy :val="item.from" class="wrap" :title="item.from">{{item.from}}</copy></dd>
                        <dd><copy :val="item.to" class="wrap" :title="item.to">{{item.to}}</copy></dd>
                        <dd>{{item.type == 'transfer' ? '转账' : item.type == 'text' ? '简讯' : '投票'}}</dd>
                        <dd>{{item.price}}</dd>
                        <dd>{{item.value}}</dd>
                    </dl>
                </table-data>
                <empty-data v-if="getLastTxs.length <= 0" />
            </section>
        </section>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "tradeDetail",
        data (){
            return {
            }
        },
        computed :{
            ...mapState([
                "getLastTxs",
            ])
        },
        methods : {

        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";
    .type-select{
        cursor: pointer;
        position: relative;
        &:hover{
            ul{
                display: block;
            }
            span:after{
                transform: rotateZ(180deg);
            }
        }
        span{
            display: block;
            overflow: hidden;
            width: 100%;
            &:after{
                transition: transition 0.3s linear;
                content: '\e6aa';
                @include iconfont(14px);
                color: #ffffff;
                display: block;
                float: right;
            }
        }
        ul{
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            z-index: 100;
            background: #f9f8fe;
            white-space : normal;
            li{
                display: block;
                height: 40px;
                line-height: 40px;
                padding: 0 15px;
                color: $fontColor3;
                &:hover{
                    background: $mainColor;
                    color: #ffffff;
                }
            }
        }
    }
</style>