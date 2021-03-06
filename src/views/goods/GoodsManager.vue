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
            <template v-slot:item.brief="{item}">
                <div style="width: 150px" class="text-truncate">{{item.brief}}</div>
            </template>
            <template v-slot:item.picUrl="{item}">
                <v-image-viewer img-class="image-thumbnail" :src="$path+item.picUrl"></v-image-viewer>
            </template>
            <template v-slot:header.operation>
                <v-btn text color="success" @click="addGoods">
                    <v-icon>mdi-plus</v-icon>
                    添加商品
                </v-btn>
            </template>
            <template v-slot:item.operation="{item}">
                <v-row justify="start">
                    <v-btn small color="info" @click="editGoods(item)" class="mr-2">编辑</v-btn>
                    <v-btn small color="error"  @click="deleteGoods(item)">删除</v-btn>
                </v-row>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
  import VImageViewer from '@/components/image/VImageViewer'
  export default {
    name: 'GoodsManager',
    components: { VImageViewer },
    data:function () {
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
                text: '商品编号',
                value: 'goodsSn',
                sortable: false,
              },
              {
                text: '商品名称',
                value: 'name',
                sortable: false,
              },
              {
                text: '简介',
                value: 'brief',
                sortable: false,
                width: 150
              },
              {
                text: '排序',
                value: 'sortOrder',
              },
              {
                text: '图片',
                value: 'picUrl',
                sortable: false,
              },
              {
                text: '操作',
                value: 'operation',
                sortable: false,
                width: 160
              },
            ],
            loading: false,
            rowDict: [10, 20, 50],
            total: 0,
          },
        }
    },
    mounted () {
      this.loadGoodsList()
    },
    watch:{
      '$route.query.timestamp':{
        handler:function (val) {
            if(val){
              this.loadGoodsList()
            }
        }
      },
      options: {
        deep: true,
        handler: function (val) {
          this.tableSettings.page = val.page
          this.tableSettings.rows = val.itemsPerPage
          this.tableSettings.sort = val.sortBy && val.sortBy[0]
          this.tableSettings.order = val.sortDesc && val.sortDesc[0] ? 'desc' : 'asc'
          if (val.sortDesc && val.sortDesc.length === 0) {
            this.tableSettings.order = undefined
          }
          this.loadGoodsList()
        },
      },
    },
    methods: {
      loadGoodsList: async function () {
        if (this.tableSettings.loading) {
          return
        }
        let url = '/goods/list'
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
      addGoods: function () {
        this.$router.push({
          path:"/goods/create"
        })
      },
      editGoods: function (goods) {
        this.$router.push({
          path:"/goods/create",
          query:{
            id:goods.id
          }
        })
      },
      deleteGoods: async function (goods) {
        await this.$messenger.confirm({
          msg: `确定删除${goods.name}吗?`,
        }) && await this.doDeleteGoods(goods)
      },

      doDeleteGoods: async function (goods) {
        try {
          let res = await this.$remote.post({
            url: '/goods/delete',
            data: {
              id: goods.id,
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
          await this.loadGoodsList()
        }
      }
    },
  }
</script>

<style scoped>

</style>
