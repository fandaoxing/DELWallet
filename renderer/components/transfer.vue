<template>
    <section class="main-box">
        <section class="main-list">
            <section class="transfer-form">
                <h4><small>安全转账</small></h4>
                <section class="transfer-form-box">
                    <label>
                        <span>数量</span>
                        <input type="text" v-model="value"  />
                    </label>
                    <label>
                        <span>手续费</span>
                        <input type="text" v-model="gasPrice" :placeholder="getGasPriceView" />
                    </label>
                    <label class="big">
                        <span>收款人</span>
                        <input type="text" v-model="to" />
                    </label>
                    <label class="big">
                        <button type="button" class="btn" @click="send">发送{{sendTransaction ? '...' : ''}}</button>
                    </label>
                </section>
            </section>
            <section class="transfer-form">
                <h4 class="type-2"><small>成功发送</small></h4>
                <ul class="list-box">
                    <li v-for="item in sendTransactionRecord">
                        <section>
                            <div>
                                <span>{{localDate(item.time)}}</span>
                                <span><small>金额：</small><b>{{item.value}}</b></span>
                            </div>
                            <dl>
                                <dt>to:</dt>
                                <dd><copy :val="item.to.replace(/^0x/, '')">{{item.to.replace(/^0x/, '')}}</copy></dd>
                            </dl>
                            <dl>
                                <dt>HASH:</dt>
                                <dd><copy :val="item.hash">{{item.hash}}</copy></dd>
                            </dl>
                        </section>
                    </li>
                </ul><!--
                <table-data class="transfer-table">
                    <<dl slot="head">
                        <dd>时间</dd>
                        <dd>HASH</dd>
                        <dd>收款人</dd>
                        <dd>金额</dd>
                    </dl>
                    <dl slot="body" v-for="item in sendTransactionRecord">
                        <dd >{{item.time}}</dd>
                        <dd><copy :val="item.hash" :title="item.hash">{{item.hash}}</copy></dd>
                        <dd><copy class="wrap" :val="item.to" :title="item.to">{{item.to}}</copy></dd>
                        <dd>{{item.value}}</dd>
                    </dl>
                </table-data>-->
                <empty-data v-if="sendTransactionRecord.length <= 0" />
            </section>
        </section>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "transfer",
        data (){
            return {
                gasPrice : '',
                value : '',
                to : '',
            }
        },
        computed :{
            ...mapState([
                'getBalance',
                'getGasPrice',
                'sendTransaction',
                'sendTransactionState',
                'sendTransactionRecord',
                'getGasPriceView',
            ])
        },
        watch : {
            sendTransaction (n, o){
                if(this.sendTransactionState){
                    this.value = '';
                    this.gas = '';
                    this.to = '';
                };
            },
            value (n, o){
                n = this.decimals(n);
                this.value = n;
            },
            gasPrice (n, o){
                n = this.decimals(n);
                this.gasPrice = n;
            },
        },
        mounted (){
            // this.$store.commit('msg/add', 'msg 测试');
        },
        methods : {
            decimals (val){
                return (val + '').replace(/\./, '?').replace(/[^0-9\?]*/g, "").replace(/\?/g, ".");
            },
            send (){
                if(this.sendTransaction) return;

                let {gasPrice, value, to} = this;
                if(Number.parseFloat(value) + Number.parseFloat(gasPrice || this.getGasPrice) > this.getBalance ){
                    this.$store.commit('msg/err', '你的可用余额小于转账金额');
                    return;
                };
                if(Number.parseFloat(value) <= 0){
                    this.$store.commit('msg/err', '数量不能小于0！');
                    return;
                };
                if(to.length != 40 && to.length != 42){
                    this.$store.commit('msg/err', '转账地址格式错误！');
                    return;
                };

                let param = {value, to};
                if(gasPrice){
                    param.gasPrice = gasPrice;
                };

                this.$store.commit('sendTransaction', param);
            }
        },
    }
</script>
