<template>
    <div>
        <ol>
            <li v-for="(kitItem) of kitType" :key="kitItem.id">
                {{kitItem}}
            </li>
        </ol>
        <ol>
            <li v-for="(role) of roles" :key="role.id">
                {{role}}
            </li>
        </ol>
        <v-btn @click="getKit">Kit</v-btn>
        <v-btn @click="getRoles">Roles</v-btn>
        <v-btn @click="logout">Logout</v-btn>
    </div>
</template>

<script>
  export default {
    name: 'DashBoard',
    data:function(){
      return {
        kitType:[],
        roles:[],
      }
    },
    methods:{
      getKit: async function () {
        let res = await this.$remote.post({
          url: "/kitType/getAsTree"
        })
        console.log(res)
        this.kitType = res.Data
      },
      getRoles: async function () {
        let res = await this.$remote.post({
          url: "/authorization/roles"
        })
        console.log(res)
        this.roles = res.Data
      },
      logout:function () {
        this.$validator.logout()
      }
    }
  }
</script>

<style scoped>

</style>
