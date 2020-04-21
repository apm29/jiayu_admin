<template>
    <div class="fill-height">
        <v-app-side-bar></v-app-side-bar>
        <v-app-setting-bar/>
        <v-content class="fill-height">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </v-content>
    </div>
</template>

<script>
    import VAppSideBar from '@/components/app/VAppSideBar'
    import VAppSettingBar from '@/components/app/VAppSettingBar'
  export default {
    name: 'DashBoard',
    components:{
      VAppSettingBar,
      VAppSideBar
    },

  }
</script>

<style scoped>

</style>
