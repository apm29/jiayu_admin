<template>
    <v-menu offset-y :close-on-content-click="false" v-model="showMenu" min-width="250px">
        <template v-slot:activator="{ on }">
            <v-text-field
                    :style="textFieldStyle"
                    flat
                    v-on="on"
                    :dense="dense"
                    v-model="resultText"
                    :hide-details="hideDetail"
                    :rules="rules"
                    :disabled="disabled"
                    :outlined="outlined"
                    :clearable="clearable"
                    :label="label"
                    :persistent-hint="persistentHint"
                    @click:clear="clear"
                    readonly
                    :clear-icon="(clearable&&result)?'mdi-close':''"
                    :append-icon="showMenu?'mdi-menu-up':'mdi-menu-down'"
                    @click:append="showMenu=!showMenu"
                    :placeholder="placeholder"
            >
            </v-text-field>
        </template>
        <v-card :loading="settings.loading" :disabled="settings.loading">
            <div class="pa-2 d-flex flex-row align-baseline">
                <v-text-field placeholder="搜索" v-model="settings.search" class="flex-grow-1" dense hide-details>
                </v-text-field>
                <v-btn class="ml-2" small @click="search(settings.search)" color="primary">搜索</v-btn>
            </div>
            <v-list :style="{maxHeight:menuHeight}" class="overflow-y-auto">
                <template v-for="(item,index) of data">
                    <slot name="item" :item="item" :index="index">
                        <v-list-item @click="chooseItem(item,index)" :key="index+'item'">
                            {{item[itemLabel]}}
                        </v-list-item>
                    </slot>
                </template>
            </v-list>
            <v-pagination
                    v-model="settings.page"
                    :length="parseInt(settings.total/settings.rows)"
            >
            </v-pagination>
        </v-card>
    </v-menu>
</template>

<script>
  export default {
    name: 'PagedMenu',
    props: {
      result: {
        type: [Object,Number,String],
        default: function () {
            return undefined;
        },
      },
      loadFunction: {
        type: Function,
        //约定返回{ data: [...] ,total:xxx}
        default: async function (pageNo, pageSize, search, loading) {
          return await this.loadBrandList(pageNo, pageSize, search, loading)
        },
      },
      menuHeight: {
        type: [Number,String],
        default: '30vh',
      },
      itemLabel: {
        type: String,
        default: 'label',
      },
      itemValue: {
        type: String,
        default: 'value',
      },
      placeholder: {
        type: String,
      },
      textFieldStyle: {
        type: Object,
        default: function () {
          return {}
        },
      },
      labelStyle: {
        type: Object,
        default: function () {
          return {}
        },
      },
      clearable: {
        type: Boolean,
        default: true,
      },
      dense: {
        type: Boolean,
        default: false,
      },
      hideDetail: {
        type: Boolean,
        default: false,
      },
      pageSize: {
        type: Number,
        default: 20,
      },
      rules: {
        type: Array,
        default: function () {
          return []
        },
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      outlined: {
        type: Boolean,
        default: false,
      },
      returnObject: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
      },
      persistentHint: {
        type: Boolean,
        default: false,
      },
    },
    model: {
      prop: 'result',
      event: 'menuSelectionChanged',
    },
    created () {
      console.log('created')
      this.callLoadFunction()
    },
    data: function () {
      return {
        showMenu: false,
        searching: false,
        resultText: undefined,
        data: [],
        options: {},
        settings: {
          search: '',
          loading: false,
          hasMore: true,
          page: 1,
          rows: this.pageSize || 20,
          total: 0,
        },
      }
    },
    watch: {
      result: {
        immediate: true,
        handler: function (val) {
          if (this.searching) {
            return
          }
          let find = this.data.find((item) => {
            return item[this.itemValue] === val
          })
          if (find) {
            this.resultText = find[this.itemLabel]
          }
        },
      },

      'settings.page': {
        handler: function () {
          this.callLoadFunction()
        },
      },
    },
    methods: {
      async callLoadFunction () {
        if (this.settings.loading || !this.settings.hasMore) {
          return
        }
        this.settings.loading = true
        try {
          let res = await this.loadFunction(
            this.settings.page,
            this.settings.rows,
            this.settings.search,
            this.settings.loading,
          )
          this.data = res.data
          this.settings.total = res.total
          this.settings.hasMore = this.settings.total > this.data.length
        } catch (e) {
          console.log(e)
        } finally {
          this.settings.loading = false
        }
      },
      loadBrandList: async function (pageNo, pageSize, search) {
        let url = '/brand/list'
        let data = {
          pageNo: pageNo,
          pageSize: pageSize,
          search: search,
        }
        try {
          let res = await this.$remote.post({
            url: url,
            data: data,
          })
          return {
            data: res.Data.records,
            total: parseInt(res.Data.total),
          }
        } catch (e) {
          console.log(e)
        }
      },
      search: function (val) {
        if (this.settings.loading) {
          return
        }
        this.settings.search = val || ''
        this.settings.page = 1
        this.settings.hasMore = true
        this.searching = true
        this.data = []
        this.callLoadFunction()
      },
      clear: function () {
        this.searching = false
        this.$emit('menuSelectionChanged', undefined)
      },
      chooseItem: function (item) {
        this.showMenu = false
        this.searching = false
        if (this.returnObject) {
          this.$emit('menuSelectionChanged', item)
        } else {
          this.$emit('menuSelectionChanged', item[this.itemValue])
        }

      },
    },
  }
</script>

<style scoped>

</style>
