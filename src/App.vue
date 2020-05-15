<template>
    <v-app>
        <router-view/>
        <notifications>
            <template slot="body" slot-scope="props">
                <v-card class="mx-2 my-1">
                    <v-list-item two-line dense :class="{
                      [getColor(props.item.type)]:true,
                      'lighten-5':true
                    }">
                        <v-list-item-icon>
                            <v-icon :color="props.item.type">{{getIcon(props.item.type)}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{props.item.title}}
                            </v-list-item-title>
                            <v-list-item-subtitle v-html="props.item.text">
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn icon @click="props.close">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>

                </v-card>
            </template>
        </notifications>
    </v-app>
</template>
<script>
  import VueNotification from 'vue-notification'

  export default {
    name: 'App',
    async mounted () {
      await this.$delay(800)
      let elementById = document.getElementById('loading-view')
      if (elementById) {
        elementById.remove()
      }
    },
    methods: {
      getIcon: function (type) {
        switch (type) {
          case 'info':
            return 'mdi-information-variant'
          case 'error':
            return 'mdi-close-circle'
          case 'warning':
            return 'mdi-information-outline'
          case 'success':
            return 'mdi-check-circle'
          default:
            return 'mdi-information-variant'
        }
      },
      getColor: function (type) {
        let dark = this.$store.state.app.dark
        switch (type) {
          case 'info':
            return dark?'#424242':'white'
          case 'error':
            return dark?'#424242':'red'
          case 'warning':
            return dark?'#424242':'orange'
          case 'success':
            return dark?'#424242':'cyan'
          default:
            return dark?'#424242':'white'
        }
      },
    },
  }
</script>
<style>
    .image-thumbnail {
        width: 90px;
    }

    .image-icon {
        width: 50px;
        height: 50px;
    }

    .expandable-tree .v-treeview-node__content {
        background-color: #ffffff !important;
        margin-bottom: 2px;
        box-shadow: 1px 1px 3px #e9edf5;
        padding-right: 12px;
    }
</style>
