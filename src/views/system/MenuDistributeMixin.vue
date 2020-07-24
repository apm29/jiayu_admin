<script>
  export default {
    name: 'MenuDistributeMixin',
    data: function () {
      return {
        showRoleMenuMenu: false,
        loadingRoleMenuMenu: false,
        role: undefined,
        roleMenu: [],
        menus: [],
      }
    },
    methods: {
      editRoleMenu: async function (role) {
        this.loadingRoleMenuMenu = true
        try {
          let resRoleMenu = await this.$remote.post({
            url: '/authorization/menu/byRole',
            data: role,
          })
          this.roleMenu = resRoleMenu.Data.map(p => p.id)
          let resAllMenu = await this.$remote.post({
            url: '/authorization/menu/getAsTree',
          })
          this.menus = resAllMenu.Data
          this.role = role
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
        } finally {
          this.showRoleMenuMenu = true
          this.loadingRoleMenuMenu = false
          this.$forceUpdate()
        }
      },

      doAddRoleMenu: async function () {
        this.showRoleMenuMenu = true
        try {
          let res = await this.$remote.post({
            url: '/authorization/roles/distributeMenu',
            data: {
              role: this.role,
              menus: this.roleMenu.map(id => {
                return {
                  id: id,
                }
              }),
            },
          })
          this.showRoleMenuMenu = false
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
        } finally {
          this.showRoleMenuMenu = false
          this.$emit('role-reload')
        }
      },
    },
  }
</script>

<style scoped>

</style>
