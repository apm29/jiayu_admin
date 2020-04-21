<template>
    <v-container>
        <v-treeview :items="permissions" item-key="id">
            <template v-slot:append="{item}">
                <v-btn text @click="addSubPermission(item)">
                    添加子权限
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn text @click="deleteSubPermission(item)">
                    删除权限
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </template>
            <template v-slot:label="{item}">
                {{item.name}}
            </template>
        </v-treeview>
        <v-dialog v-model="showAddMenu" max-width="60vw">
            <v-card>
                <v-card-title>添加权限</v-card-title>
                <v-card-text>
                    <v-text-field label="权限名称" v-model="form.permission"></v-text-field>
                    <v-text-field label="权限描述" v-model="form.name"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="doAddSubPermission">确定</v-btn>
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
      addSubPermission: function (item) {
        this.form = {
          parentId: item.id,
        }
        this.showAddMenu = true
      },
      deleteSubPermission: async function (item) {
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
