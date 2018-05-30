<template>
    <section class="table">
        <section class="table-head">
            <slot name="head"></slot>
        </section>
        <section class="table-body">
            <slot name="body"></slot>
        </section>
    </section>
</template>

<script>
    export default {
        name: "table-data"
    }
</script>

<style scoped>

</style>