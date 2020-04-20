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
        <v-btn @click="alert">Alert</v-btn>
        <v-btn @click="toast">Toast</v-btn>
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
      logout: async function () {
        let logout = await this.$messenger.confirm({
          msg: "确定退出吗?"
        })
        console.log(logout)
        if(logout) {
          this.$validator.logout()
        }
      },
      alert: async function () {
        let logout = await this.$messenger.alert({
          msg: "ALERT!"
        })
        console.log(logout)
      },
      toast: async function () {
        let logout = await this.$messenger.toast({
          msg: "TOAST"
        })
        console.log(logout)
      }
    }
  }
</script>

<style scoped>

</style>
