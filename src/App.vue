<template>
  <v-app>
    <router-view/>
    <notifications/>
  </v-app>
</template>
<script>
export default {
  name: 'App',
  async mounted () {
    await this.$delay(800)
    document.getElementById('loading-view').remove();
  },
};
</script>
<style>
  .image-thumbnail{
    width: 90px;
  }
  .image-icon{
    width: 50px;
    height: 50px;
  }
  .expandable-tree .v-treeview-node__content {
    background-color: #ffffff !important;
    margin-bottom: 2px;
    box-shadow: 1px 1px 3px #e9edf5;
    padding-right: 12px;
  }
</style>
