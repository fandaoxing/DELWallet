<template>
    <div class="bigger-box">
        <img class="login-bg" src="../../assets/images/login-bg.jpg" alt="">
        <div class="load-radius ">
            <div class="chind-box   animation-cla1"></div>
            <div class="chind-box animation-cla2"></div>
            <div class="chind-box animation-cla3"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ready"
    }
</script>

<style>
    .bigger-box {
        position: fixed;
        width: 100%;
        height: 100%;
        background: -webkit-radial-gradient(ellipse farthest-corner at center bottom, #69d2fb 0%, #20438e 100%) center bottom/100% fixed;
        background: radial-gradient(ellipse farthest-corner at center bottom, #69d2fb 0%, #20438e 100%) center bottom/100% fixed;
        text-align: center;
        box-sizing: border-box;
        font-family: sans-serif;
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
    }


    .load-radius {
        /* margin: 40px auto; */
        width: 120px;
        text-align: center;
        position: relative;
        z-index: 100;
    }

    .load-radius .chind-box {
        width: 20px;
        height: 20px;
        background-color:white;
        border-radius: 100%;
        display: inline-block;
        -webkit-animation: load-radius 1.8s infinite ease-in-out;
        animation: load-radius 1.8s infinite ease-in-out;
    }

    .load-radius .animation-cla1 {
        -webkit-animation-delay: -0.62s;
        animation-delay: -0.62s;
    }

    .load-radius .animation-cla2 {
        -webkit-animation-delay: -0.36s;
        animation-delay: -0.36s;
    }

    @-webkit-keyframes load-radius {
        0%,
        80%,
        100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        40% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }

    @keyframes load-radius {
        0%,
        80%,
        100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        40% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }
</style>