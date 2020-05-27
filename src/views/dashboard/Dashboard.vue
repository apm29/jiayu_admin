<template>
    <div>
       <v-container fluid>
            <div class="d-flex flex-row">
                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon x-large color="info">mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                       <v-list-item-title>用户数量</v-list-item-title>
                        <v-list-item-subtitle class="title font-weight-bold">{{mallInfo.wechatUserCount}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon x-large color="success">mdi-shopping</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>商品数量</v-list-item-title>
                        <v-list-item-subtitle class="title font-weight-bold">{{mallInfo.goodsCount}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon x-large color="primary">mdi-shopping-search</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>货品数量</v-list-item-title>
                        <v-list-item-subtitle class="title font-weight-bold">{{mallInfo.productsCount}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </div>
       </v-container>
    </div>
</template>

<script>
  export default {
    name: 'Dashboard',
    data:function(){
      return {
        mallInfo:{
          wechatUserCount:0,
          goodsCount:0,
          productsCount:0
        }
      }
    },
    created(){
      this.getMallInfo()
    },
    methods:{
      getMallInfo: async function () {
        let res = await this.$remote.post({
          url: "/statistics/mallInfo"
        })
        this.mallInfo = res.Data
      },
    }
  }
</script>

<style scoped>

</style>
