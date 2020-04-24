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

        </v-data-table>
    </v-card>
</template>

<script>
  export default {
    name: 'BrandManager',
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
          form: {
            id: undefined,
            name: undefined,
            description: undefined,
          },
        }
    },
    created:function () {
        this.loadBrandList()
    },
    methods:{
      loadBrandList:async function () {
        let res = await this.$remote.post({
          url: '/brand/list'
        })
        console.log(res)
        this.data = res.Data.records
      }
    }
  }
</script>

<style scoped>

</style>
