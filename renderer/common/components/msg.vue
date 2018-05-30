<template>
    <section class="msg-box">
        <transition-group name="msg" tag="section">
            <section v-for="m in msg" class="msg-item" :class="m.type == 2 ? 'error' : ''" :key="m.msg">
                <h4>{{m.title ? m.title : '温馨提示'}}</h4>
                <p :class="m.type == 2 ? 'error' : ''" v-html="m.msg"></p>
            </section>
        </transition-group>
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "msg",
        computed : {
            ...mapState('msg', ['msg']),
        },
        methods : {
        },
    }
</script>

<style lang="scss">
    @import "../../assets/css/var.scss";
    .msg-move {
        transition: transform 500ms;
    }
    .msg-enter-active, .msg-leave-active {
        transition: all 0.4s ease-out;
    }
    .msg-enter, .msg-leave-to {
        opacity: 0;
        transform: translateX(100%);
    }
    .msg-box{
        position: fixed;
        top: 70px;
        right: 20px;
        z-index: 99999999;
        .msg-item{
            min-width: 335px;
            max-width: 480px;
            min-height: 75px;
            /*background: rgba(255, 255, 255, 0.5);*/
            background: rgba(255, 255, 255, 1);
            border-left: solid 3px $fallColor;
            padding-left: 60px;
            overflow: hidden;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
            position: relative;
            padding-right: 10px;
            &:before{
                content: '\e60f';
                @include iconfont(30px);
                color: $fallColor;
                display: block;
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
            }
            &.error{
                border-color: $riseColor;
            }
            &.error:before{
                content: '\e685';
                color: $riseColor;
            }
            h4{
                color: $fontColor3;
                font-size: 14px;
                margin: 18px 0 12px;
                line-height: 1;
            }
            p{
                color: #6a6c6f;
                font-size: 12px;
                padding-bottom: 10px;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-all;
                &.error{
                    //color: $mainColor;
                }
            }
        }
    }
</style>
