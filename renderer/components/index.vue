<template>
    <section class="main-box">
        <section class="index-list main-list">
            <section class="list-type-2" v-if="getSyncingState">
                <h4 class="type-2">
                    <small>区块同步极速模式</small>
                </h4>
            </section>
            <section class="index-money big">
                <h4>
                    <small>我的余额</small> <span v-if="getSyncing">(区块同步中，以最新区块高度为准)</span>
                    <b>{{(getBalance + getFreeze) || 0}}</b>
                </h4>
                <dl>
                    <dt>可用余额：</dt>
                    <dd>{{getBalance || 0}}</dd>
                </dl>
                <dl>
                    <dt>创世锁定：</dt>
                    <dd>{{getFreeze - getVoterFreeze || 0}}</dd>
                </dl>
                <dl>
                    <dt>投票锁定：</dt>
                    <dd>
                        {{getVoterFreeze || 0}}
                        <small v-if="getSyncing">(区块同步中)</small>
                        <small v-else>(剩余{{voteSurplusBlock}}块)</small>
                    </dd>
                </dl>
                <dl>
                    <dt>钱包地址：</dt>
                    <dd><copy :val="getCoinbase.slice(2)">{{getCoinbase.slice(2)}}</copy></dd>
                </dl>
            </section>

            <section class="index-sync big" style="min-height: auto;margin-bottom: 30px;">
                <h4 class="title"><small>区块同步</small></h4>
                <section>
                    <i :style="{width : getSyncing ? (getSyncing.currentBlock / getSyncing.highestBlock * 100).toFixed(2) + '%' : '100%'}"></i>
                    <span v-if="getSyncing">{{getSyncing.currentBlock}}/{{getSyncing.highestBlock}}块&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   网络节点{{getPeerCount}}个</span>
                    <span v-else>同步完成 {{getBlockNumber}} 块 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 网络节点{{getPeerCount}}个</span>
                </section>
            </section>

            <section v-if="!getSyncingState" class="index-trader big">
                <h4  class="type-2">
                    <small>最近交易</small>
                </h4>
                <ul class="list-box">
                    <li v-for="item in lastTxs">
                        <section>
                            <div>
                                <span>{{localDate(item.time)}}</span>
                                <span><small>金额：</small><b>{{item.value}}</b></span>
                            </div>
                            <dl>
                                <dt>HASH:</dt>
                                <dd><copy :val="item.hash">{{item.hash}}</copy></dd>
                            </dl>
                        </section>
                    </li>
                </ul>
                <empty-data v-if="lastTxs.length <= 0" >
                    最近两轮暂无交易！
                </empty-data>
                <!--<section class="table">
                    <section class="table-head">
                        <dl>
                            <dd>时间</dd>
                            <dd>交易HASH</dd>
                            <dd>金额</dd>
                        </dl>
                    </section>
                    <section class="table-body">
                        <dl v-for="item in lastTxs">
                            <dd>{{item.time}}</dd>
                            <dd><copy :val="item.hash">{{item.hash}}</copy></dd>
                            <dd>{{item.value}}</dd>
                        </dl>
                    </section>
                </section>-->
            </section>

            <section v-if="!getSyncingState" class="index-bbs big">
                <h4 class="type-2">
                    <small>我的社区</small>
                    <!--<a href="javascript:;">查看更多</a>-->
                </h4>
                <empty-data v-if="getLastTextsOfficial.length <= 0" >
                    暂无动态！
                </empty-data>
                <ul>
                    <li v-for="item in getLastTextsOfficial">
                        <a href="javascript:;"><b>{{item.text}}</b> <span>{{localDate(item.time)}}</span></a>
                    </li>
                </ul>
            </section>

            <section v-if="!getSyncingState" class="index-bbs big">
                <h4 class="type-2">
                    <small>我的动态</small>
                    <!--<a href="javascript:;">查看更多</a>-->
                </h4>
                <empty-data v-if="getLastTexts.length <= 0">
                    暂无动态！
                </empty-data>
                <ul>
                    <li v-for="item in getLastTexts">
                        <a href="javascript:;"><b>{{item.text}}</b> <span>{{localDate(item.time)}}</span></a>
                    </li>
                </ul>
            </section>
        </section>

    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "index",
        data (){
            return {
                lastTxs : []
            }
        },
        watch : {
            getLastTxs (n, o){
                this.lastTxs = n.slice(0, 5);
            }
        },
        computed :{
            ...mapState([
                'getCoinbase',
                'getBalance',
                'getVoterFreeze',
                'getFreeze',
                'voteSurplusBlock',
                'getLastTxs',
                'getPeerCount',
                'getSyncing',
                'getBlockNumber',
                'getLastTextsOfficial',
                'getLastTexts',
                'getSyncingState',
            ])
        },
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";
    .index-list{
        .index-money{
            min-height: 350px;
            h4{
                b{
                    display: block;
                    font-size: 45px;
                    margin-top: 10px;
                    line-height: 2;
                }
            }
            dl{
                display: block;
                font-size: 16px;
                margin-bottom: 15px;
                dt{
                    display: inline-block;
                    width: 90px;
                    color: $fontColor2;
                }
                dd{
                    display: inline-block;
                    color: $fontColor1;
                    font-size: 20px;
                    small{
                        color: $fontColor2;
                    }
                }
            }
        }
        .index-trader{
            min-height: 350px;
        }
        .index-bbs{
            & > ul{
                display: block;
                margin-top: 15px;
                li{
                    display: flex;
                    min-height: 36px;
                    align-items: stretch;
                    overflow: hidden;
                    a{
                        display: flex;
                        flex-grow : 1;
                        align-items: center;
                        b{
                            width: 70%;
                            font-weight: normal;
                        }
                        span{
                            width: 30%;
                            text-align: right;
                            color: $fontColor2;
                        }
                    }
                }
            }
        }
    }
    .index-sync{
        width: 92%;
        margin: 20px auto;
        h4{

        }
        & > section{
            margin-top: 15px;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            position: relative;
            background-color: rgba($mainColor, 0.5);
            & > i{
                display: block;
                position: absolute;
                left: 0;
                top: 0;
                width: 0%;
                height: 100%;
                background-color: $mainColor;
                background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
                background-size: 30px 30px;
            }
            span{
                position: relative;
                z-index: 10;
            }
        }
    }
</style>