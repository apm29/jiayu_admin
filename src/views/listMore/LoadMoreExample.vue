<template>
    <v-container fluid class="fill-height d-flex flex-column">
        <v-btn color="info" @click="loadPagedData(true)" fab fixed right bottom>重置</v-btn>
        <div class="flex-grow-1 overflow-y-auto overflow-x-hidden" style="width: 100%">
            <v-card class="my-3" outlined>
                <v-card-title
                        class="grey lighten-3"
                >
                    演示
                </v-card-title>
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
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-title
                        class="grey lighten-3"
                >
                    props说明
                </v-card-title>
                <v-card-text>
                    <ol class="pt-2">
                        <li>hasMore：是否还有更多,用于控制默认footer的显示,默认值 true</li>
                        <li>loading：是否在加载中，用于控制默认footer的显示,默认值 false</li>
                        <li>bottomThreshold：触发loadMore时距离底部的阈值,默认值 100(单位px)</li>
                        <li>skeletonCount：站位用的skeleton个数,默认值 3</li>
                        <li>skeletonType：站位用的skeleton类型,默认值 list-item-avatar-three-line</li>
                    </ol>
                </v-card-text>
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-title
                        class="grey lighten-3"
                >
                    event说明
                </v-card-title>
                <v-card-text>
                    <ol class="pt-2">
                        <li>on-load-more：列表滚到到底部时触发,需要自行控制loading,loadMore属性的修改,；</li>
                    </ol>
                </v-card-text>
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-title
                        class="grey lighten-3"
                >
                    slot说明
                </v-card-title>
                <v-card-text>
                    <ol class="pt-2">
                        <li>default：默认插槽,用于放List数据</li>
                        <li>footer：自定义Footer；{loading , hasMore}为slot的prop(就是传进来的prop),类型为Boolean</li>
                    </ol>
                </v-card-text>
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-text>
                    <markdown-editor preview :value="markdown"></markdown-editor>
                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>

<script>
  import LoadMoreList from './LoadMoreList'
  import MarkdownEditor from '../../pc/markdown/MarkdownEditor'
  import dio from '../../pc/uploader/dio'
  export default {
    name: 'LoadMoreExample',
    components:{
      LoadMoreList,MarkdownEditor
    },
    data:function () {
        return {
          list: [],
          pageInfo: {
            hasMore: true,
            loading: false,
          },
          markdown:undefined
        }
    },
    created: async function () {
      this.loadPagedData(true)
      this.markdown = await dio.downloadLocal('/markdown/load-more.md')
    },
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
</script>

<style scoped>

</style>
