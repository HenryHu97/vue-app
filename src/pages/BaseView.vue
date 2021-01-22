<template>
    
</template>

<script>
    export default {
        data () {
            return {
                list: [],
                size: 10,
                page: 1,
                total: 0,
                hasMore: false,
                loading: false
            }
        },
        methods: {
            setLayout(title, showHome, showBack) {
                this.$store.dispatch('common/setLayout', {title, showHome, showBack})
            }
        }
    }
</script>