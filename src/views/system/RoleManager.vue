<template>
    <v-card class="fill-height d-flex flex-column">
        <v-card-title>
            <v-text-field
                    append-icon="mdi-account-search"
                    label="Search"
                    v-model="tableSettings.search"
                    single-line
                    @input="loadRolesData"
                    hide-details
            />
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
            <template v-slot:item.addTime="{item}">
                {{$moment(item.addTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
            <template v-slot:item.updateTime="{item}">
                {{$moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
            <template v-slot:item.operation="{item}">
                <v-row justify="space-around">
                    <v-btn small color="error" @click="deleteRole(item)">删除</v-btn>
                    <v-btn small color="info" @click="editRole(item)">编辑</v-btn>
                    <v-btn small color="warning">授权</v-btn>
                </v-row>
            </template>
            <template v-slot:header.operation>
                <v-btn small color="success" block text @click="addRole">添加角色</v-btn>
            </template>
        </v-data-table>
        <v-dialog v-model="showAddMenu" max-width="60vw">
            <v-card>
                <v-card-title>{{form.id?'编辑角色':'添加角色'}}</v-card-title>
                <v-card-text>
                    <v-text-field placeholder="角色名称(如operator)" v-model="form.name"/>
                    <v-text-field placeholder="角色描述" v-model="form.description"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doAddRole">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
  export default {
    name: 'RoleManager',
    data () {
      return {
        data: [],
        options: {},
        tableSettings: {
          search:undefined,
          headers: [
            {
              text: 'ID',
              value: 'id',
              sortable: false,
            },
            {
              text: '名称',
              value: 'name',
              sortable: false,
            },
            {
              text: '描述',
              value: 'description',
              sortable: false,
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
              text: '操作',
              value: 'operation',
              sortable: false,
              width:'190px'
            },
          ],
          loading: false,
          rowDict: [10, 20, 50],
          total: 0,
        },
        form:{
          id:undefined,
          name:undefined,
          description:undefined,
        },
        showAddMenu:false,
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
          this.loadRolesData()
        },
      },
    },
    methods: {
      loadRolesData: async function () {
        if(this.tableSettings.loading){
          return
        }
        let url = '/authorization/roles/get'
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

      addRole: function () {
        this.form = {}
        this.showAddMenu = true
      },
      deleteRole: async function (item) {
        await this.$messenger.confirm({
          msg: `确定删除${item.name}吗?`,
        }) && await this.doDeleteRole(item)
      },

      editRole: async function (item) {
        this.form = { ...item }
        this.showAddMenu = true
      },
      doDeleteRole: async function (item) {
        try {
          let res = await this.$remote.post({
            url: '/authorization/roles/delete',
            data: {
              id: item.id,
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
          this.loadRolesData()
        }
      },
      doAddRole: async function () {
        try {
          let res = await this.$remote.post({
            url: this.form.id ? '/authorization/roles/update' : '/authorization/roles/add',
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
          this.loadRolesData()
        }

      },
    },
  }
</script>

<style scoped>

</style>
