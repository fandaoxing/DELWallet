<template>
    <section class="main-box mining-box">
        <section class="main-list">
            <section class="list-type-2 mining">
                <h4 class="type-2"><small>DPOS选举</small></h4>
                <dl>
                    <dt>超级节点</dt>
                    <dd><span :class="checkSuperProducer ? 'active' : ''">{{checkSuperProducer ? '已激活' : '未激活'}}</span></dd>
                </dl>
                <dl>
                    <dt>主节点</dt>
                    <dd><span :class="checkProducer ? 'active' : ''">{{checkProducer ? '已激活' : '未激活'}}</span></dd>
                </dl>
                <dl>
                    <dt>投票</dt>
                    <dd><span :class="getVoting ? 'active' : ''">{{getVoting ? '已激活' : '未激活'}}</span></dd>
                </dl>
                <dl>
                    <dt>开启选举</dt>
                    <dd>
                        <label @click.prevent="setMining">
                            <input type="checkbox" v-if="mining" checked >
                            <input type="checkbox" v-else>
                            <i></i>
                        </label>
                    </dd>
                </dl>
            </section>
            <section class="list-type-2 main-list">
                <section class="list-type-2 mining">
                    <h4 class="type-2"><small>本轮投票</small></h4>
                    <dl>
                        <dt>获得票数</dt>
                        <dd><b>{{getVoterState.vote || 0}}</b></dd>
                    </dl>
                    <dl>
                        <dt>票数排名</dt>
                        <dd><b>{{getVoterState.rank || 0}}</b></dd>
                    </dl>
                    <dl>
                        <dt>投票结束</dt>
                        <dd>
                            <b v-if="getSyncing">正在同步区块</b>
                            <b v-else>还剩 {{voteSurplusBlock || 0}} 块</b>
                        </dd>
                    </dl>
                </section>
                <section class="list-type-2 mining">
                    <h4 class="type-2"><small>上轮投票</small></h4>
                    <dl>
                        <dt>获得票数</dt>
                        <dd><b>{{upVoteRound.vote || 0}}</b></dd>
                    </dl>
                    <dl>
                        <dt>票数排名</dt>
                        <dd><b>{{upVoteRound.rank || 0}}</b></dd>
                    </dl>
                </section>
            </section>
            <section class="big list-type-2">
                <h4><small>收益详情</small></h4>
                <table-data class="mining-table">
                    <dl slot="head">
                        <dd>时间</dd>
                        <dd>区块高度</dd>
                        <dd>超级节点收益</dd>
                        <dd>主节点收益</dd>
                        <dd>投票收益</dd>
                        <dd>总额</dd>
                    </dl>
                    <dl slot="body" v-for="item in getBlockReward">
                        <dd>{{item.time}}</dd>
                        <dd>{{item.number}}({{303 - item.number % 303}} 块以后获取奖励)</dd>
                        <dd>{{item.coinbase_reward}}</dd>
                        <dd>{{item.super_coinbase_reward}}</dd>
                        <dd>{{item.vote_reward}}</dd>
                        <dd>{{item.total}}</dd>
                    </dl>
                </table-data>
                <empty-data v-if="getBlockReward.length <= 0" />
            </section>
        </section>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "mining",
        data (){
            return {
            }
        },
        computed : {
            ...mapState([
                'checkProducer',
                'checkSuperProducer',
                'getVoting',
                'miningState',
                'mining',
                'getVoterState',
                'voteSurplusBlock',
                'upVoteRound',
                'getBlockReward',
                'getSyncing',
                'getBlockNumber',
            ])
        },
        watch : {
            mining (n, o){
                if(n){
                    // this.mining = !this.mining;
                    this.$store.commit('msg/add', '已开启选举');
                }else{
                    this.$store.commit('msg/add', '已关闭选举');
                };
            },
            miningState (n, o){
                if(n == false){
                    // this.mining = !this.mining;
                    this.$store.commit('msg/add', this.mining ? '自动选举正在关闭，请稍候...' : '自动选举正在启动，请稍候...');
                };
            }
        },
        methods : {
            setMining (){
                if(this.getSyncing){
                    this.$store.commit('msg/err', '正在同步区块不能设置选举');
                    return;
                };
                if(this.miningState) {
                    this.$store.commit('msg/err', '正在设置中...');
                    return;
                };
                this.$store.commit('setMining', !this.mining);
            },
        },
    }
</script>

<style scoped lang="scss">
   @import "../assets/css/var.scss";
    .mining-box .main-list > section{
        width: 47%;
        margin-left: 6%;
        &:nth-child(2n+1){
            margin-left: 0;
        }
        &.big{
            margin-top: 50px;
        }
    }
    .mining{
        dl{
            display: flex;
            align-items: center;
            justify-content: space-between;
            overflow: hidden;
            min-height: 60px;
            font-size: 16px;
            color: $fontColor2;
            border-bottom: solid 1px $borderColor;
            dt{

            }
            dd{
                & > b{
                    font-weight: normal;
                    color: $mainColor;
                }
                & > span{
                    display: flex;
                    align-items: center;
                    &:before{
                        content: '\e610';
                        @include iconfont(30px);
                        display: inline-block;
                        margin-right: 10px;
                    }
                    &.active{
                        color: $mainColor;
                        &:before{
                            content: '\e608';
                        }
                    }
                }
                label{
                    display: flex;
                    align-items: center;
                    input{
                        display: none;
                    }
                    input:checked + i{
                        background: $mainColor;
                        &:before{
                            left: 100%;
                            border-color: shade($mainColor, 50%);
                        }
                    }
                    input:checked + i + span{
                        color: $mainColor;
                    }
                    i{
                        display: inline-block;
                        user-select: none;
                        margin-right: 8px;
                        width: 50px;
                        height: 26px;
                        border-radius: 13px;
                        background: rgba($mainColor, 0.5);
                        position: relative;
                        cursor: pointer;
                        transition: all 0.2s linear;
                        &:before{
                            content: '';
                            position: absolute;
                            transition: all 0.2s linear;
                            display: block;
                            left: 26px;
                            transform: translateX(-100%);
                            height: 26px;
                            width: 26px;
                            border-radius: 50%;
                            border: solid 1px $mainColor;
                            background: #ffffff;
                        }
                    }
                }
            }
        }
    }
</style>