<template>
    <div class="login-container">
        <img class="login-bg" src="../assets/images/login-bg.jpg" alt="">
        <div style="position: relative;z-index: 100;height: 100%;">
            <div  class="login-box">
                <div class="login-cut">
                    <span class="active" >立即登录</span>
                </div>
                <div>
                    <div class="login-passwordBox">
                        <input type="password" @keyup.enter="login" v-model="password" id="passw-text"  placeholder="请输入登录密码">
                        <span class="password-spce" v-if="passwordError">{{passwordError}}</span>
                    </div>
                </div>
                <div class="login-btn-container">
                    <input type="button" @click="login" value="立即登录">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data (){
            return {
                password : '',
                passwordError : '',
            }
        },
        watch : {
            password (n, o){
                if(n.length){
                    this.passwordError = '';
                };
            }
        },
        mounted (){
            // this.$store.commit('unlockAccount', '4542681');
        },
        methods : {
            login (){
                if(this.password.length <= 0){
                    this.passwordError = '密码不能为空';
                    return;
                };
                this.$store.commit('password', this.password);
                this.$store.commit('unlockAccount', this.password);
            },
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
    .login-container{
        width: 100%;
        height: 100%;
        background-color: #263573;
    }
    .login-container .login-box{
        width: 542px;
        /* height: 478px; */
        background-color: white;
        padding: 40px 45px ;
        position: absolute;
        top: 50%;
        left: 50%;
        box-sizing: border-box;
        transform: translate(-50%,-50%);
    }

    .login-btn-container,.footer-dis{
        display: flex;
        align-items: center;
    }
    .login-cut{
        height: 54px;
        display: flex;
        align-items: flex-start;
        box-sizing: border-box;
    }
    .login-cut span{
        flex: 1;
        height: 52px;
        text-align: center;
        font-size:24px;
        color: #555555;
    }
    .login-cut span:hover{
        cursor: pointer;
    }
    .login-cut span:first-child{
        position: relative;
    }
    .login-cut span:first-child::before{
        /* content: "";
        height: 26px;
        width: 1px;
        position: absolute;
        right: 0;
        background-color: #E0E0E0; */
    }
    .addressBox,.login-btn-container{
        margin-top: 43px;
    }
    .login-passwordBox{
        margin-top: 30px;
    }

    .addressBox input,.login-passwordBox input,.login-btn-container input{
        width: 100%;
        height: 63px;
        line-height: 63px;
        border: 1px solid #E0E0E0;
        outline: none;
        text-indent: 10px;
        font-size: 16px;
        box-sizing: border-box;
    }
    .login-passwordBox span{
        position: absolute;
        color: red
    }
    .login-btn-container span{
        position: absolute;
        top: 24px;
        right: 26px;
        transition: .3s;
    }
    .login-btn-container{
        margin-top: 43px;
    }
    .login-btn-container input{
        height: 63px;
        width: 100%;

        text-align: center;
        line-height: 63px;
        font-size: 22px;
        color: white;
        outline: none;
        border: none;
        background-color: #323c6d;
        padding: 0;
    }
    .login-btn-container input:hover{
        cursor: pointer;
    }

    .footer-dis {
        margin-top: 21px;
    }
    .footer-dis p {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .footer-dis p span{
        font-size: 16px;
        color: #3c4373 ;
    }
    .login-cut .active{
        border-bottom: 2px solid  #323C6D;
        color: #3c4373 ;
    }
</style>