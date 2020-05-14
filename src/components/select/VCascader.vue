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
        type: Array | Number,
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
      returnLeaf: {
        type: Boolean,
        default: false,
      },
      returnValue: {
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
          this.cascade.set(this.options, -1)
        },
      },
      result: {
        immediate: true,
        handler: function (val) {
          if(!this.options){
            return
          }
          this.cascade.clear()
          let subMenu = this.options
          console.log(subMenu)
          val.forEach((e)=>{
            let menu = subMenu.find((menu)=>{
              return menu[this.itemValue] === e
            })
            this.cascade.set(subMenu,subMenu.indexOf(menu))
            subMenu = menu[this.itemChildren]
          })
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
      onItemClick: function (item) {
        let deleteNext = false
        let deleteArr = []
        for (let key of this.cascade.keys()) {
          if (deleteNext) {
            deleteArr.push(key)
          }
          if (key.indexOf(item) !== -1) {
            this.cascade.set(key, key.indexOf(item))
            deleteNext = true
          }
        }
        for (let key of deleteArr) {
          this.cascade.delete(key)
        }
        let children = item[this.itemChildren]
        if (children) {
          this.cascade.set(children, -1)
          this.showMenu = !(children && children.length === 0)
        } else {
          this.showMenu = false
        }
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

      calculateStringResult: function (slient) {
        let result = []
        let text = []
        let objectResult = []
        for (let key of this.cascade.keys()) {
          let index = this.cascade.get(key)
          if (index >= 0) {
            result.push(index)
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
        if(slient){
          return
        }

        if (!this.returnObject) {
          if (this.returnLeaf) {
            if(this.returnValue){
              this.$emit('changeCascadeResult', objectResult.pop()[this.itemValue])
            }else {
              this.$emit('changeCascadeResult', result.pop())
            }
          } else {
            if(this.returnValue){
              this.$emit('changeCascadeResult',objectResult.map(e=>e[this.itemValue]))
            }else {
              this.$emit('changeCascadeResult', result)
            }
          }
        } else {
          if (this.returnLeaf) {
            if(this.returnValue){
              this.$emit('changeCascadeResult', objectResult.pop()[this.itemValue])
            }else {
              this.$emit('changeCascadeResult', objectResult.pop())
            }
          } else {
            if(this.returnValue){
              this.$emit('changeCascadeResult',objectResult.map(e=>e[this.itemValue]))
            }else {
              this.$emit('changeCascadeResult', objectResult)
            }
          }
        }
      },
    },

  }
</script>

<style scoped>

</style>
