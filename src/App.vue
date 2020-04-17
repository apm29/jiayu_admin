<template>
  <v-app>
    <router-view></router-view>
    <notifications group="success" />
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>
