<template>
    <v-container>
        <div class="d-flex flex-row">
            <div
                    @drop="drop"
                    @dragover.prevent="endDrag"
                    @dragenter="enterDrag({id:0})"
                    class="flex-grow-1"
            >
                <v-alert type="info" dense v-if="dragOnItem.id === 0">
                    添加为根权限
                </v-alert>
            </div>
            <v-btn color="primary" @click="addPermission(0)">添加根权限</v-btn>
        </div>
        <v-treeview :items="permissions" item-key="id" hoverable open-all>
            <template v-slot:append="{item}">
                <v-btn x-small @click="addPermission(item.id)" color="info" tile text>
                    添加
                    <v-icon x-small>mdi-plus</v-icon>
                </v-btn>
                <v-btn x-small @click="deletePermission(item)" color="error" tile text>
                    删除
                    <v-icon x-small>mdi-delete</v-icon>
                </v-btn>
                <v-btn x-small @click="editPermission(item)" color="warning" tile text>
                    编辑
                    <v-icon x-small>mdi-menu</v-icon>
                </v-btn>
            </template>
            <template v-slot:label="{item}">
                <v-list-item
                        :draggable="true"
                        @dragstart="(e)=>startDrag(e,item)"
                        @drop="drop"
                        @dragover.prevent="endDrag"
                        @dragenter="enterDrag(item)"
                        :dark="dragOnItem === item"
                        :class="{ 'info':dragOnItem === item, 'lighten-1':dragOnItem === item}"
                >
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
                <v-card-title>{{form.id?'编辑权限':'添加权限'}}</v-card-title>
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
        dragOnItem: {},
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

      editPermission: async function (item) {
        this.form = { ...item }
        this.showAddMenu = true
      },
      doDeletePermission: async function (item) {
        try {
          let res = await this.$remote.post({
            url: '/authorization/permission/delete',
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
          this.getPermissionTree()
        }
      },
      doAddSubPermission: async function () {
        try {
          let res = await this.$remote.post({
            url: this.form.id ? '/authorization/permission/update' : '/authorization/permission/add',
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

      startDrag: function (event, item) {
        event.dataTransfer.setData('item', JSON.stringify(item))
      },
      endDrag (event) {
        event.dataTransfer.clearData()
      },
      async drop (event) {
        let data = event.dataTransfer.getData('item')
        let item = JSON.parse(data)
        await this.changePermissionParent(item,this.dragOnItem)
        this.dragOnItem = {}
      },
      enterDrag: function (item) {
        this.dragOnItem = item
      },
      changePermissionParent:async function (item,parent) {
        if(item.id === parent.id || item.parentId === parent.id){
          return
        }
        item.parentId = parent.id
        try {
          let res = await this.$remote.post({
            url: '/authorization/permission/update',
            data: item,
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
      }
    },
  }
</script>

<style scoped>

</style>
