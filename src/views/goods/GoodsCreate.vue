<template>
    <v-card class="fill-height d-flex flex-column">
        <editor></editor>
    </v-card>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'
  export default {
    name: 'GoodsCreate',
    components:{
      Editor
    }
  }
</script>

<style scoped>

</style>
