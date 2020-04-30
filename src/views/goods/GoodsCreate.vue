<template>
    <v-container fluid class="pa-12">
        <v-card class="fill-height d-flex flex-column">
            <v-card-title>
                商品介绍
            </v-card-title>
            <v-card-text>
               <v-form>
                   <v-text-field outlined label="商品编号" persistent-hint v-model="form.goodsSn"></v-text-field>
                   <v-text-field outlined label="商品名称" persistent-hint v-model="form.name"></v-text-field>
                   <v-cascader
                           outlined
                           v-model="form.categoryId"
                           :options="categories"
                           persistent-hint
                           label="选择商品类目"
                           item-value="id"
                           item-label="name"
                   ></v-cascader>
                   <paged-menu
                           outlined
                           v-model="form.brandId"
                           label="选择商品品牌"
                           persistent-hint
                           item-label="name"
                           item-value="id"
                   ></paged-menu>
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

  export default {
    name: 'GoodsCreate',
    components: { PagedMenu, VCascader, TinyEditor },
    data:function () {
        return {
          text:'',
          categories:[],
          form:{
            goodsSn:undefined,
            name:undefined,
            categoryId:undefined,
            brandId:undefined,
            gallery:undefined,
            keywords:undefined,
            brief:undefined,
            picUrl:undefined,
            sortOrder:undefined,
            isNew:undefined,
            isHot:undefined,
            unit:undefined,
            originPrice:undefined,
            retailPrice:undefined,
            detail:undefined,
          }
        }
    },
    created () {
      this.loadCategoryDict()
    },
    methods:{
      loadCategoryDict:async function () {
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
