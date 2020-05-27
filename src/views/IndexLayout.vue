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

  export default {
    name: 'IndexLayout',
    components: {
      VAppSettingBar,
      VAppSideBar,
    },
    data: function () {
      return {
        loading: false,
      }
    },
    watch: {
      '$store.state.app.loading': {
        immediate: true,
        handler: async function (val) {
          if (val <= 0) {
            await this.$delay(350)
          }
          this.loading = val > 0
        },
      },
    },

  }
</script>

<style scoped>

</style>
