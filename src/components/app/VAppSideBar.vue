<template>
    <v-navigation-drawer
            id="sidebar"
            class="blue-grey lighten-5"
            app
            dark
            v-model="drawer"
            :clipped="clipped"
            :temporary="temporary"
            mobile-break-point="400"
            :mini-variant="miniVariant">
        <v-img
                src="@/assets/login-bg1.jpg"
                :gradient="sidebarColor.bgColor1 + ', ' + sidebarColor.bgColor2"
                slot="img"
                class="fill-height"
        ></v-img>
        <v-list
                nav
                expand
                dense>
            <v-list-item two-line :class="{ 'pa-0':miniVariant }">
                <v-list-item-action>
                    <v-tooltip
                            bottom
                    >
                        <template v-slot:activator="{on}">
                            <v-btn
                                    icon
                                    v-on="on"
                                    class="ml-2 mr-2"
                                    @click.stop="miniVariant = !miniVariant"
                            >
                                <v-icon>{{!miniVariant?'mdi-menu-open':'mdi-menu-right'}}</v-icon>
                            </v-btn>
                        </template>
                        <span v-if="miniVariant">折叠主菜单</span>
                        <span v-else>展开主菜单</span>
                    </v-tooltip>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Application</v-list-item-title>
                    <v-list-item-subtitle>Subtext</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <template v-for="(route,index) of routes">
                <v-list-item
                        v-if="!route.hidden && route.children && route.children.length === 1"
                        :key="route.children[0].name + index"
                        :to="route.children[0].path"
                        color="secondary"
                        active-class="accent elevation-3 white--text"
                        link
                >
                    <v-list-item-icon>
                        <v-icon>{{ route.children[0].icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ route.children[0].name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-group
                        v-if="!route.hidden && route.children && route.children.length > 1"
                        :key="route.name + index"
                        :prepend-icon="route.icon || 'mdi-menu'"
                        color="secondary"
                        active-class="white--text"
                >
                    <template v-slot:activator>
                        <v-list-item-title>{{ route.name }}</v-list-item-title>
                    </template>
                    <v-list-item
                            v-for="(subItem,subIndex) of route.children"
                            :key="subItem.name + subIndex"
                            :to="subItem.path"
                            active-class="accent elevation-3 white--text"
                            link
                    >
                        <v-list-item-icon>
                            <v-icon>{{ subItem.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ subItem.name }}</v-list-item-title>
                        </v-list-item-content>

                    </v-list-item>
                </v-list-group>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'VAppSidebar',
    data () {
      return {
        drawer: this.$vuetify && this.$vuetify.breakpoint.mdAndUp,
        miniVariant: false,
        ps: null,
        clipped: true,
        temporary: false,
        sidebarColor : {
          bgColor1: "rgba(0, 0, 0, 0.3)",
          bgColor2: "rgba(0, 0, 0, 0.1)",
          dark: true
        },
      }
    },
    watch: {
      '$vuetify.breakpoint' (newVal) {
        this.$emit('changeTemporary', newVal.smAndDown)
        this.temporary = newVal.smAndDown
      },
    },
    computed: {
      routes () {
        const { routes } = this.$router.options
        return routes
      },
      current () {
        return this.$route.name
      },
    },

  }
</script>
