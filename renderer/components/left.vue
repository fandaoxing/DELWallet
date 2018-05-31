<template>
    <section class="main-left">
        <ul>
            <li><router-link :class="setActive('index')" to="/index">个人中心</router-link></li>
            <li><router-link :class="setActive('transfer')" to="/transfer">安全转账</router-link></li>
            <li><router-link :class="setActive('tradeDetail')" to="/tradeDetail">交易明细</router-link></li>
            <li><router-link :class="setActive('mining')" to="/mining">DPOS选举</router-link></li>
            <li><router-link :class="setActive('news')" to="/news">发送简讯</router-link></li>
            <li><router-link :class="setActive('system')" to="/system">系统设置</router-link></li>
        </ul>
    </section>
</template>

<script>
    export default {
        name: "left-components",
        data (){
            return {}
        },
        methods : {
            setActive (name){
                return this.$route.name == name ? name + ' active' : name;
            },
        }
    }
</script>


<style scoped lang="scss">
    @import "../assets/css/var.scss";
    .main-left{
        width: $mainLW;
        float: left;
        height: 100%;
        background: $mainBg2;
        padding-top: $mainT;
        border-right: solid 1px $borderColor;
        & > ul{
            display: block;
            margin: 0 auto;
            width: 68%;
            & > li{
                display: block;
                height: 68px;
                line-height: 68px;
                font-size: 16px;
                border-bottom: solid 1px $borderColor;
                &.active a{
                    color: $mainColor;
                }
                &.active a:after{
                    transform: translateY(-50%) rotateZ(-90deg);
                }
                a{
                    display: block;
                    position: relative;
                    color: $fontColor3;
                    &:before{
                        margin-right: 15px;
                        @include iconfont(18px);
                        content: '\e61e';
                    }
                    &.index:before{
                        content: '\e61e';
                    }
                    &.transfer:before{
                        content: '\e61d';
                        font-size: 22px;
                        transform: translateX(-2px);
                    }
                    &.tradeDetail:before{
                        content: '\e643';
                        font-size: 16px;
                        transform: translateX(-5px);
                    }
                    &.mining:before{
                        content: '\e640';
                    }
                    &.news:before{
                        content: '\e61c';
                    }
                    &.system:before{
                        content: '\e6e8';
                    }
                    &:after{
                        @include iconfont(16px);
                        content: '\e632';
                        display: block;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        transition: transform 0.4s linear;
                    }
                    &.active{
                        color: $mainColor;
                    }
                    &.active:after{
                        transform: translateY(-50%) rotateZ(-90deg);
                    }
                }
            }
        }
    }

</style>