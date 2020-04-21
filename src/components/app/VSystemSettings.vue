<template>
    <v-menu offset-y
            transition="slide-y-transition"
            :close-on-content-click="false"
    >
        <template v-slot:activator="{on}">
            <v-btn v-on="on" icon>
                <v-icon>mdi-settings</v-icon>
            </v-btn>
        </template>
        <v-card
                class="mx-auto"
                max-width="300"
                tile
        >
            <v-list shaped>
                <v-subheader>系统设置</v-subheader>
                <v-list-item-group color="primary">
                    <v-list-item
                    >
                        <v-switch v-model="dark" @change="changeTheme" label="黑暗模式"></v-switch>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script>
  export default {
    name: 'VSystemSettings',
    data: function () {
      return {
        dark:this.$store.state.app.dark
      }
    },
    watch:{
      '$store.state.app.dark':{
        immediate:true,
        handler:function () {
          this.dark = this.$store.state.app.dark
        }
      }
    },
    methods:{
      changeTheme:function (v) {
        this.$store.commit('dark',{
          vue:this,
          dark:v
        })
      }
    }
  }
</script>

<style scoped>

</style>
