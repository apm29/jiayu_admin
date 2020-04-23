<template>
    <v-menu offset-y
            transition="slide-y-transition">
        <template v-slot:activator="{on}">
            <v-btn v-on="on" icon>
                <v-icon>mdi-account</v-icon>
            </v-btn>
        </template>
        <v-card
                class="mx-auto"
                max-width="300"
                tile
        >
            <v-list shaped>
                <v-subheader>管理员信息</v-subheader>
                <v-list-item-group color="primary">
                    <v-list-item
                    >
                        <v-list-item-icon>
                            <v-icon>
                                mdi-account
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{info.username}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                    >
                        <v-list-item-icon>
                            <v-icon>
                                mdi-account-group
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{roles.map(e=>e.description).join()}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                            @click="$store.dispatch('logout')"
                    >
                        <v-list-item-icon>
                            <v-icon>
                                mdi-exit-to-app
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                登出
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script>
  export default {
    name: 'VUserSettings',
    data: function () {
      return {
        info: this.$store.state.user.info,
        roles: this.$store.state.user.roles,
      }
    },
  }
</script>

<style scoped>

</style>
