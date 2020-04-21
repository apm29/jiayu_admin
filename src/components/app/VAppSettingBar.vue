<template>
    <v-app-bar
            app
            dense
            clipped-left
            color="secondary"
            dark
    >
        <v-toolbar-items class="flex-grow-1 align-center">
            <v-btn icon @click="$store.commit('toggleToolbar')">
                <v-icon>{{$store.state.layout.showToolbar?'mdi-toggle-switch':'mdi-toggle-switch-off'}}</v-icon>
            </v-btn>
            <v-bread-crumb/>
            <v-spacer/>
            <v-app-full-screen/>
            <v-user-settings/>
            <v-system-settings/>
        </v-toolbar-items>
    </v-app-bar>
</template>

<script>
  import VUserSettings from '@/components/app/VUserSettings'
  import VAppFullScreen from '@/components/app/VAppFullScreen'
  import VBreadCrumb from '@/components/app/VBreadCrumb'
  import VSystemSettings from '@/components/app/VSystemSettings'

  export default {
    name: 'VAppSettingBar',
    components: {
      VSystemSettings,
      VBreadCrumb,
      VAppFullScreen,
      VUserSettings,
    },
  }
</script>

<style scoped>

</style>
