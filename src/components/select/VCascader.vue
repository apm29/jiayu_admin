<template>
    <div>
        <v-menu offset-y :close-on-content-click="false" v-model="showMenu" min-width="50px">
            <template v-slot:activator="{on}">
                <v-text-field v-on="on" :style="textFieldStyle"
                              readonly
                              flat
                              :dense="dense"
                              v-model="resultText"
                              :hide-details="hideDetail"
                              :rules="rules"
                              :disabled="disabled"
                              :outlined="outlined"
                              :label="label"
                              :persistent-hint="persistentHint"
                              :clearable="clearable"
                              :clear-icon="(clearable&&result)?'mdi-close':''"
                              @click:clear="clearResult"
                              :append-icon="showMenu?'mdi-menu-up':'mdi-menu-down'"
                              @click:append="showMenu=!showMenu"
                              :placeholder="placeholder">
                </v-text-field>
            </template>

            <div class="d-flex flex-row white">
                <v-sheet v-for="(subOptions,index) of cascade.keys()" :key="index+'cascade'" tile>
                    <v-list tile>
                        <v-list-item
                                :dense="dense"
                                v-for="(subOptionsItem,subIndex) of subOptions"
                                :key="subIndex+'sub'"
                                @click="(e)=>onItemClick(subOptionsItem,e)"
                                :value="subIndex"
                                :disabled="subOptionsItem[itemDisabled]"
                        >
                            <v-list-item-content>
                                <slot name="label" :subOptionsItem="subOptionsItem">
                                    <v-list-item-title>
                                        <span :class="{'blue--text':cascade.get(subOptions) === subIndex}"
                                              :style="labelStyle">
                                            {{subOptionsItem[itemLabel]}}
                                        </span>
                                    </v-list-item-title>
                                </slot>
                            </v-list-item-content>
                            <v-list-item-icon
                                    v-if="subOptionsItem[itemChildren] && subOptionsItem[itemChildren].length && subOptionsItem[itemChildren].length>0">
                                <v-icon x-small>mdi-chevron-right</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </v-sheet>
            </div>
        </v-menu>
    </div>
</template>

<script>

  export default {
    name: 'VCascader',
    props: {
      options: {
        type: Array,
        default: function () {
          return []
        },
      },
      result: {
        type: Array,
        default: function () {
          return []
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
      itemChildren: {
        type: String,
        default: 'children',
      },
      itemDisabled: {
        type: String,
        default: 'disabled',
      },
      separator: {
        type: String,
        default: '/',
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
      labelWidth: {
        type: Number,
        default: 160,
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
      rules: {
        type: Array,
        default: function () {
          return []
        },
      },
      label: {
        type: String,
      },
      showAllLevels: {
        type: Boolean,
        default: true,
      },
      changeOnSelect: {
        type: Boolean,
        default: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      persistentHint: {
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
      returnIndex: {
        type: Boolean,
        default: false,
      },
    },
    model: {
      prop: 'result',
      event: 'changeCascadeResult',
    },
    data: function () {
      return {
        cascade: new Map(),
        showMenu: false,
        resultText: undefined,
      }
    },
    watch: {
      options: {
        immediate: true,
        handler: function () {
          this.cascade.clear()
          this.cascade.set(this.options, -1)
        },
      },
      result: {
        immediate: true,
        handler: function (val) {
          if (this.returnObject) {
            let subOptions = this.options
            val.forEach(e=>{
                this.cascade.set(subOptions,subOptions.indexOf(e))
                subOptions = e[this.itemChildren]
            })
          } else if (this.returnIndex) {
            let subOptions = this.options
            val.forEach(e=>{
              this.cascade.set(subOptions,e)
              subOptions = subOptions[e][this.itemChildren]
            })
          } else {
            let subOptions = this.options
            val.forEach(e=>{
              let find = subOptions.find(o=>o[this.itemValue] === e)
              this.cascade.set(subOptions,subOptions.indexOf(find))
              subOptions = find[this.itemChildren]
            })
          }
          this.calculateStringResult(true)
        },
      },
      showAllLevels: {
        handler: function () {
          this.calculateStringResult()
        },
      },
      returnObject: {
        handler: function () {
          this.calculateStringResult()
        },
      },
    },
    methods: {
      findPath: function (item) {
        this.cascade.clear()
        let path = []
        let children = item[this.itemChildren]
        if (children && children.length > 0) {
          path.unshift(children)
          this.showMenu = true
        } else {
          this.showMenu = false
        }
        path.unshift(item)
        let parent = item._parent
        while (parent) {
          path.unshift(parent)
          parent = parent._parent
        }
        let options = this.options
        path.forEach(e => {
          this.cascade.set(options, options.indexOf(e))
          options = e[this.itemChildren]
        })
      },
      processOptions: function (options) {
        options.forEach(o => {
          if (o[this.itemChildren]) {
            o[this.itemChildren].forEach(oo => {
              oo._parent = o
            })
            this.processOptions(o[this.itemChildren])
          }
        })
        return options
      },

      onItemClick: function (item) {
        this.processOptions(this.options)
        this.findPath(item)
        let children = item[this.itemChildren]
        if (this.changeOnSelect || !children || children.length === 0) {
          this.calculateStringResult()
        }
        this.$forceUpdate()
      },
      clearResult: function () {
        this.cascade.clear()
        this.cascade.set(this.options, -1)
        this.calculateStringResult()
      },

      calculateStringResult: function (silent) {
        let indexResult = []
        let text = []
        let objectResult = []
        for (let key of this.cascade.keys()) {
          let index = this.cascade.get(key)
          if (index >= 0) {
            indexResult.push(index)
            objectResult.push(key[index])
          }
          if (key[index]) {
            let optionItem = key[index]
            text.push(optionItem[this.itemLabel])
          }
        }

        if (this.showAllLevels) {
          this.resultText = text.join(this.separator)
        } else {
          this.resultText = text[text.length - 1]
        }
        if (silent) {
          return
        }

        if (this.returnObject) {
          this.$emit('changeCascadeResult', objectResult)
        } else if (this.returnIndex) {
          this.$emit('changeCascadeResult', indexResult)
        } else {
          this.$emit('changeCascadeResult', objectResult.map(e => e[this.itemValue]))
        }
      },
    },

  }
</script>

<style scoped>

</style>
