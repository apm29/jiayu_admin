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
                    @input="search"
                    :clear-icon="(clearable&&result)?'mdi-close':''"
                    :append-icon="showMenu?'mdi-menu-up':'mdi-menu-down'"
                    @click:append="showMenu=!showMenu"
                    :placeholder="placeholder"
            >
            </v-text-field>
        </template>
        <v-card>
            <load-more-list
                    @on-load-more="callLoadFunction"
                    :loading="settings.loading"
                    :has-more="this.settings.hasMore"
                    style="height: 25vh"
            >
                <v-list>
                    <template v-for="(item,index) of data">
                        <slot name="item" :item="item" :index="index">
                            <v-list-item @click="chooseItem(item,index)" :key="index+'item'">
                                {{item[itemLabel]}}
                            </v-list-item>
                        </slot>
                    </template>
                </v-list>
            </load-more-list>
        </v-card>
    </v-menu>
</template>

<script>
  import LoadMoreList from '@/components/list/LoadMoreList'

  export default {
    name: 'PagedMenu',
    components: { LoadMoreList },
    props: {
      result: {
        type: [Object,Number,String],
        default: undefined,
      },
      loadFunction: {
        type: Function,
        //约定返回{ data: [...] ,total:xxx}
        default: async function (pageNo, pageSize, order, sort, search, loading) {
          return await this.loadBrandList(pageNo, pageSize, order, sort, search, loading)
        },
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
      this.callLoadFunction()
    },
    data: function () {
      return {
        showMenu: false,
        searching:false,
        resultText: undefined,
        data: [],
        options: {},
        settings: {
          search: '',
          loading: false,
          hasMore: true,
          page: 1,
          rows: this.pageSize||20,
          total: 0,
        },
      }
    },
    watch: {
      result: {
        immediate: true,
        handler: function (val) {
          if(this.searching){
            return
          }
          let find = this.data.find((item) => {
            return item[this.itemValue] === val
          })
          if(find) {
            this.resultText = find[this.itemLabel]
          }
        },
      },
      data: {
        handler: function (val) {
          if(this.searching){
            return
          }
          let find = val.find((item) => {
            return item[this.itemValue] === this.result
          })
          if(find) {
            this.resultText = find[this.itemLabel]
          } else {
            this.callLoadFunction()
          }
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
            this.settings.search
          )
          this.data = this.data.concat(res.data)
          this.settings.total = res.total
          this.settings.hasMore = this.settings.total > this.data.length
          this.settings.page+=1
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
        this.resultText = val || ''
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
