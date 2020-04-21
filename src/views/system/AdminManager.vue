<template>
    <v-card class="fill-height d-flex flex-column">
        <v-card-title>
            <v-text-field
                    append-icon="mdi-account-search"
                    label="Search"
                    v-model="tableSettings.search"
                    single-line
                    @input="loadUserData"
                    hide-details
            ></v-text-field>
        </v-card-title>
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
            <template v-slot:item.lastLoginTime="{item}">
                {{$moment(item.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
            <template v-slot:item.addTime="{item}">
                {{$moment(item.addTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
            <template v-slot:item.updateTime="{item}">
                {{$moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
  export default {
    name: 'AdminManager',
    data () {
      return {
        data: [],
        options: {},
        tableSettings: {
          search:undefined,
          headers: [
            {
              text: '账号',
              value: 'username',
              sortable: false,
            },
            {
              text: '上次登录时间',
              value: 'lastLoginTime',
            },
            {
              text: '创建时间',
              value: 'addTime',
            },
            {
              text: '更新时间',
              value: 'updateTime',
            },
            {
              text: 'ID',
              value: 'id',
              sortable: false,
            },
          ],
          loading: false,
          rowDict: [10, 20, 50],
          total: 0,
        },
      }
    },
    watch: {
      options: {
        deep: true,
        handler: function (val) {
          this.tableSettings.page = val.page
          this.tableSettings.rows = val.itemsPerPage
          this.tableSettings.sort = val.sortBy && val.sortBy[0];
          this.tableSettings.order = val.sortDesc && val.sortDesc[0] ? 'desc' : 'asc';
          if (val.sortDesc && val.sortDesc.length === 0) {
            this.tableSettings.order = undefined
          }
          this.loadUserData()
        },
      },
    },
    methods: {
      loadUserData: async function () {
        if(this.tableSettings.loading){
          return
        }
        let url = '/authorization/users'
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
    },
  }
</script>

<style scoped>

</style>
