<template>
    <div class="fill-height">
        <v-app-side-bar></v-app-side-bar>
        <v-app-setting-bar/>
        <v-content class="fill-height">
            <v-overlay :value="loading">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </v-content>
    </div>
</template>

<script>
  import VAppSideBar from '@/components/app/VAppSideBar'
  import VAppSettingBar from '@/components/app/VAppSettingBar'
  import StateMixin from '@/mixins/StateMixin'

  export default {
    name: 'IndexLayout',
    mixins:[StateMixin],
    components: {
      VAppSettingBar,
      VAppSideBar,
    },


  }
</script>

<style scoped>

</style>
