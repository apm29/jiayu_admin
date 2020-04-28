<template>
    <v-card class="fill-height d-flex flex-column">
        <v-data-table
                class="flex-grow-1"
                fixed-header
                :headers="tableSettings.headers"
                :items="data"
                :server-items-length="tableSettings.total"
                :options.sync="options"
                :loading="tableSettings.loading"
                :footer-props="{'items-per-page-options': tableSettings.rowDict}"
        >
            <template v-slot:item.picUrl="{item}">
                <v-img class="image-thumbnail" :src="$path+item.picUrl"></v-img>
            </template>
            <template v-slot:header.operation>
                <v-btn text color="success" @click="addBrand">
                    <v-icon>mdi-plus</v-icon>
                    添加品牌
                </v-btn>
            </template>
            <template v-slot:item.operation="{item}">
                <v-row justify="space-around">
                    <v-btn small color="error" @click="deleteBrand(item)">删除</v-btn>
                    <v-btn small color="info" @click="editBrand(item)">编辑</v-btn>
                </v-row>
            </template>
        </v-data-table>
        <v-dialog width="50vw" v-model="showAddMenu" scrollable>
            <v-card>
                <v-card-title>{{form.id?'编辑品牌':'添加品牌'}}</v-card-title>
                <v-card-text>
                    <v-text-field label="品牌名称" outlined v-model="form.name">
                    </v-text-field>
                    <v-textarea label="品牌描述" outlined v-model="form.description">
                    </v-textarea>
                    <v-text-field type="number" label="品牌底价(用于展示)" outlined v-model="form.floorPrice">
                    </v-text-field>
                    <v-text-field type="number" label="排序值" outlined v-model="form.sortOrder">
                    </v-text-field>
                    <v-file-uploader
                            single
                            grid
                            hint="选择品牌图片"
                            accept="image/*"
                            accept-only-path
                            produce-only-path
                            v-model="form.picUrl"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doEditBrand">提交</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
  import VFileUploader from '@/components/uploader/VFileUploader'

  export default {
    name: 'BrandManager',
    components: {
      VFileUploader,
    },
    data: function () {
      return {
        data: [],
        options: {},
        tableSettings: {
          search: undefined,
          headers: [
            {
              text: 'ID',
              value: 'id',
              sortable: false,
            },
            {
              text: '品牌名称',
              value: 'name',
              sortable: false,
            },
            {
              text: '描述',
              value: 'description',
              sortable: false,
            },
            {
              text: '排序',
              value: 'sortOrder',
            },
            {
              text: '图片',
              value: 'picUrl',
            },
            {
              text: '低价',
              value: 'floorPrice',
            },
            {
              text: '操作',
              value: 'operation',
              sortable: false,
              width: '190px',
            },
          ],
          loading: false,
          rowDict: [10, 20, 50],
          total: 0,
        },
        showAddMenu: false,
        form: {
          id: undefined,
          name: undefined,
          description: undefined,
          picUrl: undefined,
          sortOrder: undefined,
          floorPrice: undefined,
        },
      }
    },
    created: function () {
      this.loadBrandList()
    },
    methods: {
      loadBrandList: async function () {
        if (this.tableSettings.loading) {
          return
        }
        let url = '/brand/list'
        let data = {
          pageNo: this.tableSettings.page,
          pageSize: this.tableSettings.rows,
          sort: this.tableSettings.sort,
          order: this.tableSettings.order,
          search: this.tableSettings.search,
        }
        try {
          this.tableSettings.loading = true
          let res = await this.$remote.post({
            url: url,
            data: data,
          })
          this.data = res.Data.records
          this.tableSettings.total = parseInt(res.Data.total)
        } catch (e) {
          console.log(e)
        } finally {
          this.tableSettings.loading = false
        }
      },
      addBrand: function () {
        this.form = {}
        this.showAddMenu = true
      },
      editBrand: function (brand) {
        this.form = brand
        this.showAddMenu = true
      },
      deleteBrand: async function (brand) {
        await this.$messenger.confirm({
          msg: `确定删除${brand.name}吗?`,
        }) && await this.doDeleteBrand(brand)
      },

      doEditBrand: async function () {
        try {
          let res = await this.$remote.post({
            url: this.form.id ? '/brand/update' : '/brand/create',
            data: this.form,
          })
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
          this.showAddMenu = false
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
        } finally {
          await this.loadBrandList()
        }
      },
      doDeleteBrand: async function (brand) {
        try {
          let res = await this.$remote.post({
            url: '/brand/delete',
            data: {
              id: brand.id,
            },
          })
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
          this.showAddMenu = false
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
        } finally {
          await this.loadBrandList()
        }
      }
    },
  }
</script>

<style scoped>

</style>
