
### 使用样例
```html
<v-cascader
         :options="options"
          v-model="result"
          :disabled="disabled"
          :clearable="clearable"
          :dense="dense"
          :outlined="outlined"
          :return-object="returnObject"
          placeholder="选择一个"
          :label-style="labelStyle?{
           color:'grey',
           'font-size':'large'
         }:{}"
          :change-on-select="changeOnSelect"
          :show-all-levels="showAllLevels"
          @changeCascadeResult="onChangeItem"
  >
  </v-cascader>
```

### 数据结构
以`options`为基础数据,`cascade`的首个Entry必定为`{options -> -1}`,
之后每次点击节点项将为`cascade`插入新的键值对,例如选择了options的第二项,则新生成的`cascade`
数据结构为 `{options -> 1, options[1] -> -1 }`,直到选择最后的叶子节点之前,map的最后一项value都是-1,key为最右边展示的列表对应的Array
```js
export default {
  //...
  data: function () {
        return {
          //下拉菜单结构存储在一个map中,以optionsArray为Key,已选项index为Value
          cascade: new Map(),
          showMenu: false,
          //文本框显示的数据
          resultText: undefined,
        }
   }, 
  
  //...
}
```
