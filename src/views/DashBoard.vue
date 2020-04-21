<template>
    <div>
        <v-app-side-bar></v-app-side-bar>
        <v-app-bar
                app
                clipped-left
        >
            <v-toolbar-items>
                <v-btn @click="$store.commit('toggleToolbar')">Toggle Toolbar</v-btn>
                <v-btn @click="$store.commit('toggleMiniSide')">Toggle MiniSide</v-btn>
                <v-spacer/>
                <v-app-full-screen/>
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
    import VAppFullScreen from '@/components/app/VAppFullScreen'
  export default {
    name: 'DashBoard',
    components:{
      VAppFullScreen,
      VAppSideBar
    },

  }
</script>

<style scoped>

</style>
