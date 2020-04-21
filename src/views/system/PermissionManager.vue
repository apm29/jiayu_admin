<template>
    <v-container>
        <div class="d-flex flex-row">
            <v-spacer/>
            <v-btn color="primary" @click="addPermission(0)">添加根权限</v-btn>
        </div>
        <v-treeview :items="permissions" item-key="id">
            <template v-slot:append="{item}">
                <v-btn x-small @click="addPermission(item.id)" color="info" tile text>
                    添加子权限
                    <v-icon x-small>mdi-plus</v-icon>
                </v-btn>
                <v-btn x-small @click="deletePermission(item)" color="error" tile text>
                    删除权限
                    <v-icon x-small>mdi-delete</v-icon>
                </v-btn>
            </template>
            <template v-slot:label="{item}">
                <v-list-item>
                    <v-list-item-title>
                        {{item.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{item.permission}}
                    </v-list-item-subtitle>
                </v-list-item>
            </template>
        </v-treeview>
        <v-dialog v-model="showAddMenu" max-width="60vw">
            <v-card>
                <v-card-title>添加权限</v-card-title>
                <v-card-text>
                    <v-text-field placeholder="权限名称(如role_operation)" v-model="form.permission"/>
                    <v-text-field placeholder="权限描述" v-model="form.name"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doAddSubPermission">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
  export default {
    name: 'PermissionManager',
    data: function () {
      return {
        permissions: [],
        showAddMenu: false,
        form: {
          parentId: undefined,
          name: undefined,
          permission: undefined,
        },
      }
    },
    async mounted () {
      this.getPermissionTree()
    },
    methods: {
      getPermissionTree: async function () {
        let res = await this.$remote.post({
          url: '/authorization/permission/getAsTree',
        })
        this.permissions = res.Data
      },
      addPermission: function (parentId) {
        this.form = {
          parentId: parentId,
        }
        this.showAddMenu = true
      },
      deletePermission: async function (item) {
        await this.$messenger.confirm({
          msg: `确定删除${item.name}吗?`,
        }) && await this.doDeletePermission(item)
      },
      doDeletePermission: async function (item) {
        try {
          let res = await this.$remote.post({
            url: '/authorization/permission/delete',
            data: {
              id:item.id
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
          this.getPermissionTree()
        }
      },
      doAddSubPermission: async function () {
        try {
          let res = await this.$remote.post({
            url: '/authorization/permission/add',
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
          this.getPermissionTree()
        }

      },

    },
  }
</script>

<style scoped>

</style>
