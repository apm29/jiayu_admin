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
            <template v-slot:item.avatar="{item}">
                <v-list-item-avatar class="info lighten-1" size="60"   >
                    <v-img :src="$path+item.avatar" style="min-height: 60px" v-if="item.avatar"></v-img>
                    <span v-else class="title white--text">{{item.username.slice(0,1)}}</span>
                </v-list-item-avatar>
            </template>
            <template v-slot:item.roles="{item}">
                <v-chip-group>
                    <v-chip color="info" small v-for="(role) of item.roles" :key="role.id">{{role.name}}</v-chip>
                </v-chip-group>
            </template>
            <template v-slot:item.lastLoginTime="{item}">
                {{$moment(item.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
            <template v-slot:item.addTime="{item}">
                {{$moment(item.addTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
            <template v-slot:item.updateTime="{item}">
                {{$moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
            <template v-slot:item.operation="{item}">
                <v-row justify="space-around">
                    <v-btn small color="error" @click="deleteUser(item)">删除</v-btn>
                    <v-btn small color="info" @click="editUser(item)">编辑</v-btn>
                </v-row>
            </template>
            <template v-slot:header.operation>
                <v-btn small color="success" block text @click="addUser">添加管理员</v-btn>
            </template>
        </v-data-table>
        <v-dialog v-model="showAddMenu" max-width="40vw">
            <v-card>
                <v-card-title>{{form.id?'编辑管理员':'添加管理员'}}</v-card-title>
                <v-card-text>
                    <v-text-field placeholder="管理员名称(如admin)" v-model="form.username"/>
                    <v-text-field type="password" placeholder="管理员密码" v-model="form.password"/>
                    <v-select
                            v-model="form.roles"
                            :items="rolesDict"
                            label="选择角色"
                            item-value="id"
                            item-text="name"
                            chips
                            multiple
                            return-object
                    >

                    </v-select>
                    <v-file-uploader
                            single
                            grid
                            :upload="upload"
                            hint="选择管理员头像"
                            accept="image/*"
                            accept-only-path
                            produce-only-path
                            v-model="form.avatar"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doAddUser">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
  import VFileUploader from '@/components/uploader/VFileUploader'

  export default {
    name: 'AdminManager',
    components: { VFileUploader },
    data () {
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
              text: '头像',
              value: 'avatar',
              sortable: false,
            },
            {
              text: '账号',
              value: 'username',
              sortable: false,
            },
            {
              text: '角色',
              value: 'roles',
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
              text: '操作',
              value: 'operation',
              sortable: false,
              width: '180px',
            },
          ],
          loading: false,
          rowDict: [10, 20, 50],
          total: 0,
        },
        showAddMenu: false,
        form: {
          id: undefined,
          username: undefined,
          password: undefined,
          avatar: undefined,
          roles: [],
        },
        rolesDict: [],
      }
    },
    created () {
      this.loadRolesDict()
    },
    watch: {
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
          this.loadUserData()
        },
      },
    },
    methods: {
      loadRolesDict: async function () {
        let url = '/authorization/roles/get'
        try {
          let res = await this.$remote.post({
            url: url,
            data: {
              pageNo: 1,
              pageSize: 9999,
            },
          })
          this.rolesDict = res.Data.records
        } catch (e) {
          console.log(e)
        }
      },
      loadUserData: async function () {
        if (this.tableSettings.loading) {
          return
        }
        let url = '/authorization/users/get'
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

      deleteUser: async function (user) {
        await this.$messenger.confirm({
          msg: `确定删除${user.username}吗?`,
        }) && await this.doDeleteUser(user)
      },

      editUser: async function (user) {
        this.form = { ...user }
        this.showAddMenu = true
      },
      addUser: function () {
        this.form = {}
        this.showAddMenu = true
      },

      doDeleteUser: async function (user) {
        try {
          let res = await this.$remote.post({
            url: '/user/delete',
            data: {
              id: user.id,
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
          this.loadUserData()
        }
      },
      doAddUser: async function () {
        try {
          let res = await this.$remote.post({
            url: this.form.id ? '/user/update' : '/user/create',
            data: this.form,
          })
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
          let roleDispatchRes = await this.$remote.post({
            url: '/user/dispatchRoles',
            data: {
              user:this.form,
              roles:this.form.roles
            },
          })
          this.$notify({
            text: roleDispatchRes.Msg,
            type: 'success',
          })
          this.showAddMenu = false
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
        } finally {
          this.loadUserData()
        }

      },

      upload: async function (file) {
        let formData = new FormData()
        formData.append('file', file)
        try {
          let res = await this.$remote.upload({
            formData: formData,
            url: '/files/upload',
          })
          return res.Data.filePath
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
