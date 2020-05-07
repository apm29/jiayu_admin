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
                商品属性
                <v-spacer/>
                <v-btn color="primary" @click="addAttribute">添加属性</v-btn>
            </v-card-title>
            <v-card-text>
                <v-simple-table>
                    <thead>
                    <tr>
                        <th class="text-left">属性名称</th>
                        <th class="text-left">属性值</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in attributes" :key="item.attribute">
                        <td>{{ item.attribute }}</td>
                        <td>
                            <v-chip color="info" small>
                                {{ item.value }}
                            </v-chip>
                        </td>
                    </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
        </v-card>

        <v-switch class="mt-8" @change="changeMode" label="使用单规格模式"></v-switch>

        <v-card>
            <v-card-title>
                商品规格
                <v-spacer/>
                <v-btn color="primary" @click="addSpecification">添加规格</v-btn>
            </v-card-title>
            <v-card-text>
                <v-simple-table>
                    <thead>
                    <tr>
                        <th class="text-left">规格名称</th>
                        <th class="text-left">规格值</th>
                        <th class="text-left">规格图片</th>
                        <th class="text-left">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) of specifications" :key="item.value+'_specification_'+index">
                        <td>{{ item.specification }}</td>
                        <td>
                            <v-chip color="info" small>
                                {{ item.value }}
                            </v-chip>
                        </td>
                        <td>
                            <v-image-viewer v-if="item.url" img-class="image-thumbnail"
                                            :src="$path+item.url"></v-image-viewer>
                        </td>
                        <td>
                            <v-btn small color="error" @click="deleteSpecification(item)">删除</v-btn>
                            <v-btn small color="info" @click="editSpecification(item)">编辑</v-btn>
                        </td>
                    </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
        </v-card>

        <v-card class="mt-8">
            <v-card-title>
                商品库存
            </v-card-title>
            <v-card-text>
                <v-simple-table>
                    <thead>
                    <tr>
                        <th class="text-left">规格</th>
                        <th class="text-left">售价</th>
                        <th class="text-left">数量</th>
                        <th class="text-left">图片</th>
                        <th class="text-left">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) of products" :key="item.specification + '_product_'+index">
                        <td>
                            <v-chip-group>
                                <v-chip v-for="(value,index) of item.specifications" color="info" small>
                                    {{value}}
                                </v-chip>
                            </v-chip-group>
                        </td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.number }}</td>
                        <td>
                            <v-image-viewer v-if="item.url" img-class="image-thumbnail"
                                            :src="$path+item.url"></v-image-viewer>
                        </td>
                        <td>
                            <v-btn small color="info" @click="editProduct(item)">设置</v-btn>
                        </td>
                    </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
        </v-card>

        <v-footer class="mt-8">
            <v-spacer/>
            <v-btn
                    @click="saveGoods"
                    color="primary"
            >
                上架
            </v-btn>
        </v-footer>

        <v-dialog v-model="showAddSpecificationDialog">
            <v-card>
                <v-card-title>
                    添加规格
                </v-card-title>
                <v-card-text>
                    <v-form ref="specificationForm">
                        <v-text-field outlined label="规格名称" persistent-hint v-model="specificationForm.specification"/>
                        <v-text-field outlined label="规格值" persistent-hint v-model="specificationForm.value"/>
                        <v-file-uploader
                                single
                                v-model="specificationForm.url"
                                hint="规格图片"
                                grid
                                produceOnlyPath
                                acceptOnlyPath
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doAddSpecification">
                        添加
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showAddAttributeDialog">
            <v-card>
                <v-card-title>
                    添加属性
                </v-card-title>
                <v-card-text>
                    <v-form ref="specificationForm">
                        <v-text-field outlined label="属性名称" persistent-hint v-model="attributeForm.attribute"/>
                        <v-text-field outlined label="属性值" persistent-hint v-model="attributeForm.value"/>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doAddAttribute">
                        添加
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showEditProductDialog">
            <v-card>
                <v-card-title>
                    编辑库存
                </v-card-title>
                <v-card-text>
                    <v-form ref="specificationForm">
                        <v-text-field outlined label="售价" persistent-hint v-model="productForm.price"/>
                        <v-text-field outlined label="库存" persistent-hint v-model="productForm.number"/>
                        <v-file-uploader
                                single
                                v-model="productForm.url"
                                hint="货品图片"
                                grid
                                produceOnlyPath
                                acceptOnlyPath
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doEditProduct">
                        保存
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>

</template>

<script>

  import TinyEditor from '@/components/editor/TinyEditor'
  import VCascader from '@/components/select/VCascader'
  import PagedMenu from '@/components/select/PagedMenu'
  import VFileUploader from '@/components/uploader/VFileUploader'
  import VAddableChips from '@/components/select/VAddableChips'
  import VImageViewer from '@/components/image/VImageViewer'

  export default {
    name: 'GoodsCreate',
    components: { VImageViewer, VAddableChips, VFileUploader, PagedMenu, VCascader, TinyEditor },
    data: function () {
      return {
        showAddSpecificationDialog: false,
        showAddAttributeDialog: false,
        showEditProductDialog: false,
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
        specificationForm: {
          specification: undefined,
          value: undefined,
          url: undefined,
        },
        attributeForm: {
          attribute: undefined,
          value: undefined,
        },
        productForm: {
          specifications: undefined,
          number: undefined,
          price: undefined,
          url: undefined,
        },
        specifications: [],
        attributes: [],
        products: [],

        //backup
        prevSpecifications: [],
        prevProducts: [],
      }
    },
    created () {
      this.loadCategoryDict()
    },
    watch: {
      specifications: {
        deep: true,
        immediate: true,
        handler: function (val) {
          if (val) {
            let groupedSpecifications = val.reduce((groups, current) => {
              if (groups.indexOf(current.specification) < 0) {
                groups.push(current.specification)
              }
              return groups
            }, [])
            //分成n个数组存入map,key为规格名称
            let specMap = new Map()
            val.forEach((s) => {
              let specArr = specMap.get(s.specification)
              if (!specArr) {
                specArr = []
              }
              specArr.push(s)
              specMap.set(s.specification, specArr)
            })

            //递归方法
            /**
             * 算法二，非递归计算所有组合
             * @param inputList 所有数组的列表
             * */
            function calculateCombination (inputList) {
              let combination = []
              let n = inputList.length
              for (let i = 0; i < n; i++) {
                combination.push(0)
              }
              let i = 0
              let isContinue = false
              let res = []
              do {
                //打印一次循环生成的组合
                let resArr = []
                for (let j = 0; j < n; j++) {
                  resArr.push(inputList[j][combination[j]])
                }
                res.push(resArr)
                i++
                combination[n - 1] = i
                for (let j = n - 1; j >= 0; j--) {
                  if (combination[j] >= inputList[j].length) {
                    combination[j] = 0
                    i = 0
                    if (j - 1 >= 0) {
                      combination[j - 1] = combination[j - 1] + 1
                    }
                  }
                }
                isContinue = false
                for (let integer of combination) {
                  if (integer !== 0) {
                    isContinue = true
                  }
                }
              } while (isContinue)
              return res
            }

            let arr = []
            for (let key of specMap.keys()) {
              arr.push(specMap.get(key))
            }
            //组合:M选N
            let res = calculateCombination(arr)
            let newProducts = res.map((arr, index) => {
              return {
                productId: index,
                specifications: arr.map((e) => e.value),
                number: 0,
                price: 0.0,
                url: undefined,
              }
            })
            newProducts.map((p) => {
              let find = this.products.find((e) => e.specifications.join() === p.specifications.join())
              if (find) {
                Object.assign(
                  p, find,
                )
              }
            })
            this.products = newProducts
          }
        },
      },
    },
    methods: {
      loadCategoryDict: async function () {
        let res = await this.$remote.post({
          url: '/category/getAsTree',
        })
        this.categories = res.Data
      },
      deleteSpecification: async function (item) {
        await this.$messenger.confirm({
          msg: `确定删除规格:${item.specification}吗?`,
        }) &&
        this.specifications.splice(this.specifications.indexOf(item), 1)
      },
      addSpecification: function () {
        this.specificationForm = {}
        this.showAddSpecificationDialog = true
      },
      editSpecification: function (item) {
        this.specificationForm = { ...item }
        this.showAddSpecificationDialog = true
      },
      doAddSpecification: function () {
        let find = this.specifications.find(
          (s) => s.specification === this.specificationForm.specification && s.value === this.specificationForm.value)
        if (find) {
          this.specifications[this.specifications.indexOf(find)] = this.specificationForm
        } else {
          this.specifications.push(this.specificationForm)
        }
        this.showAddSpecificationDialog = false
      },
      addAttribute: function () {
        this.attributeForm = {}
        this.showAddAttributeDialog = true
      },
      doAddAttribute: function () {
        if (this.attributes.find(
          (s) => s.attribute === this.attributeForm.attribute && s.value === this.attributeForm.value)
        ) {
          this.$notify({
            text: '属性已存在',
            type: 'error',
          })
          return
        }
        this.showAddAttributeDialog = false
        this.attributes.push(this.attributeForm)
      },
      editProduct: function (item) {
        this.productForm = { ...item }
        this.showEditProductDialog = true
      },
      doEditProduct: function () {
        let index = this.products.findIndex((e) => {
          return e.specifications.join() === this.productForm.specifications.join()
        })
        this.products[index] = this.productForm
        this.showEditProductDialog = false
      },
      changeMode: function (single) {
        if (single) {
          this.prevSpecifications = [...this.specifications]
          this.prevProducts = [...this.products]
          this.specifications = [
            {
              specification: '默认',
              value: '默认',
            },
          ]
        } else {
          this.products = this.prevProducts
          this.specifications = this.prevSpecifications
        }
      },

      saveGoods: async function () {
        try {
          let res = await this.$remote.post({
            url: '/goods/create',
            data: this.form,
          })
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
          let addAttr = await this.$remote.post({
            url: '/goods/addAttributes',
            data: {
              goodsId:res.Data.id,
              attributes:this.attributes
            },
          })
          this.$notify({
            text: addAttr.Msg,
            type: 'success',
          })
          let addSpec = await this.$remote.post({
            url: '/goods/addSpecifications',
            data: {
              goodsId:res.Data.id,
              specifications:this.specifications
            },
          })
          this.$notify({
            text: addSpec.Msg,
            type: 'success',
          })
          let addProd = await this.$remote.post({
            url: '/goods/addProducts',
            data: {
              goodsId:res.Data.id,
              products:this.products
            },
          })
          this.$notify({
            text: addProd.Msg,
            type: 'success',
          })
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
        }
      },
    },
  }
</script>

<style scoped>

</style>
