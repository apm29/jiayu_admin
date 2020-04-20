<template>
    <div>
        <v-app-side-bar></v-app-side-bar>
        <v-app-bar
                app
                clipped-left
        >
            <v-toolbar-items>
                <v-btn>1</v-btn>
                <v-btn>1</v-btn>
                <v-btn>1</v-btn>
                <v-btn>1</v-btn>
            </v-toolbar-items>
        </v-app-bar>
        <v-content>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </v-content>
    </div>
</template>

<script>
    import VAppSideBar from '@/components/app/VAppSideBar'
  export default {
    name: 'DashBoard',
    components:{
      VAppSideBar
    },

  }
</script>

<style scoped>

</style>
