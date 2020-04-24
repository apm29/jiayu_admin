<template>
    <div>
        <v-img
                :src="src"
                :alt="alt"
                :contain="contain"
                :eager="eager"
                :gradient="gradient"
                :lazy-src="lazySrc"
                :options="options"
                :position="position"
                :sizes="sizes"
                :srcset="srcset"
                :transition="transition"
                :class="imgClass"
                :style="imgStyle"
        >

        </v-img>
        <v-dialog>

        </v-dialog>
    </div>
</template>

<script>

  export default {
    name: 'VImageViewer',
    props:{
      //v-img属性
      alt: String,
      contain: Boolean,
      eager: Boolean,
      gradient: String,
      lazySrc: String,
      options: {
        type: Object,
        default: () => ({
          root: undefined,
          rootMargin: undefined,
          threshold: undefined,
        }),
      },
      position: {
        type: String,
        default: 'center center',
      },
      sizes: String,
      src: {
        type: String | Object,
        default: '',
      },
      srcset: String,
      transition: {
        type: Boolean |  String,
        default: 'fade-transition',
      },
      //其他属性
      imgClass:Object|String,
      imgStyle:Object|String,

      srcList:{
        type:Array,
        default:function () {
            return []
        }
      }
    }
  }
</script>

<style scoped>

</style>
