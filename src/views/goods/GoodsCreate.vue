<template>
    <v-container fluid class="pa-12">
        <v-card class="fill-height d-flex flex-column">
            <v-card-title>
                商品介绍
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field outlined label="商品编号" persistent-hint v-model="form.goodsSn"/>
                    <v-text-field outlined label="商品名称" persistent-hint v-model="form.name"/>
                    <v-row class="px-3">
                        <v-col>
                            <v-switch v-model="form.isNew" label="新品"/>
                        </v-col>
                        <v-col>
                            <v-switch v-model="form.isHot" label="热卖"/>
                        </v-col>
                        <v-col>
                            <v-switch v-model="form.isOnSale" label="在售"/>
                        </v-col>
                    </v-row>
                    <v-file-uploader
                            single
                            v-model="form.picUrl"
                            hint="商品图片"
                            grid
                    />
                    <v-file-uploader
                            v-model="form.gallery"
                            hint="商品画廊"
                            grid
                    />
                    <v-text-field outlined label="商品单位(如 个/斤/盒)" persistent-hint v-model="form.unit"/>
                    <v-combobox
                            v-model="form.keywords"
                            label="关键字"
                            outlined
                            persistent-hint
                            :items="keywordsDict"
                            clearable
                            chips
                            multiple
                    >
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        没有匹配的关键词. 按下 <kbd>enter</kbd> 创建新关键词
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-combobox>
                    <v-cascader
                            outlined
                            v-model="form.categoryId"
                            :options="categories"
                            persistent-hint
                            label="选择商品类目"
                            item-value="id"
                            item-label="name"
                    />
                    <paged-menu
                            outlined
                            v-model="form.brandId"
                            label="选择商品品牌"
                            persistent-hint
                            item-label="name"
                            item-value="id"
                    />
                    {{form.brandId}}
                    <tiny-editor v-model="text"/>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>

</template>

<script>

  import TinyEditor from '@/components/editor/TinyEditor'
  import VCascader from '@/components/select/VCascader'
  import PagedMenu from '@/components/select/PagedMenu'
  import VFileUploader from '@/components/uploader/VFileUploader'

  export default {
    name: 'GoodsCreate',
    components: { VFileUploader, PagedMenu, VCascader, TinyEditor },
    data: function () {
      return {
        text: '',
        categories: [],
        form: {
          goodsSn: undefined,
          name: undefined,
          categoryId: undefined,
          brandId: undefined,
          gallery: undefined,
          keywords: [],
          brief: undefined,
          picUrl: undefined,
          sortOrder: undefined,
          isNew: undefined,
          isHot: undefined,
          isOnSale: undefined,
          unit: undefined,
          originPrice: undefined,
          retailPrice: undefined,
          detail: undefined,
        },
        keywordsDict:[
          "测试",
          "淡水"
        ],
      }
    },
    created () {
      this.loadCategoryDict()
    },
    methods: {
      loadCategoryDict: async function () {
        let res = await this.$remote.post({
          url: '/category/getAsTree',
        })
        this.categories = res.Data
      }
    }
  }
</script>

<style scoped>

</style>
