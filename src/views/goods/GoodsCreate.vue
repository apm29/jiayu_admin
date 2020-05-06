<template>
    <v-container fluid class="pa-12">
        <v-card class="fill-height d-flex flex-column">
            <v-card-title>
                商品介绍
            </v-card-title>
            <v-card-text>
                {{form}}
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
                            produceOnlyPath
                            acceptOnlyPath
                    />
                    <v-file-uploader
                            v-model="form.gallery"
                            hint="商品画廊"
                            grid
                            produceOnlyPath
                            acceptOnlyPath
                    />
                    <v-text-field outlined label="商品单位(如 个/斤/盒)" persistent-hint v-model="form.unit"/>

                    <v-addable-chips v-model="form.keywords" class="mb-4"/>
                    <v-cascader
                            outlined
                            v-model="form.categoryId"
                            :options="categories"
                            persistent-hint
                            return-leaf
                            return-value
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
                    <v-text-field outlined label="商品简介" persistent-hint v-model="form.brief"/>
                    <v-label>商品详细介绍</v-label>
                    <tiny-editor v-model="form.detail"/>
                </v-form>
            </v-card-text>
        </v-card>
        <v-card class="mt-8">
            <v-card-title>
                商品规格
            </v-card-title>
        </v-card>

        <v-footer>
            <v-btn
                    @click="saveGoods"
            >
                上架
            </v-btn>
        </v-footer>
    </v-container>

</template>

<script>

  import TinyEditor from '@/components/editor/TinyEditor'
  import VCascader from '@/components/select/VCascader'
  import PagedMenu from '@/components/select/PagedMenu'
  import VFileUploader from '@/components/uploader/VFileUploader'
  import VAddableChips from '@/components/select/VAddableChips'

  export default {
    name: 'GoodsCreate',
    components: { VAddableChips, VFileUploader, PagedMenu, VCascader, TinyEditor },
    data: function () {
      return {
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
      },
      saveGoods: async function () {
        try {
          let res = await this.$remote.post({
            url: '/goods/create',
            data: this.form
          })
          this.$notify({
            text:res.text,
            type:'success'
          })
        } catch (e) {
          this.$notify({
            text:e,
            type:'error'
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
