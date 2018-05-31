<template>
    <section class="copy-components" @click="copy">
        <slot></slot>
    </section>
</template>

<script>
    export default {
        name: "copy",
        data (){
            return {}
        },
        props : {
            val : {
                default : ''
            }
        },
        methods : {
            copy (){
                this.$store.commit('copy', this.val);
            }
        }
    }
</script>

<style scoped>
    .copy-components{
        display: inline-block;
        cursor: copy;
    }
</style>