### 加载更多示例
```js
export default {
    data:function () {
        return {
          list: [],
          pageInfo: {
            hasMore: true,
            loading: false,
          },
        }
    },
    //...
    methods:{
      
      loadPagedData: async function (refresh) {
        if (!this.pageInfo.hasMore && !refresh) {
          return;
        }
        if(this.pageInfo.loading){
          return;
        }
        if (refresh) {
          this.pageInfo.page = 1;
          this.pageInfo.hasMore = true;
          this.list = [];
        }

        try {
          this.pageInfo.loading = true;
          await this.delay(600)
          this.list = this.list.concat([0,1,2,3,4,5,6,7,8,9])
          if(this.list.length>=50){
            this.pageInfo.hasMore = false
          }
        } catch (e) {
        } finally {
          this.pageInfo.loading = false;
        }
      },
      delay: function (time) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, time)
        });
      },
    }
  }
```

> 需要在`@on-load-more` 回调中自己处理noMore,loading情况,组件为你做的唯一逻辑工作就是判断是否滚动到底部
> 需要自定义加载更多和loading样式可以使用`footer`slot

```html
    <v-card-text class="pa-0 d-flex flex-column" style="height: 500px">
    <div >
       <v-alert type="info" tile dense class="mb-0">这是一个固定高度的flex</v-alert>
    </div>
    <load-more-list @on-load-more="loadPagedData" :has-more="pageInfo.hasMore" :loading="pageInfo.loading" class="flex-grow-1 overflow-y-auto overflow-x-hidden">
        <template v-for="(item,index) of list">
            <v-list-item :key="index+'_list_item'" class="mt-3">
                <v-list-item-title>{{index}}</v-list-item-title>
                <v-list-item-subtitle>列表填充剩余高度</v-list-item-subtitle>
            </v-list-item>
            <v-divider class="lighten-3 grey"/>
        </template>
    </load-more-list>
    </v-card-text>
```

### 说明
组件的根元素div设置了`scroll`监听,默认的class是`overflow-y-auto overflow-x-hidden`
```js
export  default {
  //...
  methods:{
          onScroll: function (e) {
            let top = e.target.scrollTop
            let height = e.target.scrollHeight
            let visible = e.target.clientHeight
            this.bottom = height <= (top + visible + this.bottomThreshold)
            if (this.bottom) {
              this.$emit('on-load-more')
              this.firstLoading = false
            }
          },
    }
  }
```
