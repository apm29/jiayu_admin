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
</style>
