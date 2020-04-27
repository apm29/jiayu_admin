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
            <template v-slot:header.operation>
                <v-btn text color="success" @click="addBrand">
                    <v-icon>mdi-plus</v-icon>
                    添加品牌
                </v-btn>
            </template>
        </v-data-table>
        <v-dialog width="50vw" v-model="showAddMenu">
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
              text: '图片',
              value: 'addTime',
            },
            {
              text: '低价',
              value: 'updateTime',
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
        let res = await this.$remote.post({
          url: '/brand/list',
        })
        this.data = res.Data.records
      },
      addBrand: function () {
        this.form = {}
        this.showAddMenu = true
      },
      editBrand: function (brand) {
        this.form = brand
        this.showAddMenu = true
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
    },
  }
</script>

<style scoped>

</style>
