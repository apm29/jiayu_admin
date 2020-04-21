<template>
    <div class="component-breadcrubm">
        <v-breadcrumbs
            :items="breadcrumb"
        >
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item>
                    <v-icon v-if="item.icon" :class="item.icon ? 'mr-2' : ''">{{ item.icon }}</v-icon>
                    <span>{{ item.text }}</span>
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>
    </div>
</template>

<script>
export default {

    name: "VBreadCrumb",

    data: function() {

        return {
            breadcrumb: this.getBreadcrumb()
        }
    },

    watch: {
        "$route": {
            handler: function() {
                this.breadcrumb = this.getBreadcrumb()
            }
        }
    },

    mounted: function() {},

    destroyed: function() {},

    methods: {
        getBreadcrumb: function() {
            let items = [];
            for (let i = 0; i < this.$route.matched.length; i++) {
                items.push({
                    name: this.$route.matched[i].name,
                    href: this.$route.matched[i].path,
                    text: this.$route.matched[i].name
                })
            }
            return items;
        },
    }
}
</script>

<style scoped>

</style>
