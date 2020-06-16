<template>
    <v-card flat>
        <div class="d-flex flex-row ma-3">
            <div
                    @drop="drop"
                    @dragover.prevent="endDrag"
                    @dragenter="enterDrag({id:0})"
                    class="flex-grow-1"
            >
                <v-alert type="info" dense v-if="dragOnItem.id === 0">
                    添加为根菜单
                </v-alert>
            </div>
            <v-btn color="primary" @click="addMenu(0)">添加根菜单</v-btn>
        </div>
        <v-treeview
                class="expandable-tree"
                :items="menus"
                item-key="id"
                ref="menu"
                hoverable
                open-all
                :open="opened"
                open-on-click
        >
            <template v-slot:append="{item}">
                <v-btn x-small @click="addMenu(item.id)" color="info" tile text>
                    添加
                    <v-icon x-small>mdi-plus</v-icon>
                </v-btn>
                <v-btn x-small @click="deleteMenu(item)" color="error" tile text>
                    删除
                    <v-icon x-small>mdi-delete</v-icon>
                </v-btn>
                <v-btn x-small @click="editMenu(item)" color="warning" tile text>
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
                        {{item.menu}}
                    </v-list-item-subtitle>
                </v-list-item>
            </template>
        </v-treeview>
        <v-dialog v-model="showAddMenu" max-width="60vw">
            <v-card>
                <v-card-title>{{form.id?'编辑菜单':'添加菜单'}}</v-card-title>
                <v-card-text>
                    <v-text-field placeholder="菜单名称" v-model="form.name"/>
                    <v-text-field placeholder="菜单地址(如role_operation)" v-model="form.path"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doAddSubMenu">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
  export default {
    name: 'MenuManager',
    data: function () {
      return {
        menus: [],
        opened: [],
        showAddMenu: false,
        form: {
          parentId: undefined,
          name: undefined,
          path: undefined,
        },
        dragOnItem: {},
      }
    },
    async mounted () {
      await this.getMenuTree()
    },
    methods: {
      getMenuTree: async function () {
        let res = await this.$remote.post({
          url: '/authorization/menu/getAsTree',
        })
        let data = res.Data
        this.menus = data
        this.opened = this.flatTree([...data]).map(p=>p.id)
      },

      flatTree:function(tree){
        return tree.flatMap(leaf=>{
          if(leaf.children){
            let sub = this.flatTree(leaf.children)
            sub.push(leaf)
            return sub
          }else {
            return [leaf]
          }
        })
      },
      addMenu: function (parentId) {
        this.form = {
          parentId: parentId,
        }
        this.showAddMenu = true
      },
      deleteMenu: async function (item) {
        await this.$messenger.confirm({
          msg: `确定删除${item.name}吗?`,
        }) && await this.doDeleteMenu(item)
      },

      editMenu: async function (item) {
        this.form = { ...item }
        this.showAddMenu = true
      },
      doDeleteMenu: async function (item) {
        try {
          let res = await this.$remote.post({
            url: '/authorization/menu/delete',
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
          await this.getMenuTree()
        }
      },
      doAddSubMenu: async function () {
        try {
          let res = await this.$remote.post({
            url: this.form.id ? '/authorization/menu/update' : '/authorization/menu/add',
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
          await this.getMenuTree()
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
        await this.changeMenuParent(item,this.dragOnItem)
        this.dragOnItem = {}
      },
      enterDrag: function (item) {
        this.dragOnItem = item
      },
      changeMenuParent:async function (item,parent) {
        if(item.id === parent.id || item.parentId === parent.id){
          return
        }
        item.parentId = parent.id
        try {
          let res = await this.$remote.post({
            url: '/authorization/menu/update',
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
          await this.getMenuTree()
        }
      }
    },
  }
</script>

<style>
</style>
