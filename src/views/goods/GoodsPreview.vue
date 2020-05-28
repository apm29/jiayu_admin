<template>
    <div style="width: 250px;height: 400px" class="pa-2 overflow-y-auto">
        <v-carousel
                height="100"
                hide-delimiter-background
                delimiter-icon="mdi-minus"
                :next-icon="false"
                :prev-icon="false"
        >
            <v-carousel-item
                    v-for="(image,index) of goods.gallery"
                    :key="index"
            >
                <v-img class="fill-height fill-width" :src="$path+image" eager></v-img>
            </v-carousel-item>
        </v-carousel>
        <div class="goods-title mt">{{goods.name}}</div>
        <v-chip-group>
            <v-chip
                    label
                    x-small
                    v-for="(key,index) of goods.keywords"
                    :key="index"
            >
                {{key}}
            </v-chip>
        </v-chip-group>
        <div class="goods-brief">{{goods.brief}}</div>
        <div class="mt-2 mb-1">
            <span class="goods-tag">
                商品信息
            </span>
        </div>
        <div v-html="processedDetail">
        </div>
    </div>
</template>

<script>
  export default {
    name: 'GoodsPreview',
    props: {
      goods: {
        type: Object,
        default: function () {
          return {
            gallery: [],
            keywords: [],
            brief: '简介',
          }
        },
      },
      attributes: {
        type: Array,
        default: function () {
          return []
        },
      },
      specifications: {
        type: Array,
        default: function () {
          return []
        },
      },
      products: {
        type: Array,
        default: function () {
          return []
        },
      },
    },
    computed:{
      processedDetail:function () {
        return this.goods.detail.replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ')
      }
    }
  }
</script>

<style scoped>
    .goods-title {
        display: flex;
        text-align: center;
        font-size: 15px;
        font-weight: lighter;
        line-height: 18px;
    }

    .goods-brief {
        display: flex;
        text-align: start;
        font-size: 13px;
        font-weight: lighter;
        line-height: 15px;
    }

    .goods-tag {
        padding: 5px 8px;
        color: white;
        font-size: 12px;
        background-color: #333333;
    }
</style>
