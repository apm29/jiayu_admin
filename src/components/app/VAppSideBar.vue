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
                                    @click.stop="$store.commit('toggleMiniSide')"
                            >
                                <v-icon>{{!miniVariant?'mdi-menu-open':'mdi-menu-right'}}</v-icon>
                            </v-btn>
                        </template>
                        <span v-if="miniVariant">折叠主菜单</span>
                        <span v-else>展开主菜单</span>
                    </v-tooltip>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{$store.state.app.name}}</v-list-item-title>
                    <v-list-item-subtitle>{{$store.state.app.subtext}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <template v-for="(route,index) of routes">
                <v-list-item
                        v-if="!route.hidden && route.children && route.children.length === 1"
                        :key="route.children[0].name + index"
                        :to="route.children[0].path"
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
                        color="secondary"
                        active-class="white--text"
                >
                    <template v-slot:prependIcon>
                        <v-icon>{{ route.icon || 'mdi-menu'}}</v-icon>
                    </template>
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
  import dynamicRouters from '@/router/dynamicRouters'
  import router from '@/router/router'

  export default {
    name: 'VAppSidebar',
    data () {
      return {
        drawer: this.$vuetify && this.$vuetify.breakpoint.mdAndUp,
        miniVariant: false,
        ps: null,
        clipped: true,
        temporary: false,
        sidebarColor: {
          bgColor1: 'rgba(0, 0, 0, 0.6)',
          bgColor2: 'rgba(0, 0, 0, 0.2)',
          dark: true,
        },
      }
    },
    watch: {
      '$vuetify.breakpoint' (newVal) {
        this.$emit('changeTemporary', newVal.smAndDown)
        this.temporary = newVal.smAndDown
      },
      drawer: {
        handler: function (val) {
          this.$store.commit('showToolBar', val)
        },
      },
      '$store.state.layout.showToolbar': {
        immediate: true,
        handler: function (val) {
          if (val === this.drawer) {
            return
          }
          this.drawer = val
        },
      },
      '$store.state.layout.miniSide': {
        immediate: true,
        handler: function (val) {
          this.miniVariant = val
        },
      },
      '$store.state.user.roles': {
        immediate: true,
        handler: function () {
        },
      },
    },
    computed: {
      routes: function () {

        let menu = this.$store.state.user.menu
        let allMenu = this.$store.state.user.allMenu
        let menuPath = new Set()
        menu.forEach(m => {
          let find = allMenu.find(e => e.id === m.parentId)
          if (find) {
            //加入父菜单
            menuPath.add(find.path)
          }
          menuPath.add(m.path)
        })
        menuPath = Array.from(menuPath)
        let { routes } = this.$router.options
        let filter = dynamicRouters.filter(route => {
          let number = menuPath.findIndex(v => v === route.path)
          console.log(route.path, number)
          let oldIndex = routes.findIndex(r => r.path === route.path)
          return number >= 0 && oldIndex < 0
        })
        console.log(filter)
        this.$router.addRoutes(
          [...filter],
        )
        routes = this.$router.options.routes
        console.log(routes)
        return routes
      },
    },

  }
</script>
