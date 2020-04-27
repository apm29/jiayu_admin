<template>
    <v-card class="fill-height d-flex flex-column">
        <tiny-editor v-model="text" @textChange="onTextChange"/>
    </v-card>

</template>

<script>

  import TinyEditor from '@/components/editor/TinyEditor'
  import VCascader from '@/components/cascader/VCascader'
  export default {
    name: 'GoodsCreate',
    components: { VCascader, TinyEditor },
    data:function () {
        return {
          selection:[],
          text:'',
        }
    },
    methods:{
      onTextChange:function (val) {
        console.log(val)
      }
    }
  }
</script>

<style scoped>

</style>
