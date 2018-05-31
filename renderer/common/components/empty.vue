<template>
    <section class="empty-data">
        <slot>暂无数据</slot>
    </section>
</template>

<script>
    export default {
        name: "empty"
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/var.scss";
    .empty-data{
        display: flex;
        height: 100%;
        min-height: 80px;
        align-items: center;
        justify-content: center;
        color: $fontColor2;
        font-size: 14px;
    }
</style>