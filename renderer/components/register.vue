<template>
    <div class="createWallet-container">
        <img class="login-bg" src="../assets/images/login-bg.jpg" alt="">
        <div class="created-box" style="position: relative;z-index: 100;">
            <div class="login-cut">
                <span :class="navState == 1 ? 'active' : ''" @click="navState = 1">创建账户</span>
                <span :class="navState == 2 ? 'active' : ''" @click="navState = 2">导入钱包</span>
            </div>
            <div v-if="navState == 1">
                <div class="confirm-passwordBox">
                    <input type="password" @keyup.enter="register" v-model="password" placeholder="请输入密码">
                    <span class="password-spce" v-if="passwordError"><i class="iconfont icon-iconfontxiaogantanhao"></i>{{passwordError}}</span>
                </div>
                <div class="again-passwordBox">
                    <input type="password" @keyup.enter="register" v-model="passwordRedo" placeholder="请确认您的密码">
                    <span class="password-spce " v-if="passwordRedoError"><i class="iconfont icon-iconfontxiaogantanhao"></i>{{passwordRedoError}}</span>
                </div>
            </div>
            <div v-if="navState == 2">
                <div class="confirm-addressdBox">
                    <input type="text" @keyup.enter="channel" v-model="privateKey"  placeholder="请输入私钥">
                    <span class="password-spce" v-if="privateKeyError"><i class="iconfont icon-iconfontxiaogantanhao"></i>{{privateKeyError}}</span>
                </div>
                <div class="again-passwordBox">
                    <input type="password" @keyup.enter="channel" v-model="password"  placeholder="请输入钱包密码">
                    <span  class="password-spce" v-if="passwordError"><i class="iconfont icon-iconfontxiaogantanhao"></i>{{passwordError}}</span>
                </div>
            </div>
            <div class="create-btn-container">
                <input type="button" @click="navState == 1 ? register() : channel()"  value="确定">
            </div>
            <div class="footer-dis">
                <p>请妥善保管您的钱包密码和私钥，遗失无法找回！</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data (){
            return {
                navState : 1,
                password : '',
                passwordRedo : '',
                passwordError : '',
                passwordRedoError : '',
                privateKey: '',
                privateKeyError : '',
            }
        },
        watch : {
            navState (){
                this.password = '';
            },
            password (n, o){
                if(n.length){
                    this.passwordError = '';
                };
            },
            privateKeyError (n, o){
                if(n.length){
                    this.passwordError = '';
                };
            }
        },
        methods : {
            register (){
                if(this.password.length <= 0){
                    this.passwordError = '密码不能为空';
                    return;
                };
                if(this.password.length < 6){
                    this.passwordError = '密码不能小于6位';
                    return;
                };
                if(this.passwordRedo != this.password){
                    this.passwordError = '密码不一致';
                    return;
                };
                this.$store.commit('password', this.password);
                this.$store.commit('newAccount', this.password);
            },
            channel (){
                let {privateKey, password} = this;
                if(!/[0-9a-zA-Z]{64}/.test(privateKey)){
                    this.privateKeyError='请输入正确的私钥';
                    return;
                }
                if(password.length <= 0){
                    this.passwordError = '密码不能为空';
                    return;
                };
                if(password.length <= 6){
                    this.passwordError = '密码不能小于6位';
                    return;
                };
                this.$store.commit('password', password);
                this.$store.commit('importRawKey', {privateKey, password});
            }
        }
    }
</script>

<style scoped>

    .img-container{
        height: 60px;
        padding-left: 44px;
        display: flex;
        align-items: center;
    }

    /*导入钱包地址样式开始*/
    .confirm-addressdBox,.confirm-passwordBox,.again-passwordBox{
        position: relative;
    }
    .confirm-addressdBox .address-container{
        position: absolute;
        background-color: white;
        border: 1px solid #E0E0E0;
        width: 100%;
        box-sizing: border-box;
        top: 62px;
        z-index: 2;
    }
    .confirm-addressdBox .address-container li{
        padding-left: 10px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #555555;
    }
    .confirm-addressdBox .address-container li:hover{
        cursor: pointer;
        background-color: #f5f7f9;
    }
    .createWallet-container{
        width: 100%;
        height: 100%;
        background-color: #263573;
    }
    .createWallet-container .created-box{
        width: 542px;
        height: 478px;
        background-color: white;
        padding: 40px 45px ;
        position: absolute;
        top: 50%;
        left: 50%;
        box-sizing: border-box;
        transform: translate(-50%,-50%);
    }

    .created-box .create-btn-container,.created-box .footer-dis{
        display: flex;
        align-items: center;
    }
    .created-box .login-cut{
        height: 54px;
        display: flex;
        align-items: flex-start;
        box-sizing: border-box;
    }
    .created-box .login-cut span{
        flex: 1;
        height: 52px;
        text-align: center;
        font-size:24px;
        color: #555555;
    }
    .created-box .login-cut span:hover{
        cursor: pointer;
    }
    .created-box .login-cut span:first-child{
        position: relative;
    }
    .created-box .login-cut span:first-child::before{
        content: "";
        height: 26px;
        width: 1px;
        position: absolute;
        right: 0;
        background-color: #E0E0E0;
    }
    .created-box .confirm-passwordBox,.confirm-addressdBox{
        margin-top: 43px;
    }
    .created-box .again-passwordBox{
        margin-top: 30px;
    }
    .password-spce{
        font-size: 14px;
        position: absolute;
        top: 68px;
        color: #cc0000;
        text-indent: 10px;
    }
    .password-spce i{
        font-size: 14px;

        margin-right: 10px;
    }
    .created-box .confirm-passwordBox input,.created-box .again-passwordBox input,.created-box .confirm-addressdBox input{
        width: 100%;
        height: 63px;
        line-height: 63px;
        border: 1px solid #E0E0E0;
        outline: none;
        text-indent: 10px;
        font-size: 16px;
        box-sizing: border-box;
    }
    .created-box .confirm-addressdBox span{
        position: absolute;
        transition: .3s;
    }
    .createWallet-container .created-box .create-btn-container{
        margin-top: 43px;
    }
    .createWallet-container .created-box .create-btn-container input{
        height: 63px;
        width: 100%;
        border-radius: 2px;
        text-align: center;
        line-height: 63px;
        font-size: 20px;
        color: white;
        outline: none;
        border: none;
        background-color: #323c6d;
        padding: 0;
    }
    .createWallet-container .created-box .create-btn-container input:hover{
        cursor: pointer;
    }

    .footer-dis {
        margin-top: 21px;
        justify-content: center;
        align-items: center;
    }
    .footer-dis p{
        text-align: center;
        font-size: 14px;
        color: #a6a6a6;
    }
    .created-box .login-cut .active{
        border-bottom: 2px solid  #323C6D;
        color: #3c4373 ;
    }
</style>