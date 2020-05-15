<template>
    <v-card class="fill-height d-flex flex-column ma-3" flat>
        <div class="d-flex flex-row ma-3">
            <div
                    @drop="drop"
                    @dragover.prevent="endDrag"
                    @dragenter="enterDrag({id:0})"
                    class="flex-grow-1"
            >
                <v-alert type="info" dense v-if="dragOnItem.id === 0">
                    添加为根类目
                </v-alert>
            </div>
            <v-btn color="primary" @click="addCategory(0)">添加根类目</v-btn>
        </div>
        <v-treeview
                dense
                light
                class="expandable-tree"
                :items="categories"
                item-key="id"
                ref="category"
                hoverable
                open-all
                :open="opened"
                open-on-click
        >
            <template v-slot:append="{item}">
                <v-btn-toggle>
                    <v-btn small @click="addCategory(item.id)"  tile>
                        添加
                        <v-icon small>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn small @click="deleteCategory(item)" tile>
                        删除
                        <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn  small @click="editCategory(item)" tile>
                        编辑
                        <v-icon  small>mdi-menu</v-icon>
                    </v-btn>
                </v-btn-toggle>
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
                    <v-list-item-action>
                        <v-img class="image-icon grey lighten-2" :src="$path+item.iconUrl"></v-img>
                    </v-list-item-action>
                    <v-list-item-content class="subtitle-1">
                        <v-list-item-title >
                            {{item.name}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{item.description}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-treeview>
        <v-dialog width="50vw" v-model="showAddMenu" scrollable>
            <v-card>
                <v-card-title>{{form.id?'编辑类目':'添加类目'}}</v-card-title>
                <v-card-text>
                    <v-text-field label="类目名称" outlined v-model="form.name">
                    </v-text-field>
                    <v-textarea label="类目描述" outlined v-model="form.description">
                    </v-textarea>
                    <v-textarea label="类目关键字" outlined v-model="form.keywords">
                    </v-textarea>
                    <v-text-field type="number" label="排序值" outlined v-model="form.sortOrder">
                    </v-text-field>
                    <v-file-uploader
                            single
                            grid
                            hint="选择类目图片"
                            accept="image/*"
                            accept-only-path
                            produce-only-path
                            v-model="form.picUrl"
                    />
                    <v-file-uploader
                            single
                            grid
                            hint="选择类目图标"
                            accept="image/*"
                            accept-only-path
                            produce-only-path
                            v-model="form.iconUrl"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="doEditCategory">提交</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
  import VFileUploader from '@/components/file/VFileUploader'

  export default {
    name: 'CategoryManager',
    components: {
      VFileUploader,
    },
    data: function () {
      return {
        categories: [],
        opened: [],
        showAddMenu: false,
        form: {
          id: undefined,
          name: undefined,
          keywords: undefined,
          description: undefined,
          pid: undefined,
          iconUrl: undefined,
          picUrl: undefined,
          sortOrder: undefined,
        },
        dragOnItem: {},
      }
    },
    created: function () {
      this.loadCategoryList()
    },
    methods: {
      loadCategoryList: async function () {
        let res = await this.$remote.post({
          url: '/category/getAsTree',
        })
        let data = res.Data
        this.categories = data
        this.opened = this.flatTree([...data]).map(p => p.id)
      },

      flatTree: function (tree) {
        return tree.flatMap(leaf => {
          if (leaf.children) {
            let sub = this.flatTree(leaf.children)
            sub.push(leaf)
            return sub
          } else {
            return [leaf]
          }
        })
      },

      addCategory: function (pid) {
        this.form = {
          pid: pid,
        }
        this.showAddMenu = true
      },

      editCategory: function (category) {
        this.form = category
        this.showAddMenu = true
      },
      deleteCategory: async function (category) {
        await this.$messenger.confirm({
          msg: `确定删除${category.name}吗?`,
        }) && await this.doDeleteCategory(category)
      },

      doEditCategory: async function () {
        try {
          let res = await this.$remote.post({
            url: this.form.id ? '/category/update' : '/category/create',
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
          await this.loadCategoryList()
        }
      },
      doDeleteCategory: async function (category) {
        try {
          let res = await this.$remote.post({
            url: '/category/delete',
            data: {
              id: category.id,
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
          await this.loadCategoryList()
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
        await this.changeCategoryParent(item, this.dragOnItem)
        this.dragOnItem = {}
      },
      enterDrag: function (item) {
        this.dragOnItem = item
      },
      changeCategoryParent: async function (item, parent) {
        if (item.id === parent.id || item.pid === parent.id) {
          return
        }
        item.pid = parent.id
        try {
          let res = await this.$remote.post({
            url: '/category/update',
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
          await this.loadCategoryList()
        }
      },
    },

  }
</script>

<style>
</style>
