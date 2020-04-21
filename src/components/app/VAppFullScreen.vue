<template>
    <v-tooltip bottom>
        <template v-slot:activator="{on}">
            <v-btn class="align-self-center" icon @click="handleClick" v-on="on">
                <v-icon v-if="isFullscreen">
                    mdi-fullscreen-exit
                </v-icon>
                <v-icon v-else>
                    mdi-fullscreen
                </v-icon>
            </v-btn>
        </template>
        {{isFullscreen?'退出全屏':'全屏显示'}}
    </v-tooltip>
</template>

<script>
  import Screenfull from 'screenfull';
  export default {
    name: 'VAppFullScreen',
    props: {
      width: {
        type: Number,
        default: 32,
      },
      height: {
        type: Number,
        default: 32,
      },
      fill: {
        type: String,
        default: '#0b0b0b',
      },
    },
    data() {
      return {
        isFullscreen: Screenfull.isFullscreen || false,
      };
    },
    watch:{
      'Screenfull.isEnabled':{
        immediate:true,
        handler:function (val) {
            this.isFullscreen = val
        }
      }
    },
    methods: {
      async handleClick () {
        if (!Screenfull.isEnabled) {
          await Screenfull.request()
          if(!Screenfull.isEnabled){
            this.$notify({
              text: '您的浏览器不支持全屏显示',
              type: 'warning',
            });
          }
        }else {
          await Screenfull.toggle();
        }
        this.isFullscreen = Screenfull.isFullscreen
      },
    },
  };
</script>
