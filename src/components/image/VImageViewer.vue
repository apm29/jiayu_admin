<template>
    <v-img
            :src="src+$thumbnail"
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
            :height="height"
            :max-height="maxHeight"
            :width="width"
            :max-width="maxWidth"
            :min-height="minHeight"
            :min-width="minWidth"
            @click="showImageDetail"
    >
        <template v-slot:placeholder>
            <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
            >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
        </template>
        <v-dialog v-model="showDetail" fullscreen>
            <v-card class="bg-preview" height="100%" width="100%">
                <div class="images" v-viewer.static="{inline: true}">
                    <img v-for="src in previewList" :src="src" :key="src">
                </div>
            </v-card>
            <v-btn fab fixed top left @click="showDetail=false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-dialog>
    </v-img>

</template>

<script>
  export default {
    name: 'VImageViewer',

    props: {
      //v-img属性
      alt: String,
      contain: Boolean,
      eager: Boolean,
      gradient: String,
      lazySrc: String,
      height: [Number,String],
      maxHeight: [Number,String],
      maxWidth: [Number,String],
      minHeight: [Number,String],
      minWidth:[Number,String],
      width: [Number,String],
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
        type: [Object,String],
        default: '',
      },
      srcset: String,
      transition: {
        type: [Boolean,String],
        default: 'fade-transition',
      },
      //其他属性
      imgClass: [Object,String],
      imgStyle: [Object,String],

      srcList: {
        type: Array,
        default: function () {
          return []
        },
      },
    },
    data: function () {
      return {
        showDetail: false,
        previewList: [],
        index: 0,
      }
    },
    methods: {
      showImageDetail: function () {
        this.previewList = []
        if (this.srcList && this.srcList.length !== 0) {
          this.previewList = this.previewList.concat(this.srcList)
        } else {
          this.previewList = this.previewList.concat(this.src)
        }
        this.index = this.previewList.indexOf(this.src) || 0
        this.showDetail = true
      },
    },
  }
</script>

<style scoped>
    .bg-preview {
        background-color: rgba(0, 0, 0, 0.6);
    }

    .images {
        height: 100%;
        width: 100%;
    }
</style>
