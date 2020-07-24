<template>
    <div>
        <v-menu
                offset-y
                :close-on-content-click="false"
                fixed
        >
            <template v-slot:activator="{on}">
                <v-btn fab fixed top right v-on="on" style="margin-top: 120px" color="accent">
                    预览
                </v-btn>

            </template>
            <div
                    class="pa-2 overflow-y-auto preview-container"
            >
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
                <v-row>
                    <v-col :cols="6">
                        <div class="attr-item">
                            <span class="attr-title">市场价</span>
                            <span class="attr-subtitle">¥{{goods.originPrice}}</span>
                        </div>
                        <div class="attr-item">
                            <span class="attr-title">底价</span>
                            <span class="attr-subtitle">¥{{goods.retailPrice}}</span>
                        </div>
                    </v-col>
                    <v-col :cols="6">
                        <div class="attr-item" v-for="(attr,index) of attributes" :key="index">
                            <span class="attr-title">{{attr.attribute}}</span>
                            <span class="attr-subtitle">{{attr.value}}</span>
                        </div>
                    </v-col>
                </v-row>
                <div class="mt-2 mb-1">
            <span class="goods-tag">
                商品规格
            </span>
                </div>
                <div class="specification-item" v-for="(specification,nameIndex) of groupKeys" :key="nameIndex">
                    <div class="d-flex flex-row align-start">
                        <div class="attr-title">{{specification}}</div>
                       <div class="d-flex flex-row flex-wrap">
                           <div
                                   :class="{
                                  'selected-specification': valueIndex === selected[nameIndex]
                                }"
                                   class="specification-value-view"
                                   v-for="(value,valueIndex) of group[nameIndex]"
                                   :key="valueIndex"
                                   @click="chooseSpecification(nameIndex,valueIndex)"
                           >
                               {{value.value}}
                           </div>
                       </div>
                    </div>
                </div>
                <div class="product-wrapper" v-if="currentProduct">
                    <div class="product-item">
                        <span class="product-title">价格</span>
                        <span class="product-subtitle">¥{{currentProduct.price}}</span>
                    </div>
                    <div class="product-item">
                        <span class="product-title">库存</span>
                        <span class="product-subtitle">{{currentProduct.number}}{{goods.unit}}</span>
                    </div>
                </div>
                <v-img class="fill-height fill-width" v-if="currentProduct && currentProduct.url"
                       :src="$path+currentProduct.url" eager contain/>

                <div class="mt-2 mb-1">
            <span class="goods-tag">
                商品详情
            </span>
                </div>
                <div v-html="processedDetail">
                </div>
            </div>
        </v-menu>

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
    data: function () {
      return {
        // 规格名-> [...规格]
        groupedSpecificationsMap: new Map(),
        // [...规格名]
        groupKeys: [],
        // [[...规格]] 二维数组
        group: [],
        // [...已选规格值Index]
        selected: [],
        // 已选规格值对应的货品
        currentProduct: {},
      }
    },
    computed: {
      processedDetail: function () {
        if (!this.goods.detail) {
          return undefined
        }
        return this.goods.detail.replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ')
      },
    },
    watch: {
      products: {
        immediate: true,
        deep: true,
        handler: function () {
          this.calculateGroupedSpecificationsMap()
        },
      },
      groupedSpecificationsMap: {
        deep: true,
        handler: function () {
          this.groupKeys = [...this.groupedSpecificationsMap.keys()]
          this.group = []
          this.groupKeys.forEach((key) => {
            let items = Array.from(this.groupedSpecificationsMap.get(key))
            this.selected.push(0)
            this.group.push(items)
          })
          console.log(this.groupKeys,this.group)
          this.chooseSpecification(0, 0)
        },
      },
    },
    methods: {

      calculateGroupedSpecificationsMap: function () {
        this.groupedSpecificationsMap = this.specifications.reduce((map, current) => {
          let group = map.get(current.specification)
          if (group) {
            group.add(current)
            map.set(current.specification, group)
          } else {
            group = new Set()
            group.add(current)
            map.set(current.specification, group)
          }
          return map
        }, new Map())
        console.log(this.groupedSpecificationsMap)
      },
      chooseSpecification: function (nameIndex, valueIndex) {
        this.selected[nameIndex] = valueIndex
        let specArr = []
        this.group.forEach((g, index) => {
          specArr.push(g[this.selected[index]].value)
        })
        this.currentProduct = this.products.find((p) => {
          console.log(p.specifications,specArr)
          return p.specifications.join() === specArr.join()
        })
        this.$forceUpdate()
      },
    },
  }
</script>

<style scoped>
    .preview-container {
        width: 250px;
        height: 400px;
        border-radius: 5px;
        background-color: white;
    }

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

    ::-webkit-scrollbar { /*隐藏滚轮*/
        display: none;
    }

    .attr-item {
        padding: 6px 0px;
        text-align: start;
    }

    .attr-title {
        font-size: 13px;
        text-align: center;
        font-weight: lighter;
        line-height: 15px;
        min-width: 50px;
        margin-top:7px;
    }

    .attr-subtitle {
        margin-left: 6px;
        font-size: 12px;
        font-weight: bold;
        line-height: 15px;
    }

    .specification-wrapper {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0;
        font-size: 14px;
        background-color: #ffffff;
        margin-top: 6px;
        margin-bottom: 6px;
    }

    .specification-item {
        padding: 6px 0px;
    }

    .specification-value-view {
        /* #ifndef APP-PLUS-NVUE */
        display: inline-block;
        /* #endif */
        margin: 5px 7px;
        background-color: #bbb;
        border-radius: 2px;
        font-size: 12px;
        color: white;
        padding: 3px 4px;
        text-align: center;
        min-width: 60px;
    }

    .selected-specification {
        background-color: rgba(196, 164, 85, 0.65) !important;
    }

    .product-wrapper {
        width: 100%;
    }

    .product-item {
        padding: 6px 6px;
        text-align: start;
    }

    .product-title {
        font-size: 13px;
        font-weight: lighter;
        line-height: 15px;
        min-width: 60px;
    }

    .product-subtitle {
        margin-left: 6px;
        font-size: 12px;
        font-weight: bold;
        line-height: 15px;
    }
</style>
