<template>
    <section class="main-box">
        <section class="main-list">
            <section class="del-form list-type-2">
                <h4><small>发送简讯</small></h4>
                <section class="transfer-form-box">
                    <label>
                        <span>收件人</span>
                        <input type="text" v-model="to"  />
                    </label>
                    <label>
                        <span>手续费</span>
                        <input type="text" v-model="gasPrice" :placeholder="getGasPrice" />
                    </label>
                    <label class="big">
                        <span>简讯内容</span>
                        <textarea v-model="text"></textarea>
                    </label>
                    <label class="big">
                        <button type="button" class="btn" @click="send">发送简讯{{sendText ? '...' : ''}}</button>
                    </label>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "news",
        data (){
            return {
                gasPrice : '',
                text : '',
                to : '',
            }
        },

        watch : {
            sendText (n, o){
                if(n == null){
                    if(typeof this.sendTextState == 'string'){
                        this.text = '';
                        this.gasPrice = '';
                        this.to = '';
                    };
                };
            },
            gasPrice (n, o){
                n = this.decimals(n);
                this.gasPrice = n;
            },
        },
        computed :{
            ...mapState([
                'getGasPrice',
                'sendText',
                'sendTextState',
            ])
        },

        methods : {
            decimals (val){
                return (val + '').replace(/\./, '?').replace(/[^0-9\?]*/g, "").replace(/\?/g, ".");
            },
            send (){
                if(this.sendText) return;
                let {gasPrice, text, to} = this;
                if(to.length != 40 && to.length != 42){
                    this.$store.commit('msg/err', '收件人地址格式错误！');
                    return;
                };
                if(text.length <= 0){
                    this.$store.commit('msg/err', '简讯内容不能小于0！');
                    return;
                };
                let param = {text, to};
                if(gasPrice){
                    param.gasPrice = gasPrice;
                }else{
                    param.gasPrice = this.getGasPrice;
                };
                this.$store.commit('sendText', param);
            }
        },
    }
</script>

<style scoped>
    .big .btn{
        width: 160px;
        float: right;
    }
</style>